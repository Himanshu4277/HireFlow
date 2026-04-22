import mongoose from "mongoose";

const MONGO_URI: string = process.env.MONGO_URI || "";

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI in your environment variables");
}

const dbConnect = async (): Promise<typeof mongoose> => {
  try {
    const connection = await mongoose.connect(MONGO_URI);

    console.log(`MongoDB Connected: ${connection.connection.host}`);

    return connection;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("MongoDB connection error:", error.message);
    } else {
      console.error("Unknown MongoDB connection error");
    }
    process.exit(1);
  }
};

export default dbConnect;