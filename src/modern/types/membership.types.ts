import type { ParseDateToString } from "./helper.types";
import type { MembershipPeriodData } from "./membershipPeriod.types";

export type MembershipData = {
  uuid: string;
  id: number;
  name: string;
  userId: number;
  recurringPrice: number;
  validFrom: Date;
  validUntil: Date;
  state: string;
  paymentMethod: string | null;
  billingInterval: 'yearly' | 'monthly' | 'weekly' | string & {}
  billingPeriods: number;
  assignedBy: string;
};

export type CreateMembershipModel = Omit<MembershipData, 'uuid' | 'id' >

export type GetAllMembershipsDTO = Array<{
  membership: ParseDateToString<MembershipData, "validFrom" | "validUntil">;
  periods: Array<ParseDateToString<MembershipPeriodData, "start" | "end">>;
}>;

export type CreateMembershipDTO = {
  membership: MembershipData;
  membershipPeriods: Array<MembershipPeriodData>;
};
