import bakeryInfo from '../data/bakeryInfo.json';
import { generateOrderChecksum } from './orderHash';

/**
 * Generates an ultra-high-resolution (3x Retina HD) uneditable PNG receipt image using HTML5 Canvas.
 * Rendered at 1920px width with clean alignments and compulsory WhatsApp order confirmation notice.
 */
export function generateReceiptImage(myList) {
  if (!Array.isArray(myList) || myList.length === 0) return null;

  const checksum = generateOrderChecksum(myList);
  const totalPrice = myList.reduce((sum, entry) => sum + (entry.item.price * entry.quantity), 0);
  const totalItems = myList.reduce((sum, entry) => sum + entry.quantity, 0);
  const dateStr = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  // Calculate dynamic line count for customization notes
  let extraLines = 0;
  myList.forEach((entry) => {
    if (entry.customization) {
      const { nameOnCake, occasion, eventDate, notes } = entry.customization;
      if (nameOnCake || occasion || eventDate || notes) extraLines += 2;
    }
  });

  // Base Logical dimensions
  const logicalWidth = 640;
  const itemHeight = 44;
  // Extra space for compulsory notice footer box
  const logicalHeight = Math.max(620, 440 + myList.length * itemHeight + extraLines * 24);

  // High Resolution Scale Factor (3x Retina HD)
  const scale = 3;

  const canvas = document.createElement('canvas');
  canvas.width = logicalWidth * scale;
  canvas.height = logicalHeight * scale;

  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);

  // Background - Clean Warm Cream
  ctx.fillStyle = '#FAF9F6';
  ctx.fillRect(0, 0, logicalWidth, logicalHeight);

  // Outer Double Border
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 3;
  ctx.strokeRect(12, 12, logicalWidth - 24, logicalHeight - 24);

  ctx.strokeStyle = '#FDE68A';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(16, 16, logicalWidth - 32, logicalHeight - 32);

  // Top Header Banner Gradient
  const gradient = ctx.createLinearGradient(0, 0, logicalWidth, 0);
  gradient.addColorStop(0, '#451A03');
  gradient.addColorStop(0.5, '#78350F');
  gradient.addColorStop(1, '#92400E');
  ctx.fillStyle = gradient;
  ctx.fillRect(18, 18, logicalWidth - 36, 115);

  // Header Title & Subtitle
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 25px system-ui, -apple-system, sans-serif';
  ctx.fillText('GUNDANNA BAKERY', 36, 52);

  ctx.fillStyle = '#FDE047';
  ctx.font = '700 13px system-ui, -apple-system, sans-serif';
  ctx.fillText('OFFICIAL UNEDITABLE ORDER SUMMARY SLIP', 36, 76);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 12px monospace';
  ctx.fillText(`SECURITY VERIFICATION CODE: ${checksum}`, 36, 100);

  // Right Header Details
  ctx.fillStyle = '#FEF08A';
  ctx.font = '500 12px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(dateStr, logicalWidth - 36, 50);
  ctx.fillText(`Phone: 094836 22026`, logicalWidth - 36, 72);
  ctx.fillText(`Hassan, Karnataka`, logicalWidth - 36, 94);
  ctx.textAlign = 'left';

  // Table Header Bar
  let y = 152;
  ctx.fillStyle = '#F59E0B';
  ctx.fillRect(36, y, logicalWidth - 72, 34);

  ctx.fillStyle = '#78350F';
  ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
  ctx.fillText('#', 48, y + 22);
  ctx.fillText('Item Description', 76, y + 22);
  ctx.fillText('Qty', 400, y + 22);
  ctx.fillText('Price', 470, y + 22);
  ctx.fillText('Total', 545, y + 22);

  y += 46;

  // Table Items Rows
  myList.forEach((entry, idx) => {
    // Row background striping
    if (idx % 2 === 0) {
      ctx.fillStyle = '#FFF7ED';
      ctx.fillRect(36, y - 18, logicalWidth - 72, 36);
    }

    // Number & Name
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
    ctx.fillText(`${idx + 1}.`, 48, y);

    const displayName = entry.item.name.length > 36 ? entry.item.name.substring(0, 33) + '...' : entry.item.name;
    ctx.fillText(displayName, 76, y);

    // Qty, Price, Total
    ctx.font = '600 14px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText(`${entry.quantity}x`, 400, y);

    ctx.fillStyle = '#475569';
    ctx.fillText(`₹${entry.item.price}`, 470, y);

    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
    ctx.fillText(`₹${entry.item.price * entry.quantity}`, 545, y);

    y += 24;

    // Customization details if present
    if (entry.customization) {
      const { nameOnCake, occasion, eventDate, notes } = entry.customization;
      if (nameOnCake || occasion || eventDate || notes) {
        ctx.fillStyle = '#991B1B';
        ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';

        let custText = '    🎂 Details: ';
        if (occasion) custText += `[${occasion}] `;
        if (nameOnCake) custText += `[Name on Cake: "${nameOnCake}"] `;
        if (eventDate) custText += `[Date: ${eventDate}] `;
        if (notes) custText += `[Note: ${notes}]`;

        ctx.fillText(custText.substring(0, 80), 76, y);
        y += 22;
      }
    }

    // Divider line
    ctx.strokeStyle = '#FED7AA';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(36, y + 6);
    ctx.lineTo(logicalWidth - 36, y + 6);
    ctx.stroke();

    y += 18;
  });

  y += 10;

  // Grand Total Summary Box
  ctx.fillStyle = '#FEF3C7';
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2;
  ctx.fillRect(36, y, logicalWidth - 72, 54);
  ctx.strokeRect(36, y, logicalWidth - 72, 54);

  ctx.fillStyle = '#78350F';
  ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
  ctx.fillText(`TOTAL ITEMS: ${totalItems} Pcs`, 56, y + 33);

  ctx.fillStyle = '#B45309';
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`GRAND TOTAL: ₹${totalPrice}`, logicalWidth - 56, y + 35);
  ctx.textAlign = 'left';

  y += 74;

  // COMPULSORY NOTICE BOX
  ctx.fillStyle = '#FEF2F2';
  ctx.strokeStyle = '#EF4444';
  ctx.lineWidth = 1.5;
  ctx.fillRect(36, y, logicalWidth - 72, 60);
  ctx.strokeRect(36, y, logicalWidth - 72, 60);

  ctx.fillStyle = '#DC2626';
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.fillText('⚠️ COMPULSORY NOTE FOR ORDER ACCEPTANCE:', 48, y + 22);

  ctx.fillStyle = '#991B1B';
  ctx.font = '600 11px system-ui, -apple-system, sans-serif';
  ctx.fillText('Sharing this Digital Order Slip on WhatsApp (94836 22026) is compulsory for order confirmation!', 48, y + 42);

  y += 75;

  // Security Stamp Footer
  ctx.fillStyle = '#64748B';
  ctx.font = '500 11px system-ui, -apple-system, sans-serif';
  ctx.fillText(`Security Verification Code: ${checksum} • ${bakeryInfo.name}, Hassan`, 36, y);

  return canvas.toDataURL('image/png', 1.0);
}
