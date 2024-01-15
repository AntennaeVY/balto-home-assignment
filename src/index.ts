import { connectToDatabase } from "./v1/config/database";
import { setupServer } from "./v1/config/server";
import { setupShopifyApiAndWebhooks } from "./v1/config/shopify";
import { loadEnvironmentVariables } from "./v1/libs/misc";
import { logger } from "./v1/libs/logs";
import { setupMailer } from "./v1/config/email";

loadEnvironmentVariables(require("node:path").join(__dirname, "../.env"));

const PORT = process.env.PORT as string;

setupShopifyApiAndWebhooks()
  .then(() => {
    logger.info(`Shopify API access set up successfully`);
  })
  .catch((err) => {
    logger.fatal(`Shopify API access set up error: ${err.message}`);
    process.exit();
  });

connectToDatabase()
  .then(() => {
    logger.info(`Database connection established`);
  })
  .catch((err) => {
    logger.fatal(`Database connection error: ${err.message}`);
    process.exit();
  });

setupMailer()
  .then(() => logger.info(`SMTP server connection established`))
  .catch((err) => {
    if (err instanceof Error)
      logger.warn(`SMTP server connection error: ${err.message}`);
  });

setupServer(PORT, () => {
  logger.info(`Server starting on port ${PORT}`);
});
