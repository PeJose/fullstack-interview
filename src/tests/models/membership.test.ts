import dayjs from "dayjs";
import { v4 as uuid } from 'uuid'
import { Membership } from "../../modern/models/membership.model";
import { CreateMembershipModel, MembershipData } from "../../modern/types/membership.types";

describe('Membership model', () => {
  it('find() should provide correct membership structure', () => {
    const memberships = Membership.find();
    expect(memberships).toBeInstanceOf(Array);
    memberships.forEach((membership: MembershipData) => {
      expect(membership).toHaveProperty('id');
      expect(membership).toHaveProperty('uuid');
      expect(membership).toHaveProperty('name');
      expect(membership).toHaveProperty('userId');
      expect(membership).toHaveProperty('recurringPrice');
      expect(membership).toHaveProperty('validFrom');
      expect(membership).toHaveProperty('validUntil');
      expect(membership).toHaveProperty('state');
      expect(membership).toHaveProperty('paymentMethod');
      expect(membership).toHaveProperty('billingInterval');
      expect(membership).toHaveProperty('billingPeriods');
      expect(membership).toHaveProperty('assignedBy');
    });
  });

  it('getLastId() should return the correct last ID', () => {
    const lastId = Membership.getLastId();
    expect(lastId).toBeGreaterThan(0);
  });

  it('create() should add a new membership and return its ID', () => {
    const suspectedId = Membership.getLastId()
    const newMembership: CreateMembershipModel = {
      name: "New Membership",
      state: "active",
      validFrom: new Date('2025-03-03'),
      validUntil: new Date('2026-03-03'),
      assignedBy: "User",
      userId: 0,
      recurringPrice: 0,
      paymentMethod: null,
      billingInterval: "monthly",
      billingPeriods: 0
    };
    const created = Membership.create(newMembership);
    expect(created.id).toBe(suspectedId)

    const memberships = Membership.find();
    const createdMembership = memberships.find(m => m.id === created.id);
    expect(createdMembership).toBeDefined();
    expect(createdMembership).toMatchObject(created);
  });
});