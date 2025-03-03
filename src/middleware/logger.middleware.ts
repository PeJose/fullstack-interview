import morgan from "morgan";

const requestLogger = morgan("dev", { skip: () => process.env.NODE_ENV === 'test' });

export { requestLogger };
