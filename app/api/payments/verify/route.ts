import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { sendBookingEmails } from "@/lib/email";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const bookingId = typeof body.bookingId === "string" ? body.bookingId : "";
  const orderId = typeof body.razorpay_order_id === "string" ? body.razorpay_order_id : "";
  const paymentId = typeof body.razorpay_payment_id === "string" ? body.razorpay_payment_id : "";
  const signature = typeof body.razorpay_signature === "string" ? body.razorpay_signature : "";

  if (!bookingId || !orderId || !paymentId || !signature) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { pujaType: true },
  });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (!verifyPaymentSignature(orderId, paymentId, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      paymentStatus: "paid",
      paymentRef: paymentId,
      paymentProvider: "razorpay",
      status: "Confirmed",
    },
  });

  await sendBookingEmails({
    customerEmail: booking.email,
    customerName: booking.customerName,
    pujaName: booking.pujaType.name,
    date: booking.date,
    time: booking.time,
    amount: booking.amount,
    bookingId: booking.id,
    paymentLabel: "Paid online (Razorpay)",
  });

  return NextResponse.json({ ok: true });
}
