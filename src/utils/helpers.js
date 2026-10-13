// Small helpers used in a few places

export function formatDate(date) {
  if (!date) return "Date not announced";

  return new Date(date).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// used to split My Events into upcoming / completed
export function isPast(date) {
  return new Date(date) < new Date();
}
