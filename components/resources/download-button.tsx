import Link from "next/link";

export function DownloadButton({
  resourceId,
  label = "Download",
}: {
  resourceId: string;
  label?: string;
}) {
  return (
    <Link
      className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
      href={`/api/resources/${resourceId}/download`}
      prefetch={false}
    >
      {label}
    </Link>
  );
}
