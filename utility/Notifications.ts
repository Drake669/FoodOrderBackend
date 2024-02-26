export const GenerateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
  return { otp, expiry };
};

export const SendOTP = async (otp: number, to: string) => {
  const accountSid = "AC7900cde29b6781d4470a177fd07aada5";
  const authToken = "e31fdf401f3239d1303c6516edd50af9";
  const client = require("twilio")(accountSid, authToken);

  const response = await client.messages.create({
    body: `Please keep this safe. It will only last for 30 minutes. OTP: ${otp}`,
    from: "+15169904729",
    to: to,
  });
  return response;
};
