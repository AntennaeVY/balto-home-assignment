import mongoose from "mongoose";

export async function connectToDatabase() {
  const DATABASE_URI = process.env.DATABASE_URI as string;
  
  await mongoose.connect(DATABASE_URI);
}
