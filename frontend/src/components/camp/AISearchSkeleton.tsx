"use client";

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { SparklesIcon } from "lucide-react";

export function AISearchSkeleton() {
  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-1.5 text-sm font-medium">
        <SparklesIcon className="size-4 text-yellow-500 animate-pulse" />
        AI 추천 결과를 분석 중...
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Card key={i} size="sm" className="animate-pulse flex flex-col h-[220px]">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <div className="h-5 w-28 rounded bg-muted" />
                <div className="h-5 w-10 rounded-full bg-muted" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-3 w-full rounded bg-muted" />
              <div className="h-3 w-3/4 rounded bg-muted" />
            </CardContent>
            <CardFooter>
              <div className="h-8 w-full rounded bg-muted" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
