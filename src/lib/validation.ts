export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidUrl(url: string): boolean {
  if (!url.trim()) return false;
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    return Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

export function sanitizeText(value: string, maxLength = 2000): string {
  return value.trim().slice(0, maxLength);
}

export interface FieldError {
  field: string;
  message: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  website: string;
  revenue: string;
  helpWith: string;
  details: string;
  website_honeypot?: string;
}

export function validateContactForm(data: ContactFormData): FieldError[] {
  const errors: FieldError[] = [];

  if (data.website_honeypot) {
    errors.push({ field: "form", message: "Unable to submit." });
    return errors;
  }

  if (!data.name.trim()) {
    errors.push({ field: "name", message: "Please enter your name." });
  }

  if (!data.email.trim()) {
    errors.push({ field: "email", message: "Please enter your work email." });
  } else if (!isValidEmail(data.email)) {
    errors.push({ field: "email", message: "Please enter a valid email address." });
  }

  if (!data.company.trim()) {
    errors.push({ field: "company", message: "Please enter your brand or company name." });
  }

  if (!data.website.trim()) {
    errors.push({ field: "website", message: "Please enter your website URL." });
  } else if (!isValidUrl(data.website)) {
    errors.push({ field: "website", message: "Please enter a valid URL." });
  }

  if (!data.revenue) {
    errors.push({ field: "revenue", message: "Please select a revenue range." });
  }

  if (!data.helpWith) {
    errors.push({ field: "helpWith", message: "Please tell us what you need help with." });
  }

  if (!data.details.trim()) {
    errors.push({ field: "details", message: "Please share a few project details." });
  } else if (data.details.trim().length < 20) {
    errors.push({
      field: "details",
      message: "Please add a bit more detail (at least 20 characters).",
    });
  }

  return errors;
}

export function validateLeadMagnetEmail(email: string): string | null {
  if (!email.trim()) return "Please enter your email address.";
  if (!isValidEmail(email)) return "Please enter a valid email address.";
  return null;
}
