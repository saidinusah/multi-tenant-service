import { OTPService } from "../services/otp.service";
import { RequestOTP } from "../auth/dto/otp.dto";
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { JobNames, QueueNames } from "../utils/constants";

@Processor(QueueNames.NOTIFICATION)
export class NotificationProcessor {
  private otpService = new OTPService();

  @Process(JobNames.NOTIFICATION.SEND_OTP)
  async sendOTP(job: Job<RequestOTP>) {
    const { data } = job;
    await this.otpService.sendOtp(data?.phoneNumber);
  }
}
