import { MongoClient } from "mongodb";

const MONGO_URI =
  "mongodb+srv://mi062921:pass123@cluster0.dh54u.mongodb.net/dev?retryWrites=true&w=majority&appName=Cluster0"; // Change if needed
const SOURCE_DB = "dev"; // Replace with your database name

async function dropCollections() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB...");

    const db = client.db(SOURCE_DB);
    const collections = await db.listCollections().toArray();

    for (let coll of collections) {
      await db.collection(coll.name).deleteMany({});
      console.log(`Cleared all documents from collection: ${coll.name}`);
    }

    console.log("All collections cleared successfully!");
  } catch (error) {
    console.error("Error clearing collections:", error);
  } finally {
    await client.close();
  }
}

dropCollections();
