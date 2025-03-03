import dayjs from "dayjs";
import { v4 as uuid } from 'uuid'
import membershipPeriods from "../../data/membership-periods.json";
import { DATE_FORMAT } from "../constants/common";
import type { CreateMembershipPeriodModel, MembershipPeriodData } from "../types/membershipPeriod.types";

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
  create(data: CreateMembershipPeriodModel): MembershipPeriodData {
    const membershipPeriodDto = {
      ...data,
      uuid: uuid(),
      start: dayjs(data.start).format(DATE_FORMAT),
      end: dayjs(data.end).format(DATE_FORMAT),
    }
    membershipPeriods.push(membershipPeriodDto);
    return {
      ...membershipPeriodDto, start: data.start, end: data.end
    };
  },
};
