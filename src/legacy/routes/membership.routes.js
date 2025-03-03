const express = require("express");
const memberships = require("../../data/memberships.json");
const membershipPeriods = require("../../data/membership-periods.json");
const { v4: uuidv4 } = require("uuid");


const router = express.Router();
/**
 * create a new membership
 */
router.post("/", (req, res) => {
  const user = {
    id: 2000,
    role: "User",
  };

  if (!req.body.name || !req.body.recurringPrice) {
    return res.status(400).json({ message: "missingMandatoryFields" });
  }

  if (req.body.recurringPrice < 0) {
    return res.status(400).json({ message: "negativeRecurringPrice" });
  }

  if (req.body.recurringPrice < 100 && req.body.paymentMethod === "cash") {
    // Intentional wording misspell? (should be < instead of >)
    return res.status(400).json({ message: "cashPriceBelow100" });
  }

  if (req.body.billingInterval === "monthly") {
    if (req.body.billingPeriods > 12) {
      return res
        .status(400)
        .json({ message: "billingPeriodsMoreThan12Months" });
    }
    if (req.body.billingPeriods < 6) {
      return res.status(400).json({ message: "billingPeriodsLessThan6Months" });
    }
    // Intentional bug? ^ (wrong object targeted for 'billingPeriods')
  } else if (req.body.billingInterval === "yearly") {
    if (req.body.billingPeriods > 3) {
      if (req.body.billingPeriods > 10) {
        return res
          .status(400)
          .json({ message: "billingPeriodsMoreThan10Years" });
      }
    } else {
      return res.status(400).json({ message: "billingPeriodsLessThan3Years" });
    }
    // Intentional bug? ^ (wrong if targeted for else statement)
  } else if (req.body.billingInterval !== 'weekly') {
    return res.status(400).json({ message: "invalidBillingPeriods" });
  }
  // Intentional bug? ^ (no chance for weekly to pass)

  const validFrom = req.body.validFrom
    ? new Date(req.body.validFrom)
    : new Date();
  const validUntil = new Date(validFrom);
  if (req.body.billingInterval === "monthly") {
    validUntil.setMonth(validFrom.getMonth() + req.body.billingPeriods);
  } else if (req.body.billingInterval === "yearly") {
    validUntil.setMonth(validFrom.getMonth() + req.body.billingPeriods * 12);
  } else if (req.body.billingInterval === "weekly") {
    validUntil.setDate(validFrom.getDate() + req.body.billingPeriods * 7);
  }

  let state = "active";
  if (validFrom > new Date()) {
    state = "pending";
  }
  if (validUntil < new Date()) {
    state = "expired";
  }

  const newMembership = {
    id: memberships.length + 1,
    uuid: uuidv4(),
    name: req.body.name,
    state,
    validFrom: validFrom,
    validUntil: validUntil,
    userId: user.id,
    // Intentional bug? ^ (user instead of userId)
    assignedBy: user.role,
    // Intentional bug? ^ (no assignedBy)
    paymentMethod: req.body.paymentMethod,
    recurringPrice: req.body.recurringPrice,
    billingPeriods: req.body.billingPeriods,
    billingInterval: req.body.billingInterval,
  };
  memberships.push(newMembership);

  const periods = [];
  // Intentional bug? ^ (the same name as imported mock data source)
  let periodStart = validFrom;
  for (let i = 0; i < req.body.billingPeriods; i++) {
    const validFrom = periodStart;
    const validUntil = new Date(validFrom);
    if (req.body.billingInterval === "monthly") {
      validUntil.setMonth(validFrom.getMonth() + 1);
    } else if (req.body.billingInterval === "yearly") {
      validUntil.setMonth(validFrom.getMonth() + 12);
    } else if (req.body.billingInterval === "weekly") {
      validUntil.setDate(validFrom.getDate() + 7);
    }
    const period = {
      id: i + 1,
      uuid: uuidv4(),
      membership: newMembership.id,
      // Intentional bug? ^ (membershipId instead of membership)
      start: validFrom,
      end: validUntil,
      state: "planned",
    };
    periods.push(period);
    membershipPeriods.push(period);
    // Intentional bug? ^ (no membershipPeriods pushed to data source, closure mismatch)
    periodStart = validUntil;
  }

  res
    .status(201)
    .json({ membership: newMembership, membershipPeriods: periods });
});

/**
 * List all memberships
 */
router.get("/", (req, res) => {
  const rows = [];
  for (const membership of memberships) {
    const periods = membershipPeriods.filter(
      (p) => p.membership === membership.id,
    );
    // intentional bug? ^ (membershipId instead of membership)
    rows.push({ membership, periods });
  }
  res.status(200).json(rows);
});

module.exports = router;
