import {
  createCustomerQueue,
  deleteCustomerQueue,
  updateCustomerQueue,
} from "../jobs/queues";
import { logger } from "../libs/logs";

export async function handleCustomerCreation(
  topic: string,
  shop: string,
  webhookRequestBody: string,
) {
  logger.info(`${topic} webhook fired on ${shop}`);

  const { id, email } = JSON.parse(webhookRequestBody);

  createCustomerQueue.push({ shopify_id: id, email });
}

export async function handleCustomerUpdate(
  topic: string,
  shop: string,
  webhookRequestBody: string,
) {
  logger.info(`${topic} webhook fired on ${shop}`);

  const { id, email } = JSON.parse(webhookRequestBody);

  updateCustomerQueue.push({ shopify_id: id, email });
}

export async function handleCustomerDeletion(
  topic: string,
  shop: string,
  webhookRequestBody: string,
) {
  logger.info(`${topic} webhook fired on ${shop}`);

  const { id } = JSON.parse(webhookRequestBody);

  deleteCustomerQueue.push({ shopify_id: id });
}
