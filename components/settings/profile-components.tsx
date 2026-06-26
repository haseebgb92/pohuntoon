"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ProfileFormProps = {
  profile: {
    name: string;
    email: string;
    avatarUrl: string | null;
    phone: string | null;
    jobTitle: string | null;
    bio: string | null;
  };
};

export function AvatarUploader({ avatarUrl, name }: { avatarUrl: string | null; name: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex size-20 items-center justify-center rounded-[2rem] bg-[#6E4BD8]/10 text-xl font-bold text-[#6E4BD8]">{name.slice(0, 2).toUpperCase()}</div>
      <label className="block">
        <span className="text-sm font-semibold text-foreground">Avatar</span>
        <input accept="image/*" capture="user" className="mt-2 block w-full rounded-2xl border border-input px-3 py-2 text-sm" name="avatarUrl" placeholder={avatarUrl || "Avatar URL"} />
      </label>
    </div>
  );
}

export function ProfileHeader({ profile }: ProfileFormProps) {
  return (
    <section className="rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
      <div className="flex items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-3xl bg-[#6E4BD8] text-lg font-bold text-white">{profile.name.slice(0, 2).toUpperCase()}</div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">{profile.name}</h2>
          <p className="text-sm text-muted-foreground">{profile.jobTitle || "Pohuntoon member"} • {profile.email}</p>
        </div>
      </div>
    </section>
  );
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  async function submit(formData: FormData) {
    setMessage(null);
    const response = await fetch("/api/settings/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(formData.get("name")),
        avatarUrl: String(formData.get("avatarUrl") || ""),
        phone: String(formData.get("phone") || ""),
        jobTitle: String(formData.get("jobTitle") || ""),
        bio: String(formData.get("bio") || ""),
      }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: "Unable to save profile." }));
      setMessage(payload.error || "Unable to save profile.");
      return;
    }
    setMessage("Profile saved.");
    router.refresh();
  }

  return (
    <form action={submit} className="space-y-4 rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
      <AvatarUploader avatarUrl={profile.avatarUrl} name={profile.name} />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2"><span className="text-sm font-medium">Name</span><input className="min-h-11 w-full rounded-2xl border border-input px-3 text-sm" name="name" defaultValue={profile.name} required /></label>
        <label className="space-y-2"><span className="text-sm font-medium">Phone</span><input className="min-h-11 w-full rounded-2xl border border-input px-3 text-sm" name="phone" defaultValue={profile.phone || ""} /></label>
        <label className="space-y-2"><span className="text-sm font-medium">Job Title</span><input className="min-h-11 w-full rounded-2xl border border-input px-3 text-sm" name="jobTitle" defaultValue={profile.jobTitle || ""} /></label>
        <label className="space-y-2"><span className="text-sm font-medium">Email</span><input className="min-h-11 w-full rounded-2xl border border-input px-3 text-sm" defaultValue={profile.email} disabled /></label>
      </div>
      <label className="space-y-2 block"><span className="text-sm font-medium">Bio</span><textarea className="min-h-28 w-full rounded-2xl border border-input px-3 py-3 text-sm" name="bio" defaultValue={profile.bio || ""} /></label>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      <button className="sticky bottom-24 min-h-11 rounded-2xl bg-[#6E4BD8] px-5 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(110,75,216,0.22)] lg:static" type="submit">Save profile</button>
    </form>
  );
}
