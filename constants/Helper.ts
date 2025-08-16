export function getWeeksForMonth(month: number, year: number) {
  const weeks: (Date | null)[][] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  let week: (Date | null)[] = [];

  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay(); // Sunday = 0
    if (week.length === 0 && dayOfWeek !== 1) {
      const leadingNulls = (dayOfWeek + 6) % 7; // shift Sunday to end
      week = Array(leadingNulls).fill(null);
    }

    week.push(new Date(d));

    if (week.length === 7) {
      weeks.push([...week]);
      week = [];
    }
  }

  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null);
    }
    weeks.push(week);
  }

  return weeks;
}

export function formatDateWithOrdinal(date: Date, hasMonth: boolean = false): string {
  const day = date.getDate();
  const weekday = date.toLocaleDateString("en-GB", { weekday: "long" });
  let month = null;
  if (hasMonth) {
    month = date.toLocaleDateString("en-GB", { month: "short" });
  }

  const ordinal =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return !hasMonth ? `${weekday} ${day}${ordinal}` : `${weekday} ${day}${ordinal} ${month}`;
}

export function getOrdinal(date: Date) {
  const day = date.getDate();
  if (day % 10 === 1 && day !== 11) return "st";
  if (day % 10 === 2 && day !== 12) return "nd";
  if (day % 10 === 3 && day !== 13) return "rd";
  return "th";
}

export function expandWeekToFullWeek(week: (Date | null)[]): Date[] {
  // Find the first valid date
  const firstValid = week.find(d => d !== null);
  if (!firstValid) return [];

  const day = firstValid!.getDay(); // 0 = Sunday, 1 = Monday
  const diffToMonday = (day + 6) % 7; // days back to Monday
  const monday = new Date(firstValid!);
  monday.setDate(firstValid!.getDate() - diffToMonday);

  const fullWeek: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    fullWeek.push(d);
  }

  return fullWeek;
}