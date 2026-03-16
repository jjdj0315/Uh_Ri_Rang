import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * ISO 8601 날짜 문자열을 "2026.03.04" 형태로 변환한다.
 */
export function formatDate(isoString: string): string {
  const d = new Date(isoString);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

/**
 * 숫자를 "3,000,000원" 형태로 변환한다.
 */
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}

/**
 * 해커톤 status 값을 한글 라벨로 변환한다.
 */
export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    ongoing: "진행중",
    ended: "종료",
    upcoming: "예정",
  };
  return map[status] ?? status;
}
