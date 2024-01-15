import pino from "pino";

// This should be logging to persistence (e.g. a file) in production
export const logger = pino();
