import bakeryInfo from '../data/bakeryInfo.json';
import { generateOrderChecksum } from './orderHash';

/**
 * Generates an official, uneditable PNG receipt image using HTML5 Canvas.
 * Prevents price tampering by rendering an official stamped bill image that can be shared to WhatsApp.
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

  // Calculate dynamic canvas height based on items and customization notes
  let extraHeight = 0;
  myList.forEach((entry) => {
    if (entry.customization) {
      const { nameOnCake, occasion, eventDate, notes } = entry.customization;
      if (nameOnCake || occasion || eventDate || notes) extraHeight += 50;
    }
  });

  const width = 640;
  const itemLineHeight = 36;
  const height = Math.max(520, 360 + myList.length * itemLineHeight + extraHeight);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#FFFDF9';
  ctx.fillRect(0, 0, width, height);

  // Outer Border
  ctx.strokeStyle = '#E2D1C3';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  // Top Header Banner
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, '#5C2D12');
  gradient.addColorStop(1, '#854D0E');
  ctx.fillStyle = gradient;
  ctx.fillRect(12, 12, width - 24, 110);

  // Header Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('GUNDANNA BAKERY', 30, 48);

  ctx.fillStyle = '#FEF08A';
  ctx.font = '13px sans-serif';
  ctx.fillText('Official Digital Order Summary & Counter Slip', 30, 70);

  ctx.fillStyle = '#FDE047';
  ctx.font = 'bold 12px monospace';
  ctx.fillText(`VERIFICATION CODE: ${checksum}`, 30, 94);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(dateStr, width - 30, 48);
  ctx.fillText(`Phone: ${bakeryInfo.phone}`, width - 30, 70);
  ctx.textAlign = 'left';

  // Table Header
  let y = 145;
  ctx.fillStyle = '#F59E0B';
  ctx.fillRect(30, y, width - 60, 30);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('Item Description', 40, y + 20);
  ctx.fillText('Qty', 380, y + 20);
  ctx.fillText('Price', 450, y + 20);
  ctx.fillText('Total', 540, y + 20);

  y += 40;
  ctx.fillStyle = '#1E293B';

  // Table Rows
  myList.forEach((entry, idx) => {
    ctx.font = 'bold 13px sans-serif';
    // Truncate long item names if needed
    const itemName = entry.item.name.length > 38 ? entry.item.name.substring(0, 35) + '...' : entry.item.name;
    ctx.fillText(`${idx + 1}. ${itemName}`, 40, y);

    ctx.font = '13px sans-serif';
    ctx.fillText(`${entry.quantity}`, 385, y);
    ctx.fillText(`₹${entry.item.price}`, 450, y);
    ctx.fillText(`₹${entry.item.price * entry.quantity}`, 540, y);

    y += 24;

    // Render Customization if present
    if (entry.customization) {
      const { nameOnCake, occasion, eventDate, notes } = entry.customization;
      if (nameOnCake || occasion || eventDate || notes) {
        ctx.fillStyle = '#78350F';
        ctx.font = '11px sans-serif';
        let custStr = '   🎂 Details: ';
        if (occasion) custStr += `[Occasion: ${occasion}] `;
        if (nameOnCake) custStr += `[Name on Cake: "${nameOnCake}"] `;
        if (eventDate) custStr += `[Date: ${eventDate}] `;
        if (notes) custStr += `[Note: ${notes}]`;
        ctx.fillText(custStr.substring(0, 85), 40, y);
        ctx.fillStyle = '#1E293B';
        y += 20;
      }
    }

    // Separator line
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, y);
    ctx.lineTo(width - 30, y);
    ctx.stroke();

    y += 14;
  });

  y += 10;

  // Total Summary Box
  ctx.fillStyle = '#FEF3C7';
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 1.5;
  ctx.fillRect(30, y, width - 60, 50);
  ctx.strokeRect(30, y, width - 60, 50);

  ctx.fillStyle = '#92400E';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText(`TOTAL ITEMS: ${totalItems}`, 50, y + 30);

  ctx.fillStyle = '#B45309';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`FINAL TOTAL: ₹${totalPrice}`, width - 50, y + 32);
  ctx.textAlign = 'left';

  y += 75;

  // Security Stamp & Notice
  ctx.fillStyle = '#DC2626';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('🔒 OFFICIAL UNEDITABLE ORDER SLIP — Cross-checked at Bakery Counter', 30, y);

  ctx.fillStyle = '#64748B';
  ctx.font = '10px sans-serif';
  ctx.fillText(`Security Hash: ${checksum} • Bakery Location: ${bakeryInfo.address}`, 30, y + 16);

  return canvas.toDataURL('image/png');
}
