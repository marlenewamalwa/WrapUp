import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { Body } = body;

    if (Body.stkCallback.ResultCode === 0) {
      // Payment successful
      const metadata = Body.stkCallback.CallbackMetadata.Item;
      const mpesaRef = metadata.find((i: any) => i.Name === "MpesaReceiptNumber")?.Value;
      const orderId = Body.stkCallback.AccountReference;

      await supabase
        .from("orders")
        .update({
          status: "confirmed",
          mpesa_ref: mpesaRef,
        })
        .eq("id", orderId);
    } else {
      // Payment failed or cancelled
      const orderId = Body.stkCallback.AccountReference;
      await supabase
        .from("orders")
        .update({ status: "payment_failed" })
        .eq("id", orderId);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Callback error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}