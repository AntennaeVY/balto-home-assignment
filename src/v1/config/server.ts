import express from "express";
import pino from "pino-http";
import cors from "cors";

import routes from "../routes";

export function setupServer(port: string, cb: () => void) {
  const app = express();
  app.use(express.text({ type: "*/*" }));

  // This should be logging to persistence (e.g. a file) in production
  app.use(pino());

  // CORS origin should be set for any trusted source (i.e. shopify and social media)
  app.use(cors({ origin: "*" }));
  app.use("/api/v1/", routes);

  app.listen(port, cb);
}
