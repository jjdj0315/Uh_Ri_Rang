"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getStatusLabel, cn } from "@/lib/utils";

const STATUS_OPTIONS = ["all", "ongoing", "ended", "upcoming"] as const;

export interface HackathonFilters {
  status: string;
  tag: string;
}

interface HackathonFilterProps {
  filters: HackathonFilters;
  onFilterChange: (filters: HackathonFilters) => void;
  availableTags: string[];
}

export function HackathonFilter({
  filters,
  onFilterChange,
  availableTags,
}: HackathonFilterProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Status filter buttons */}
      <div className="flex flex-wrap gap-1.5">
        {STATUS_OPTIONS.map((status) => (
          <Button
            key={status}
            variant={filters.status === status ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange({ ...filters, status })}
            className={cn(
              filters.status === status && "pointer-events-none"
            )}
          >
            {status === "all" ? "전체" : getStatusLabel(status)}
          </Button>
        ))}
      </div>

      {/* Tag filter dropdown */}
      <Select
        value={filters.tag}
        onValueChange={(val: string | null) =>
          onFilterChange({ ...filters, tag: val ?? "all" })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="태그 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 태그</SelectItem>
          {availableTags.map((tag) => (
            <SelectItem key={tag} value={tag}>
              {tag}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
