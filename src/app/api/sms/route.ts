import { NextRequest, NextResponse } from "next/server";
import { sendSMS } from "@/lib/sms";

export async function POST(req: NextRequest) {
  try {
    const { phone, message } = await req.json();
    await sendSMS(phone, message);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("SMS route error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}