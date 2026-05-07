import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/db";
import { isRazorpayConfigured } from "@/lib/razorpay";

export async function POST(req: Request) {
  if (!isRazorpayConfigured()) {
    return NextResponse.json({ error: "Razorpay not configured" }, { status: 400 });
  }
  const body = await req.json().catch(() => ({}));
  const bookingId = typeof body.bookingId === "string" ? body.bookingId : "";
  if (!bookingId) {
    return NextResponse.json({ error: "bookingId required" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { pujaType: true },
  });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.paymentStatus === "paid") {
    return NextResponse.json({ error: "Already paid" }, { status: 400 });
  }

  const key_id = process.env.RAZORPAY_KEY_ID!;
  const key_secret = process.env.RAZORPAY_KEY_SECRET!;
  const razorpay = new Razorpay({ key_id, key_secret });

  const amountPaise = booking.amount * 100;
  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt: bookingId.slice(0, 40),
    notes: { puja: booking.pujaType.name },
  });

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      razorpayOrderId: order.id,
      paymentProvider: "razorpay",
    },
  });

  return NextResponse.json({
    orderId: order.id,
    amount: amountPaise,
    currency: "INR",
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || key_id,
    bookingId,
  });
}
