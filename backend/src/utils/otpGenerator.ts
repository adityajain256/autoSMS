import { randomInt } from "node:crypto";
import client from "../config/redis.ts";
import logger from "./logger.ts";
import { hash, compare } from "./crypto.ts";
import redisClient from "../config/redis.ts";

export const otp = (s: number) => {
  const size = s;
  const max = 10 ** size - 1;
  const min = 10 ** (size - 1);

  const otp = randomInt(min, max);
  return otp;
};

export const otpTemplate = (otp: string) => {
  return `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Lightleaf</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing Lightleaf. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
    <p style="font-size:0.9em;">Regards,<br />Lightleaf</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Lightleaf Inc</p>
      <p>Lalitpur</p>
      <p>Uttar Pradesh</p>
    </div>
  </div>
</div>`;
};

export const storeInRedis = async (
  email: string,
  otp: number,
  ttl: number = 300,
) => {
  try {
    await redisClient.set(`otp:$(email)`, otp, { EX: ttl });
    return { success: true };
  } catch (error) {
    logger.error(error);
    return { success: false };
  }
};


// export async function verifyOtp(email, inputOtp) {
//   const k = keyFor(email);
//   const stored = await redis.get(k);
//   if (!stored) return { ok: false, reason: "EXPIRED_OR_NOT_FOUND" };

//   const match = await compare(inputOtp, stored);
//   if (!match) return { ok: false, reason: "INVALID_OTP" };

//   // one-time use
//   await redis.del(k);
//   return { ok: true };
// }

// export async function deleteOtp(email) {
//   await redis.del(keyFor(email));
// }
