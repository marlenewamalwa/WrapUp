const getAccessToken = async (): Promise<string> => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY!;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET!;

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  const response = await fetch(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  const data = await response.json();
  return data.access_token;
};

export const stkPush = async ({
  phone,
  amount,
  orderId,
}: {
  phone: string;
  amount: number;
  orderId: string;
}) => {
  const accessToken = await getAccessToken();
  const shortcode = process.env.MPESA_SHORTCODE!;
  const passkey = process.env.MPESA_PASSKEY!;
  const callbackUrl = process.env.MPESA_CALLBACK_URL!;

  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 14);

  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

  // Format phone: 0712345678 → 254712345678
  const formattedPhone = phone.startsWith("0")
    ? `254${phone.slice(1)}`
    : phone;

  const response = await fetch(
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.ceil(amount),
        PartyA: formattedPhone,
        PartyB: shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: orderId,
        TransactionDesc: "WrapUp Order Payment",
      }),
    }
  );

  const data = await response.json();
  return data;
};