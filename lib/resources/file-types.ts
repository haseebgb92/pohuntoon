import type { LucideIcon } from "lucide-react";
import {
  Archive,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileType2,
  FileVideo2,
  Link2,
  Presentation,
} from "lucide-react";

export function normalizeFileType(fileType: string) {
  return fileType.trim().toLowerCase();
}

export function getFileTypeLabel(fileType: string) {
  const normalized = normalizeFileType(fileType);

  if (normalized.includes("pdf")) return "PDF";
  if (normalized.includes("word") || normalized.includes("doc")) return "Document";
  if (normalized.includes("sheet") || normalized.includes("xls")) return "Spreadsheet";
  if (normalized.includes("presentation") || normalized.includes("ppt")) return "Presentation";
  if (normalized.includes("image")) return "Image";
  if (normalized.includes("zip")) return "ZIP";
  if (normalized.includes("video")) return "Video";
  if (normalized.includes("external")) return "External Link";

  return "File";
}

export function getFileTypeIcon(fileType: string): LucideIcon {
  const normalized = normalizeFileType(fileType);

  if (normalized.includes("pdf")) return FileText;
  if (normalized.includes("word") || normalized.includes("doc")) return FileType2;
  if (normalized.includes("sheet") || normalized.includes("xls")) return FileSpreadsheet;
  if (normalized.includes("presentation") || normalized.includes("ppt")) return Presentation;
  if (normalized.includes("image")) return FileImage;
  if (normalized.includes("zip")) return FileArchive;
  if (normalized.includes("video")) return FileVideo2;
  if (normalized.includes("external")) return Link2;

  return Archive;
}
