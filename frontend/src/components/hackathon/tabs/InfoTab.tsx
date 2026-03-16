import { Button } from "@/components/ui/button";
import type { InfoSection } from "@/lib/types";

interface InfoTabProps {
  data: InfoSection;
}

export function InfoTab({ data }: InfoTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-lg font-semibold">공지사항</h3>
        <ul className="space-y-3">
          {data.notice.map((text, i) => (
            <li key={i} className="flex items-start gap-3">
              <svg
                className="mt-0.5 size-5 shrink-0 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm text-muted-foreground">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-3">
        <a href={data.links.rules} target="_blank" rel="noopener noreferrer">
          <Button variant="outline">규정 보기</Button>
        </a>
        <a href={data.links.faq} target="_blank" rel="noopener noreferrer">
          <Button variant="outline">FAQ 보기</Button>
        </a>
      </div>
    </div>
  );
}
