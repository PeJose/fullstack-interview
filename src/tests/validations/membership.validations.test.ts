import { CreateMembershipSchema } from '../../modern/validations/membership.validations';

describe('Membership Validations', () => {
  it('should validate correct membership data', () => {
    const validData = {
      name: "Platinum Plan",
      userId: 2000,
      recurringPrice: 150.0,
      validFrom: "2023-01-01",
      validUntil: "2023-12-31",
      state: "active",
      assignedBy: "Admin",
      paymentMethod: "credit card",
      billingInterval: "monthly",
      billingPeriods: 12,
    }
    const { error } = CreateMembershipSchema.safeParse(validData);
    expect(error).toBeUndefined();
  });

  it('should invalidate incorrect membership data', () => {
    const data = {};
    const { error } = CreateMembershipSchema.safeParse(data);
    expect(error).toBeDefined();
  });
});
