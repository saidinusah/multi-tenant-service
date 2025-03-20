import {
  BadRequestException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { ofetch } from "ofetch";
import { SMS_TEMPLATE } from "src/utils/constants";

export class OTPService {
  private PROVIDER_BASE_URL = process.env.ARKESEL_URL;
  private PROVIDER_API_KEY = process.env.ARKESEL_KEY;
  private SENDER_ID = process.env.SMS_SENDER_ID;
  private SEND_OTP_PAYLOAD = {
    expiry: 2,
    length: 6,
    medium: "sms",
    message: SMS_TEMPLATE.OTP,
    sender_id: this.SENDER_ID,
    type: "numeric",
  };
  private HEADERS = {
    "api-key": this.PROVIDER_API_KEY,
    "Content-Type": "application/json",
  };
  private exception_message = "An error occurred while processing your request";

  async sendOtp(phoneNumber: string) {
    try {
      const { code, ussd_code } = await ofetch<{
        code: string;
        ussd_code: string;
        message: string;
      }>(`${this.PROVIDER_BASE_URL}/otp/generate`, {
        method: "POST",
        body: { ...this.SEND_OTP_PAYLOAD, number: phoneNumber },
        headers: this.HEADERS,
      });

      if (code !== "1000") {
        throw new BadRequestException(this.exception_message);
      }
      return {
        message:
          "OTP has been successfully sent, please check your messaging app",
        phoneNumber,
        ussd_code: ussd_code,
      };
    } catch (error) {
      throw new BadRequestException(this.exception_message);
    }
  }

  async verifyOtp(phoneNumber: string, code: string) {
    try {
      const { code: responseCode, message } = await ofetch<{
        code: string;
        message: string;
      }>(`${this.PROVIDER_BASE_URL}/otp/verify`, {
        body: { number: phoneNumber, code },
        headers: this.HEADERS,
        method: "POST",
      });

      if (responseCode !== "1100") {
        throw new UnprocessableEntityException(
          "An error occurred while processing your request",
        );
      }
      return { isVerified: true };
    } catch (error) {
      throw new BadRequestException(this.exception_message);
    }
  }
}
