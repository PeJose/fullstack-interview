import request from "supertest";
import type { MembershipPeriodData } from "../../modern/types/membershipPeriod.types";
import server from "../../server";

describe("Refactor(POST:/memberships)", () => {
  const legacyRoute = "/legacy/memberships";
  const refactorRoute = "/memberships";
  const mockData = {
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
  };
  const edgeCasesData = [
    { explanation: "should return missingMandatoryFields<400>", data: {} },
    {
      explanation: "should return negativeRecurringPrice<400>",
      data: { ...mockData, recurringPrice: -10 },
    },
    {
      explanation: "should return cashPriceBelow100<400>",
      data: { ...mockData, recurringPrice: 90, paymentMethod: "cash" },
    },
    {
      explanation: "should return billingPeriodsMoreThan12Months<400>",
      data: { ...mockData, billingInterval: "monthly", billingPeriods: 13 },
    },
    {
      explanation: "should return billingPeriodsLessThan6Months<400>",
      data: { ...mockData, billingInterval: "monthly", billingPeriods: 5 },
    },
    {
      explanation: "should return billingPeriodsMoreThan10Years<400>",
      data: { ...mockData, billingInterval: "yearly", billingPeriods: 11 },
    },
    {
      explanation: "should return billingPeriodsLessThan3Years<400>",
      data: { ...mockData, billingInterval: "yearly", billingPeriods: 2 },
    },
    {
      explanation: "should return invalidBillingPeriods<400>",
      data: { ...mockData, billingInterval: "daily" },
    },
  ];

  it("legacy and refactor should return equal: should succeed", async () => {
    const [legacyResponse, refactorResponse] = await Promise.all([
      await request(server).post(legacyRoute).send(mockData),
      await request(server).post(refactorRoute).send(mockData),
    ]);
    expect(refactorResponse.status).toBe(legacyResponse.status);
    expect(refactorResponse.body).toEqual({
      membership: {
        ...legacyResponse.body.membership,
        id: expect.any(Number),
        uuid: expect.any(String),
      },
      membershipPeriods: legacyResponse.body.membershipPeriods.map(
        (period: MembershipPeriodData) => ({
          ...period,
          membership: expect.any(Number),
          uuid: expect.any(String),
        }),
      ),
    });
  });

  it.each(edgeCasesData)(
    "legacy and refactor should return equal: $explanation",
    async ({ data }) => {
      const [legacyResponse, refactorResponse] = await Promise.all([
        await request(server).post(legacyRoute).send(data),
        await request(server).post(refactorRoute).send(data),
      ]);
      expect(refactorResponse.status).toBe(legacyResponse.status);
      expect(refactorResponse.body).toEqual(legacyResponse.body);
    },
  );
});
