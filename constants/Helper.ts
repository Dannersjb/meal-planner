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
