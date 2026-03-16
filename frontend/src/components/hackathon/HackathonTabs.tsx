"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "./tabs/OverviewTab";
import { InfoTab } from "./tabs/InfoTab";
import { EvalTab } from "./tabs/EvalTab";
import { ScheduleTab } from "./tabs/ScheduleTab";
import { PrizeTab } from "./tabs/PrizeTab";
import { TeamsTab } from "./tabs/TeamsTab";
import { SubmitTab } from "./tabs/SubmitTab";
import { LeaderboardTab } from "./tabs/LeaderboardTab";
import type { HackathonSections } from "@/lib/types";

interface HackathonTabsProps {
  sections: HackathonSections;
  hackathonSlug: string;
}

const TAB_ITEMS = [
  { value: 0, label: "개요" },
  { value: 1, label: "안내" },
  { value: 2, label: "평가" },
  { value: 3, label: "일정" },
  { value: 4, label: "상금" },
  { value: 5, label: "Teams" },
  { value: 6, label: "Submit" },
  { value: 7, label: "Leaderboard" },
] as const;

export function HackathonTabs({ sections, hackathonSlug }: HackathonTabsProps) {
  return (
    <Tabs defaultValue={0}>
      <div className="overflow-x-auto">
        <TabsList className="w-full justify-start">
          {TAB_ITEMS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <div className="mt-6">
        <TabsContent value={0}>
          <OverviewTab data={sections.overview} />
        </TabsContent>

        <TabsContent value={1}>
          <InfoTab data={sections.info} />
        </TabsContent>

        <TabsContent value={2}>
          <EvalTab data={sections.eval} />
        </TabsContent>

        <TabsContent value={3}>
          <ScheduleTab data={sections.schedule} />
        </TabsContent>

        <TabsContent value={4}>
          {sections.prize ? (
            <PrizeTab data={sections.prize} />
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              상금 정보가 없습니다.
            </div>
          )}
        </TabsContent>

        <TabsContent value={5}>
          <TeamsTab data={sections.teams} hackathonSlug={hackathonSlug} />
        </TabsContent>

        <TabsContent value={6}>
          <SubmitTab data={sections.submit} hackathonSlug={hackathonSlug} />
        </TabsContent>

        <TabsContent value={7}>
          <LeaderboardTab
            data={sections.leaderboard}
            hackathonSlug={hackathonSlug}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
}
