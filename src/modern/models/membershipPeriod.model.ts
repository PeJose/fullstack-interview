import dayjs from "dayjs";
import membershipPeriods from "../../data/membership-periods.json";
import { DATE_FORMAT } from "../constants/common";
import type { MembershipPeriodData } from "../types/membershipPeriod.types";

export const MembershipPeriod = {
  findByMembership(membership: number): Array<MembershipPeriodData> {
    return membershipPeriods
      .filter((period) => period.membership === membership)
      .map((period) => ({
        ...period,
        start: new Date(period.start),
        end: new Date(period.end),
      }));
  },
  create(data: MembershipPeriodData): number {
    membershipPeriods.push({
      ...data,
      start: dayjs(data.start).format(DATE_FORMAT),
      end: dayjs(data.end).format(DATE_FORMAT),
    });
    return data.id;
  },
};
