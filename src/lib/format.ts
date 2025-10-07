export function formatDateISOToID(dateISO: string) {
  const d = new Date(dateISO + "T00:00:00+07:00");
  return d.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}