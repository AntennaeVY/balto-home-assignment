import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Customer email is required"],
    match: /.+\@.+\..+/,
	unique: true
  },
  shopify_id: {
    type: Number,
    required: [true, "Shopify customer id is required"],
	unique: true,
  },
  total_likes_gained: {
    type: Number,
    required: true,
	default: 0,
  },
  total_followers_gained: {
    type: Number,
    required: true,
	default: 0,
  },
});

customerSchema.plugin(require("mongoose-unique-validator"));

export const Customer = mongoose.model("Customer", customerSchema);
