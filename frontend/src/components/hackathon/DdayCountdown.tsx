"use client";

import { useEffect, useState } from "react";
import { ClockIcon } from "lucide-react";

interface DdayCountdownProps {
  deadlineAt: string;
  status: "ongoing" | "ended" | "upcoming";
}

function calcRemaining(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, totalMs: diff };
}

export function DdayCountdown({ deadlineAt, status }: DdayCountdownProps) {
  const [remaining, setRemaining] = useState(() => calcRemaining(deadlineAt));

  useEffect(() => {
    if (status !== "ongoing") return;
    const id = setInterval(() => {
      setRemaining(calcRemaining(deadlineAt));
    }, 1000);
    return () => clearInterval(id);
  }, [deadlineAt, status]);

  if (status !== "ongoing" || !remaining) return null;

  const isUrgent = remaining.totalMs < 24 * 60 * 60 * 1000;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium ${
        isUrgent
          ? "bg-destructive/10 text-destructive"
          : "bg-primary/10 text-primary"
      }`}
    >
      <ClockIcon className="size-3.5" />
      <span>
        {remaining.days > 0 && `D-${remaining.days}일 `}
        {pad(remaining.hours)}:{pad(remaining.minutes)}:{pad(remaining.seconds)}
      </span>
    </div>
  );
}
