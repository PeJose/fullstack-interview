import express from "express";
import {
  getAllMemberships,
  createMembership,
} from "../handlers/membership.handler";
import { validator } from "../../middleware";
import { CreateMembershipSchema } from "../validations/membership.validations";

const router = express.Router();

router.get("/", getAllMemberships);
router.post("/", validator(CreateMembershipSchema), createMembership);

export default router;
