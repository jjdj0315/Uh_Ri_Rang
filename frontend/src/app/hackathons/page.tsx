"use client";

import { useEffect, useState, useMemo } from "react";
import { Search } from "lucide-react";
import { initializeData } from "@/lib/init-data";
import { getHackathons } from "@/lib/storage";
import { HackathonCard } from "@/components/hackathon/HackathonCard";
import {
  HackathonFilter,
  type HackathonFilters,
} from "@/components/hackathon/HackathonFilter";
import { EmptyState } from "@/components/common/EmptyState";
import type { Hackathon } from "@/lib/types";

export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [filters, setFilters] = useState<HackathonFilters>({
    status: "all",
    tag: "all",
  });

  useEffect(() => {
    initializeData();
    setHackathons(getHackathons());
  }, []);

  // Extract unique tags from all hackathons
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    hackathons.forEach((h) => h.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [hackathons]);

  // Apply filters
  const filtered = useMemo(() => {
    return hackathons.filter((h) => {
      if (filters.status !== "all" && h.status !== filters.status) return false;
      if (filters.tag !== "all" && !h.tags.includes(filters.tag)) return false;
      return true;
    });
  }, [hackathons, filters]);

  const resetFilters = () => setFilters({ status: "all", tag: "all" });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">해커톤 목록</h1>

      <HackathonFilter
        filters={filters}
        onFilterChange={setFilters}
        availableTags={availableTags}
      />

      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((h) => (
            <HackathonCard key={h.slug} hackathon={h} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Search />}
          title="조건에 맞는 해커톤이 없습니다."
          description="필터 조건을 변경해보세요."
          action={{ label: "필터 초기화", onClick: resetFilters }}
        />
      )}
    </div>
  );
}
