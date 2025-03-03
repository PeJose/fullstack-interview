import express from "express";
import membershipRoutes from "./modern/routes/membership.routes";
import { errorHandler, requestLogger } from "./middleware";

// because of the javascript module, we need to use require to import the legacy routes
// eslint-disable-next-line @typescript-eslint/no-require-imports
const legacyMembershipRoutes = require("./legacy/routes/membership.routes");

const server = express();

server.use(express.json());

// logger
server.use(requestLogger);

// routes
server.use("/memberships", membershipRoutes);
server.use("/legacy/memberships", legacyMembershipRoutes);
server.use(errorHandler);

export default server;
