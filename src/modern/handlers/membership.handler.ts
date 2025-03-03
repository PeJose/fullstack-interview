import dayjs from "dayjs";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import type { TypedRequest } from "../../middleware/validator.middleware";
import { DATE_FORMAT, MOCK_USER } from "../constants/common";
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

  const unit =
    req.body.billingInterval === "monthly"
      ? "month"
      : req.body.billingInterval === "yearly"
        ? "year"
        : "day";
  const validUntil = validFrom.add(req.body.billingPeriods, unit);

  const state = dayjs().isBefore(validFrom)
    ? "pending"
    : dayjs().isAfter(validUntil)
      ? "expired"
      : "active";

  const newMembership = {
    id: Membership.getLastId(),
    uuid: uuidv4(),
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
  Membership.create(newMembership);

  let periodStart = validFrom;
  const membershipPeriods = [];
  for (let i = 0; i < req.body.billingPeriods; i++) {
    const validFrom = periodStart;
    const validUntil = validFrom.add(1, unit);

    const period = {
      id: i + 1,
      uuid: uuidv4(),
      membership: newMembership.id,
      start: validFrom.toDate(),
      end: validUntil.toDate(),
      state: "planned",
    };
    MembershipPeriod.create(period);
    membershipPeriods.push(period);

    periodStart = validUntil;
  }

  res.status(201).json({ membership: newMembership, membershipPeriods });
}
