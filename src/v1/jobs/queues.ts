import Queue from "better-queue";
import { Customer } from "../models/Customer";
import { logger } from "../libs/logs";
import {
  getCustomerDataForEmail,
  getCustomerEmailById,
} from "../services/shopify";
import { sendCongratsEmail } from "../services/email";

// This should be a stored queue for production and performance can be improved by batching jobs, but for simplicity I won't batch them
// Using worker threads here is not advised as operations are not CPU-intensive but I/O bound and Node.js is quite good at the latter

export const createCustomerQueue = new Queue(async (input, cb) => {
  try {
    const { shopify_id, email } = input;

    await Customer.create({ shopify_id: shopify_id, email: email });

    logger.info(`Customer created: ${shopify_id}`);
  } catch (err) {
    if (err instanceof Error)
      logger.warn(
        `Customer creation failure: ${input.shopify_id}. (${err.message})`
      );
  }

  return cb(null, null);
});

export const updateCustomerQueue = new Queue(async (input, cb) => {
  try {
    const { shopify_id, email } = input;

    // It upserts in case an already existing record is updated prior to the app's execution
    await Customer.findOneAndUpdate(
      { shopify_id: shopify_id },
      { email: email },
      { new: true, upsert: true, runValidators: true, context: "query" }
    );

    logger.info(`Customer updated: ${shopify_id}`);
  } catch (err) {
    if (err instanceof Error)
      logger.warn(
        `Customer update failure: ${input.shopify_id}. (${err.message})`
      );
  }

  return cb(null, null);
});

export const deleteCustomerQueue = new Queue(async (input, cb) => {
  try {
    const { shopify_id } = input;
    // Should fail silently if customer doesn't exist, it can be handled if desired
    await Customer.deleteOne({ shopify_id });

    logger.info(`Customer deleted: ${shopify_id}`);
  } catch (err) {
    if (err instanceof Error)
      logger.warn(
        `Customer deletion failure: ${input.shopify_id}. (${err.message})`
      );
  }

  return cb(null, null);
});

export const updateLikesAndFollowersQueue = new Queue(async (input, cb) => {
  try {
    const { shopify_id, likes_gained_today, followers_gained_today } = input;
    let customer = await Customer.findOne({ shopify_id: shopify_id });

    // Create the customer if it isn't in the database already, assuming that social media webhooks send always valid customers (i.e. those existing in shopify store)
    if (!customer) {
      const email = await getCustomerEmailById(shopify_id);

      customer = new Customer({
        shopify_id: shopify_id,
        email: email,
      });
    }

    /* 
        This is not idempotent so duplicated social media webhooks must be handled in a real scenario, as in this exercise these are manually crafted this shouldn't happen. 
        This isn't HMAC verified for simplicity but a malicious actor could substract likes/followers from any other customer if desired by POSTing negative quantities.
      */
    customer.total_likes_gained += likes_gained_today;
    customer.total_followers_gained += followers_gained_today;

    await customer.save();

    logger.info(`Customer likes and followers updated: ${shopify_id}`);
  } catch (err) {
    if (err instanceof Error)
      logger.warn(
        `Customer likes and followers update failure: ${input.shopify_id}. (${err.message})`
      );
  }

  return cb(null, null);
});

export const sendEmailQueue = new Queue(async (input, cb) => {
  try {
    const data = await getCustomerDataForEmail(input.shopify_id);
    const customer = await Customer.findOne({ shopify_id: input.shopify_id });

    // This should never happen but typescript needs to perform type safety
    if (!customer)
      throw new Error(`Customer with id ${input.shopify_id} doesn't exist`);

    await sendCongratsEmail(customer.email, {
      name: data.firstName,
      date: (new Date(data.createdAt)).toDateString(),
      likes: customer.total_likes_gained,
      followers: customer.total_followers_gained,
    });

    // Shouldn't leak customer email through logs but it's okay for this app
    logger.info(`Email delivery success: ${customer.email}`);
  } catch (err) {
    if (err instanceof Error)
      logger.warn(`Email delivery failure: ${err.message}`);
  }

  return cb(null, null);
});
