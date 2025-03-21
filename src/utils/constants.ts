import { Prisma, RenewalPeriods } from "@prisma/client";

export const REGEXES = {
  GHANA_POST_GPS: /^[A-Z]{2}-\d{3}-\d{4}$/,
  GHANA_PHONE_NUMBER:
    /^(?:\+233|233|0)(?:(?:2(?:0[0-9]|6[0-9]|4[0-9]|7[0-9]|9[0-9])|3(?:0[0-9]|3[0-9])|5(?:0[0-9]|5[0-9]|4[0-9])|5[4-9][0-9]|24[0-9]|54[0-9]|55[0-9]|27[0-9]|57[0-9]|26[0-9]|56[0-9]|23[0-9]|53[0-9])|(?:7[0-9]|9[0-7])[0-9])[0-9]{6}$/,
};

export const SMS_TEMPLATE = {
  OTP: "This is your GyManager OTP, %otp_code%. It expires in 2 minutes",
};

export const QueueNames = {
  NOTIFICATION: "NOTIFICATION",
  CACHE: "CACHE",
};

export const JobNames = {
  NOTIFICATION: {
    SEND_OTP: "SEND_OTP",
  },
  CACHE: {
    ADD_ITEM: "ADD_ITEM",
    REMOVE_ITEM: "REMOVE_ITEM",
  },
};

export const RENEWAL_PERIODS: Record<RenewalPeriods, number> = {
  DAILY: 1,
  WEEKLY: 7,
  MONTHLY: 30,
  QUARTERLY: 91,
  BI_ANNUALLY: 182,
  ANNUALLY: 365,
} as const;
