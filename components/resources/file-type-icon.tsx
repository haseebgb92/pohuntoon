import { getFileTypeIcon } from "@/lib/resources/file-types";

export function FileTypeIcon({
  fileType,
  className = "size-5",
}: {
  fileType: string;
  className?: string;
}) {
  const Icon = getFileTypeIcon(fileType);

  return <Icon className={className} />;
}
