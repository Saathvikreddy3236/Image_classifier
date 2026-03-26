export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatNumber(value) {
  return new Intl.NumberFormat().format(value || 0);
}
