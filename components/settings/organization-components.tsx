"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type OrganizationFormProps = {
  organization: {
    name: string;
    slug: string;
    logoUrl: string | null;
    tagline: string | null;
    website: string | null;
    contactEmail: string | null;
    supportPhone: string | null;
  };
  branding: {
    appName: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    lightLogoUrl: string | null;
    darkLogoUrl: string | null;
    faviconUrl: string | null;
    splashImageUrl: string | null;
    customDomain: string | null;
  };
};

export function BrandingCard({ branding }: Pick<OrganizationFormProps, "branding">) {
  return (
    <div className="rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)]" id="branding">
      <h2 className="text-base font-semibold text-foreground">Branding Engine</h2>
      <p className="mt-2 text-sm text-muted-foreground">Dynamic app name, colors, logos, splash screen, login branding, and future white-label support.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[branding.primaryColor, branding.secondaryColor, branding.accentColor].map((color) => <div className="h-20 rounded-3xl" style={{ backgroundColor: color }} key={color} />)}
      </div>
    </div>
  );
}

export function OrganizationSettingsForm({ organization, branding }: OrganizationFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  async function submit(formData: FormData) {
    setMessage(null);
    const response = await fetch("/api/settings/organization", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(formData.get("name")),
        slug: String(formData.get("slug")),
        logoUrl: String(formData.get("logoUrl") || ""),
        tagline: String(formData.get("tagline") || ""),
        website: String(formData.get("website") || ""),
        contactEmail: String(formData.get("contactEmail") || ""),
        supportPhone: String(formData.get("supportPhone") || ""),
      }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: "Unable to save organization." }));
      setMessage(payload.error || "Unable to save organization.");
      return;
    }
    setMessage("Organization saved.");
    router.refresh();
  }

  async function saveBranding(formData: FormData) {
    setMessage(null);
    const response = await fetch("/api/settings/organization", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ branding: Object.fromEntries(formData) }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: "Unable to save branding." }));
      setMessage(payload.error || "Unable to save branding.");
      return;
    }
    setMessage("Branding saved.");
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <form action={submit} className="space-y-4 rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
        <h2 className="text-base font-semibold text-foreground">Organization Profile</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <input className="min-h-11 rounded-2xl border border-input px-3 text-sm" name="name" defaultValue={organization.name} placeholder="Organization name" />
          <input className="min-h-11 rounded-2xl border border-input px-3 text-sm" name="slug" defaultValue={organization.slug} placeholder="Slug" />
          <input className="min-h-11 rounded-2xl border border-input px-3 text-sm" name="logoUrl" defaultValue={organization.logoUrl || ""} placeholder="Logo URL" />
          <input className="min-h-11 rounded-2xl border border-input px-3 text-sm" name="tagline" defaultValue={organization.tagline || ""} placeholder="Tagline" />
          <input className="min-h-11 rounded-2xl border border-input px-3 text-sm" name="website" defaultValue={organization.website || ""} placeholder="Website" />
          <input className="min-h-11 rounded-2xl border border-input px-3 text-sm" name="contactEmail" defaultValue={organization.contactEmail || ""} placeholder="Contact email" />
          <input className="min-h-11 rounded-2xl border border-input px-3 text-sm" name="supportPhone" defaultValue={organization.supportPhone || ""} placeholder="Support phone" />
        </div>
        <button className="min-h-11 rounded-2xl bg-[#6E4BD8] px-5 text-sm font-semibold text-white" type="submit">Save organization</button>
      </form>
      <BrandingCard branding={branding} />
      <form action={saveBranding} className="space-y-4 rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
        <h2 className="text-base font-semibold text-foreground">White-label Branding</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(branding).map(([key, value]) => <input className="min-h-11 rounded-2xl border border-input px-3 text-sm" name={key} defaultValue={String(value || "")} placeholder={key} key={key} />)}
        </div>
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
        <button className="min-h-11 rounded-2xl bg-[#6E4BD8] px-5 text-sm font-semibold text-white" type="submit">Save branding</button>
      </form>
    </div>
  );
}
