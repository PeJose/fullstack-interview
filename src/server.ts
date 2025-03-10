import express from "express";
import helmet from "helmet";
import { errorHandler, requestLogger } from "./middleware";
import membershipRoutes from "./modern/routes/membership.routes";

// because of the javascript module, we need to use require to import the legacy routes
// eslint-disable-next-line @typescript-eslint/no-require-imports
const legacyMembershipRoutes = require("./legacy/routes/membership.routes");

const server = express();

server.use(express.json());
server.use(helmet())

// logger
server.use(requestLogger);

// routes
server.use("/memberships", membershipRoutes);
server.use("/legacy/memberships", legacyMembershipRoutes);
server.use(errorHandler);

export default server;
