import dayjs from "dayjs";
import type { Request, Response } from "express";
import type { TypedRequest } from "../../middleware/validator.middleware";
import { DATE_FORMAT, MOCK_USER, PERIOD_TO_UNIT } from "../constants/common";
import { Membership, MembershipPeriod } from "../models";
import type {
  CreateMembershipDTO,
  GetAllMembershipsDTO,
} from "../types/membership.types";
import type { CreateMembershipSchema } from "../validations/membership.validations";

export async function getAllMemberships(
  _req: Request,
  res: Response<GetAllMembershipsDTO>,
) {
  const memberships = Membership.find();
  const returnData = memberships.map((membership) => {
    const periods = MembershipPeriod.findByMembership(membership.id).map(
      (period) => ({
        ...period,
        start: dayjs(period.start).format(DATE_FORMAT),
        end: dayjs(period.end).format(DATE_FORMAT),
      }),
    );

    return {
      membership: {
        ...membership,
        validFrom: dayjs(membership.validFrom).format(DATE_FORMAT),
        validUntil: dayjs(membership.validUntil).format(DATE_FORMAT),
      },
      periods,
    };
  });
  res.json(returnData);
}

export function createMembership(
  req: TypedRequest<typeof CreateMembershipSchema>,
  res: Response<CreateMembershipDTO>,
) {
  const validFrom = dayjs(new Date(req.body.validFrom ?? ""));

  const unit = PERIOD_TO_UNIT[req.body.billingInterval]
  const validUntil = validFrom.add(req.body.billingPeriods, unit);

  const state = dayjs().isBefore(validFrom)
    ? "pending"
    : dayjs().isAfter(validUntil)
      ? "expired"
      : "active";

  const newMembership = {
    name: req.body.name,
    state,
    validFrom: validFrom.toDate(),
    validUntil: validUntil.toDate(),
    userId: MOCK_USER.id,
    assignedBy: MOCK_USER.role,
    paymentMethod: req.body.paymentMethod,
    recurringPrice: req.body.recurringPrice,
    billingPeriods: req.body.billingPeriods,
    billingInterval: req.body.billingInterval,
  };
  const createdMembership = Membership.create(newMembership);

  let periodStart = validFrom;
  const membershipPeriods = [];
  for (let i = 0; i < req.body.billingPeriods; i++) {
    const validFrom = periodStart;
    const validUntil = validFrom.add(1, unit)

    const period = {
      id: i + 1,
      membership: createdMembership.id,
      start: validFrom.toDate(),
      end: validUntil.toDate(),
      state: "planned",
    };
    const createdPeriod = MembershipPeriod.create(period);
    membershipPeriods.push(createdPeriod);

    periodStart = validUntil;
  }

  res.status(201).json({ membership: createdMembership, membershipPeriods });
}
