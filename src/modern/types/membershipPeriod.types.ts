import { Dayjs } from "dayjs";

export type MembershipPeriodData = {
  id: number;
  uuid: string;
  membership: number;
  start: Date;
  end: Date;
  state: string;
};

export type CreateMembershipPeriodModel = Omit<MembershipPeriodData, 'uuid'>