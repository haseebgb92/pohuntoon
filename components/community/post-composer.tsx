"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { CommunitySpaceSummary } from "@/lib/community/types";

export function PostComposer({ spaces }: { spaces: CommunitySpaceSummary[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(formData: FormData) {
    setSubmitting(true);
    setMessage(null);
    const response = await fetch("/api/community/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        spaceId: String(formData.get("spaceId")),
        type: String(formData.get("type")),
        title: String(formData.get("title")),
        body: String(formData.get("body")),
        attachments: [],
        pollOptions: String(formData.get("pollOption") || "") ? [String(formData.get("pollOption"))] : [],
      }),
    });
    const payload = await response.json().catch(() => ({ error: "Unable to publish post." }));
    setSubmitting(false);

    if (!response.ok) {
      setMessage(payload.error || "Unable to publish post.");
      return;
    }

    setOpen(false);
    router.push(`/app/community/post/${payload.postId}`);
    router.refresh();
  }

  return (
    <>
      <button className="fixed bottom-24 right-4 z-30 flex min-h-14 items-center rounded-full bg-[#6E4BD8] px-5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(110,75,216,0.32)] lg:hidden" onClick={() => setOpen(true)} type="button">
        Create
      </button>
      <div className="hidden rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)] lg:block">
        <ComposerForm message={message} onSubmit={submit} spaces={spaces} submitting={submitting} />
      </div>
      {open ? (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto rounded-t-[2rem] bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Create post</h2>
              <button className="min-h-11 rounded-2xl bg-surface px-4 text-sm font-medium" onClick={() => setOpen(false)} type="button">Close</button>
            </div>
            <ComposerForm message={message} onSubmit={submit} spaces={spaces} submitting={submitting} />
          </div>
        </div>
      ) : null}
    </>
  );
}

type ComposerFormProps = {
  spaces: CommunitySpaceSummary[];
  submitting: boolean;
  message: string | null;
  onSubmit: (formData: FormData) => void;
};

function ComposerForm({ spaces, submitting, message, onSubmit }: ComposerFormProps) {
  return (
    <form action={onSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <select className="min-h-11 rounded-2xl border border-input px-3 text-sm" name="spaceId" required>
          {spaces.map((space) => <option key={space.id} value={space.id}>{space.name}</option>)}
        </select>
        <select className="min-h-11 rounded-2xl border border-input px-3 text-sm" name="type" defaultValue="DISCUSSION">
          <option value="ANNOUNCEMENT">Announcement</option>
          <option value="QUESTION">Question</option>
          <option value="DISCUSSION">Discussion</option>
          <option value="WIN">Win</option>
          <option value="RESOURCE_SHARE">Resource Share</option>
        </select>
      </div>
      <input className="min-h-11 w-full rounded-2xl border border-input px-3 text-sm" name="title" placeholder="What should the community know?" required />
      <textarea className="min-h-28 w-full rounded-2xl border border-input px-3 py-3 text-sm" name="body" placeholder="Share context, ask a question, or celebrate a win..." required />
      <input className="block w-full rounded-2xl border border-input px-3 py-2 text-sm" multiple name="attachments" type="file" />
      <input className="min-h-11 w-full rounded-2xl border border-dashed border-input px-3 text-sm" name="pollOption" placeholder="Poll option placeholder" />
      {message ? <p className="rounded-2xl bg-surface px-3 py-2 text-sm text-muted-foreground">{message}</p> : null}
      <button className="min-h-11 w-full rounded-2xl bg-[#6E4BD8] px-4 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(110,75,216,0.22)] disabled:opacity-60" disabled={submitting} type="submit">
        {submitting ? "Publishing..." : "Publish post"}
      </button>
    </form>
  );
}
