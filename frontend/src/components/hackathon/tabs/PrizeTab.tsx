import { Card, CardContent } from "@/components/ui/card";
import type { PrizeSection } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

interface PrizeTabProps {
  data: PrizeSection;
}

export function PrizeTab({ data }: PrizeTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">상금</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((item, i) => {
          const isFirst = i === 0;
          return (
            <Card
              key={item.place}
              className={cn(isFirst && "ring-2 ring-yellow-500/50")}
            >
              <CardContent className="flex flex-col items-center gap-2 py-6">
                {isFirst && (
                  <span className="text-3xl" role="img" aria-label="trophy">
                    🏆
                  </span>
                )}
                <p
                  className={cn(
                    "text-sm font-medium uppercase tracking-wide",
                    isFirst
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-muted-foreground"
                  )}
                >
                  {item.place}
                </p>
                <p
                  className={cn(
                    "text-xl font-bold",
                    isFirst && "text-2xl"
                  )}
                >
                  {formatCurrency(item.amountKRW)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
