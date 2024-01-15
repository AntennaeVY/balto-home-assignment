import { Router } from "express";
import storeApp from "../config/shopify";
import { logger } from "../libs/logs";
import { sendEmailQueue, updateLikesAndFollowersQueue } from "../jobs/queues";
import {
  getTopTenFollowersCustomers,
  getTopTenLikesCustomers,
} from "../services/customer";

const router = Router();

router.post("/shopify/webhooks", async (req, res) => {
  try {
    // Automatic HMAC validation
    await storeApp.shopify?.webhooks.process({
      rawBody: req.body,
      rawRequest: req,
      rawResponse: res,
    });
  } catch (err) {
    if (err instanceof Error)
      logger.warn(`Webhook processing error: ${err.message}`);
  }
});

router.post("/social-media/webhooks", async (req, res) => {
  // There should be HMAC validation here to avoid untrusted third party actors but for the sake of the simplicity of the hypothetical situation I won't validate the webhooks
  try {
    const { customer_shopify_id, likes_gained_today, followers_gained_today } =
      JSON.parse(req.body);

    updateLikesAndFollowersQueue.push({
      shopify_id: customer_shopify_id,
      likes_gained_today: +likes_gained_today,
      followers_gained_today: +followers_gained_today,
    });

    // Quick response and later processing improve resilicence to a high volume of requests and avoid timeouts
    res.status(200).send();
  } catch (err) {
    if (err instanceof Error)
      logger.warn(`Webhook processing error: ${err.message}`);

    res.status(500).send("Unexpected Error");
  }
});

router.get("/emails", async (req, res) => {
  // This should be a cronjob as this endpoint is theoretically called just once a month. (P.S. verb shouldn't be GET as it is a command not a query)
  try {
    const topLikesIds = await getTopTenLikesCustomers();
    const topFollowersIds = await getTopTenFollowersCustomers();

    // Compute symmetric difference to avoid sending duplicated emails
    const topLikesFollowersIds = [
      ...new Set([...topLikesIds, ...topFollowersIds]),
    ];

    topLikesFollowersIds.forEach((id) =>
      sendEmailQueue.push({ shopify_id: id })
    );

    res.status(200).send();
  } catch (err) {
    if (err instanceof Error)
      logger.warn(`Webhook processing error: ${err.message}`);
  }
});

export default router;
