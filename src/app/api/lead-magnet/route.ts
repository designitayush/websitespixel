import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";
import { validateLeadMagnetEmail, sanitizeText } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = sanitizeText(body.email ?? "", 320);

    const error = validateLeadMagnetEmail(email);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    if (siteConfig.leadMagnetEndpoint) {
      const upstream = await fetch(siteConfig.leadMagnetEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "lead-magnet-checklist" }),
      });

      if (!upstream.ok) {
        return NextResponse.json(
          { error: "Unable to process your request. Please try again later." },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
