import AfricasTalking from "africastalking";

const at = AfricasTalking({
  apiKey: process.env.AT_API_KEY!,
  username: process.env.AT_USERNAME!,
});

const sms = at.SMS;

export const sendSMS = async (phone: string, message: string) => {
  try {
    // Format phone: 0712345678 → +254712345678
    const formatted = phone.startsWith("0")
      ? `+254${phone.slice(1)}`
      : phone.startsWith("254")
      ? `+${phone}`
      : phone;

    const result = await sms.send({
      to: [formatted],
      message,
      from: undefined,
    });

    console.log("SMS sent:", result);
    return result;
  } catch (err) {
    console.error("SMS failed:", err);
  }
};