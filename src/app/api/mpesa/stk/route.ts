import { NextRequest, NextResponse } from "next/server";
import { stkPush } from "@/lib/mpesa";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { phone, amount, orderId } = await req.json();

    const result = await stkPush({ phone, amount, orderId });

    if (result.ResponseCode === "0") {
      // STK push sent successfully
      await supabase
        .from("orders")
        .update({ status: "awaiting_payment" })
        .eq("id", orderId);

      return NextResponse.json({ success: true, data: result });
    } else {
      return NextResponse.json(
        { success: false, error: result.errorMessage },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error("STK push error:", err);
    return NextResponse.json(
      { success: false, error: "STK push failed" },
      { status: 500 }
    );
  }
}