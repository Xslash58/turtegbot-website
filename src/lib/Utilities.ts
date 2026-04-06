export function formatDate(dateStr: string | Date) {
	if (dateStr instanceof Date) dateStr = dateStr.toISOString();
	const date = new Date(dateStr);
	const pad = (n: number) => n.toString().padStart(2, '0');
	return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function copyToClipboard(text: string) {
	if (!navigator?.clipboard) return;

	navigator.clipboard
		.writeText(text)
		.then(() => {
			alert('Content copied to clipboard');
		})
		.catch((err) => {
			console.error('Failed to copy: ', err);
		});
}

type TimeUnit = "year" | "month" | "day" | "hour" | "minute" | "second";

const UNIT_MAP: { label: TimeUnit; short: string; seconds: number }[] = [
    { label: "year", short: "y", seconds: 365 * 24 * 3600 },
    { label: "month", short: "mo", seconds: 30 * 24 * 3600 },
    { label: "day", short: "d", seconds: 24 * 3600 },
    { label: "hour", short: "h", seconds: 3600 },
    { label: "minute", short: "m", seconds: 60 },
    { label: "second", short: "s", seconds: 1 },
  ];

export function formatTimeSpan(
    start: Date | string | number,
    end: Date | string | number = new Date(),
    options: { 
        shorthand?: boolean, 
        minUnit?: TimeUnit, 
        maxUnit?: TimeUnit 
    } = {}
  ): string {
    const { shorthand = false, minUnit = "second", maxUnit = "year" } = options;

    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    let totalSeconds = Math.floor((endDate - startDate) / 1000);

    if (totalSeconds <= 0) return shorthand ? "0" + (UNIT_MAP.find(u => u.label === minUnit)?.short || "s") : `0 ${minUnit}s`;

    // Find our range within the UNIT_MAP
    const startIndex = UNIT_MAP.findIndex(u => u.label === maxUnit);
    const endIndex = UNIT_MAP.findIndex(u => u.label === minUnit);
    
    // Slice the map to only include allowed units
    const allowedUnits = UNIT_MAP.slice(startIndex, endIndex + 1);

    const parts: string[] = [];

    for (const unit of allowedUnits) {
      const value = Math.floor(totalSeconds / unit.seconds);
      
      // If we are at the last allowed unit (minUnit), we take all remaining time
      // Otherwise, we take the floor and carry the remainder (modulus)
      if (value > 0) {
        if (shorthand) {
          parts.push(`${value}${unit.short}`);
        } else {
          parts.push(`${value} ${unit.label}${value === 1 ? "" : "s"}`);
        }
      }
      
      totalSeconds %= unit.seconds;
    }

    if (parts.length === 0) return shorthand ? "0s" : "0 seconds";
    if (shorthand || parts.length === 1) return parts.join(", ");

    const lastPart = parts.pop();
    return `${parts.join(", ")} and ${lastPart}`;
  }
