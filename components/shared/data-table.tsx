import { EmptyState } from "@/components/shared/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { ReactNode } from "react";

export type DataColumn<T> = {
  key: keyof T;
  label: string;
};

type DataTableProps<T extends Record<string, ReactNode>> = {
  columns: DataColumn<T>[];
  rows: T[];
  emptyTitle: string;
  emptyDescription: string;
};

export function DataTable<T extends Record<string, ReactNode>>({
  columns,
  rows,
  emptyTitle,
  emptyDescription,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.key)}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={String(column.key)}>{row[column.key]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
