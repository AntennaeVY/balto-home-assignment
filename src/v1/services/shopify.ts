import storeApp from "../config/shopify";
import { logger } from "../libs/logs";

export async function getCustomerEmailById(shopify_id: number) {
  const query = await storeApp.graphqlClient?.request(
    `{
        customer(id: "gid://shopify/Customer/${shopify_id}") {
          email
        }
      }`
  );

  return query?.data?.customer?.email;
}

// I would just get all this data from the webhooks and then store in MongoDB but for the purpose of the exercise, I'll perform GraphQL queries

export async function getCustomerDataForEmail(shopify_id: number) {
	  const query = await storeApp.graphqlClient?.request(
      `{
        customer(id: "gid://shopify/Customer/${shopify_id}") {
          firstName,
          createdAt
        }
      }`
    );

    return query?.data?.customer;
}
