export function formatCustomerName(rawName?: string): string {
    if (!rawName) return "Customer";
    return rawName.includes('@') ? rawName.split('@')[0] : rawName;
}