import { Customer } from "../models/Customer";

export async function getTopTenLikesCustomers() {
  const topTen = await Customer.find()
    .sort({ total_likes_gained: "desc" })
    .limit(10);

  return topTen.map((c) => c.shopify_id);
}

export async function getTopTenFollowersCustomers() {
  const topTen = await Customer.find()
    .sort({ total_followers_gained: "desc" })
    .limit(10);

  return topTen.map((c) => c.shopify_id);
}
