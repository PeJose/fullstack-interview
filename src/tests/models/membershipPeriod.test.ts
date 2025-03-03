import { v4 as uuid } from 'uuid'
import { Membership, MembershipPeriod } from "../../modern/models";
import { MembershipPeriodData } from "../../modern/types/membershipPeriod.types";

describe('Membership period model', () => {
  it('find() should provide correct membership structure', () => {
    const membershipId = Membership.find()[0].id
    const memberships = MembershipPeriod.findByMembership(membershipId);
    expect(memberships).toBeInstanceOf(Array);
    memberships.forEach((membership: MembershipPeriodData) => {
      expect(membership).toHaveProperty('id');
      expect(membership).toHaveProperty('start');
      expect(membership).toHaveProperty('end');
      expect(membership).toHaveProperty('state');
      expect(membership).toHaveProperty('membership');
    });
  });

  it('create() should add a new membership and return its ID', () => {
    const newPeriod: MembershipPeriodData = {
      id: 2,
      state: "active",
      start: new Date('2025-03-03'),
      end: new Date('2026-03-03'),
      uuid: uuid(),
      membership: 1
    };
    const created = MembershipPeriod.create(newPeriod);

    const memberships = MembershipPeriod.findByMembership(1);
    const createdMembership = memberships.find(m => m.id === created.id);
    expect(createdMembership).toBeDefined();
    expect(createdMembership).toMatchObject(created);
  });
});