import dayjs from "dayjs";
import memberships from "../../data/memberships.json";
import { DATE_FORMAT, MOCK_USER } from "../constants/common";
import type { MembershipData } from "../types/membership.types";

export const Membership = {
  find(): Array<MembershipData> {
    return memberships.map((membership) => ({
      ...membership,
      validFrom: new Date(membership.validFrom),
      validUntil: new Date(membership.validUntil),
    }));
  },
  getLastId(): number {
    return memberships.length + 1;
  },
  create(data: MembershipData): number {
    memberships.push({
      ...data,
      assignedBy: MOCK_USER.role,
      validUntil: dayjs(data.validUntil).format(DATE_FORMAT),
      validFrom: dayjs(data.validFrom).format(DATE_FORMAT),
    });
    return data.id;
  },
};
