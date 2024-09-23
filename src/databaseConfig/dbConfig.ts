import mongoose from "mongoose";

export async function dbConnect() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI!
    );
    const connection = mongoose.connection;

    connection.on("connected", () => {
        console.log("MongoDB: connected successfully")
    })

    connection.on("error", () => {
        console.log("MongoDB: connection error")

        process.exit()
    })

  } catch (error) {
    console.log("MongoDB connection: something went wrong");
  }
}
