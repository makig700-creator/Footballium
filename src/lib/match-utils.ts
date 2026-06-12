import { EventType } from "@prisma/client";

export function formatMinute(minute: number): string {
  if (minute <= 45) return `${minute}'`;
  if (minute <= 90) return `${minute}'`;
  return `${90}+${minute - 90}'`;
}

export function getEventIcon(type: EventType): string {
  switch (type) {
    case "GOAL":
    case "PENALTY_GOAL":
      return "⚽";
    case "OWN_GOAL":
      return "⚽ (АГ)";
    case "YELLOW_CARD":
      return "🟨";
    case "RED_CARD":
      return "🔴";
    case "SUBSTITUTION":
      return "🔄";
    default:
      return "📌";
  }
}

export function canRefereeEditMatch(userId: string | undefined, match: any): boolean {
  if (!userId) return false;
  // Якщо є прив'язаний суддя, перевіряємо
  if (match.refereeId) {
    return match.refereeId === userId;
  }
  // Інакше дозволяємо будь-якому REFEREE
  return true; 
}
