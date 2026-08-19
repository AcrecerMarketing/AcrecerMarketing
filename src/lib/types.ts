export const Role = { CLIENT: "CLIENT", ADMIN: "ADMIN" } as const;
export type Role = (typeof Role)[keyof typeof Role];

export const CustomerType = { INFLUENCER: "INFLUENCER", BRAND: "BRAND" } as const;
export type CustomerType = (typeof CustomerType)[keyof typeof CustomerType];

export const SubscriptionStatus = {
  TRIALING: "TRIALING",
  ACTIVE: "ACTIVE",
  PAST_DUE: "PAST_DUE",
  CANCELED: "CANCELED",
} as const;
export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export const BillingPeriod = { MONTHLY: "MONTHLY", YEARLY: "YEARLY" } as const;
export type BillingPeriod = (typeof BillingPeriod)[keyof typeof BillingPeriod];
