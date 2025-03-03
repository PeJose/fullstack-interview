import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid'
import memberships from "../../data/memberships.json";
import { DATE_FORMAT, MOCK_USER } from "../constants/common";
import type { CreateMembershipModel, MembershipData } from "../types/membership.types";

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
  create(data: CreateMembershipModel): MembershipData {
    const id = this.getLastId()
    const membershipDto = {
      ...data,
      id,
      uuid: uuid(),
      assignedBy: MOCK_USER.role,
      validUntil: dayjs(data.validUntil).format(DATE_FORMAT),
      validFrom: dayjs(data.validFrom).format(DATE_FORMAT),
    }
    memberships.push(membershipDto);
    return {
      ...membershipDto,
      validFrom: data.validFrom,
      validUntil: data.validUntil
    };
  },
};
