import { ManipulateType } from "dayjs";
import { MembershipData } from "../types/membership.types";


export const DATE_FORMAT = "YYYY-MM-DD";
export const MOCK_USER = {
  id: 2000,
  role: "User",
};

export const PERIOD_TO_UNIT: Record<MembershipData['billingInterval'], ManipulateType> = {
  yearly: 'year',
  monthly: 'month',
  weekly: 'week'
}