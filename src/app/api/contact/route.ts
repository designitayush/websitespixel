import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";
import { validateContactForm, sanitizeText, type ContactFormData } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const data: ContactFormData = {
      name: sanitizeText(body.name ?? "", 200),
      email: sanitizeText(body.email ?? "", 320),
      company: sanitizeText(body.company ?? "", 200),
      website: sanitizeText(body.website ?? "", 500),
      revenue: sanitizeText(body.revenue ?? "", 100),
      helpWith: sanitizeText(body.helpWith ?? "", 200),
      details: sanitizeText(body.details ?? "", 2000),
      website_honeypot: body.website_honeypot ?? "",
    };

    const errors = validateContactForm(data);
    if (errors.length > 0) {
      return NextResponse.json(
        { error: errors[0].message, fields: errors },
        { status: 400 }
      );
    }

    if (siteConfig.contactFormEndpoint) {
      const upstream = await fetch(siteConfig.contactFormEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          website_honeypot: undefined,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!upstream.ok) {
        return NextResponse.json(
          { error: "Unable to process your inquiry. Please try again later." },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
