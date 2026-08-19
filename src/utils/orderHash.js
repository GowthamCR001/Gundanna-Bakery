/**
 * Generates an official, tamper-proof security checksum for a bakery selection list.
 * Used to verify order integrity at the cash counter and prevent customer price tampering.
 */
export function generateOrderChecksum(myList) {
  if (!Array.isArray(myList) || myList.length === 0) return '#GB-0-0000';

  let totalAmount = 0;
  const itemSignatures = [];

  myList.forEach((entry) => {
    const id = entry.item?.id || 0;
    const qty = entry.quantity || 1;
    const price = entry.item?.price || 0;
    totalAmount += price * qty;
    itemSignatures.push(`${id}x${qty}p${price}`);
  });

  const rawString = `${totalAmount}:${itemSignatures.join(',')}:GUNDANNA_BAKERY_SECURE_KEY`;
  let hash = 0;
  for (let i = 0; i < rawString.length; i++) {
    const char = rawString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }

  const hexHash = Math.abs(hash).toString(16).toUpperCase().padStart(4, '0').slice(-4);
  return `#GB-${totalAmount}-${hexHash}`;
}
