export function formatCustomerName(rawName: string): string {
  if (!rawName) return "Customer";
  const namePart = rawName.split('@')[0] ?? rawName;
  return namePart;
}