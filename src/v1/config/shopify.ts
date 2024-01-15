import "@shopify/shopify-api/adapters/node";
import { GraphqlClient } from "@shopify/shopify-api/lib/clients/admin/graphql/client";
import {
  LogSeverity,
  shopifyApi,
  ApiVersion,
  Shopify,
  DeliveryMethod,
} from "@shopify/shopify-api";

import {
  handleCustomerCreation,
  handleCustomerDeletion,
  handleCustomerUpdate,
} from "../webhooks/handlers";
import { logger } from "../libs/logs";

const storeApp: { shopify?: Shopify, graphqlClient?: GraphqlClient} = {};

export async function setupShopifyApiAndWebhooks() {
  const shopify = shopifyApi({
    apiSecretKey: process.env.SHOPIFY_API_SECRET as string,
    adminApiAccessToken: process.env.SHOPIFY_ACCESS_TOKEN as string,
    hostName: process.env.SHOPIFY_HOSTNAME as string,
    scopes: process.env.SHOPIFY_SCOPES?.split(","),
    hostScheme: "https",
    apiVersion: ApiVersion.January24,
    isEmbeddedApp: false,
    isCustomStoreApp: true,
    logger: {
      log: (severity, message) => {
        if (severity == LogSeverity.Debug) logger.debug(message);
        else if (severity == LogSeverity.Error) logger.error(message);
        else if (severity == LogSeverity.Info) logger.info(message);
        else logger.warn(message);
      },
    },
  });

  shopify.webhooks.addHandlers({
    CUSTOMERS_CREATE: [
      {
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: "/api/v1/shopify/webhooks",
        callback: handleCustomerCreation,
      },
    ],
    CUSTOMERS_UPDATE: [
      {
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: "/api/v1/shopify/webhooks",
        callback: handleCustomerUpdate,
      },
    ],
    CUSTOMERS_DELETE: [
      {
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: "/api/v1/shopify/webhooks",
        callback: handleCustomerDeletion,
      },
    ],
  });

  const store = process.env.SHOPIFY_STORE_DOMAIN as string;
  const session = shopify.session.customAppSession(store);

  /*
    If running the app in development mode multiple times, this will produce duplicated webhooks, it can be fixed by re-installing the app again.

    I don't "unregister" webhooks for two specific reasons:

    1) There is no clear way to do it so using the shopify-api library and implementation is quite annoying (have to perform multiple queries/mutations through GrahpQL/REST APIs) which I consider it's overcomplicating the assignment
    2) It's not that easy to distinct between the ids of registered webhooks and those which were not registered by this app.

    Anyways, the app would fail silently to duplicated webhooks since operations are idempotent (creation is idempotent due to uniqueness constraints)
  */
  shopify.webhooks.register({
    session: session,
  });

  // Custom apps don't have sessions, so it is safe to do this to avoid creating a new client per request, which could be somewhat costly in terms of performance.
  storeApp.graphqlClient = new shopify.clients.Graphql({
    session: session,
    apiVersion: ApiVersion.January24,
  });

  storeApp.shopify = shopify;
}

export default storeApp;
