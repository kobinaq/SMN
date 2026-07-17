"use client";

export function TicketQr({ code }: { code: string }) {
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(code)}`;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={`QR for ticket ${code}`} className="mx-auto h-48 w-48 rounded-xl bg-white p-2" />
  );
}
