import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";

const MONGO_URI =
  "mongodb+srv://mi062921:pass123@cluster0.dh54u.mongodb.net/dev?retryWrites=true&w=majority&appName=Cluster0"; // Change if needed
const SOURCE_DB = "dev"; // Replace with your database name
const OUTPUT_DIR = "./backup_json"; // Directory to store JSON files

async function exportDatabase() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB...");

    const db = client.db(SOURCE_DB);
    const collections = await db.listCollections().toArray();

    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    for (let coll of collections) {
      const collectionName = coll.name;
      const data = await db.collection(collectionName).find().toArray();

      const filePath = path.join(OUTPUT_DIR, `${collectionName}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

      console.log(`Exported ${collectionName} to ${filePath}`);
    }

    console.log("Database export completed!");
  } catch (error) {
    console.error("Error exporting database:", error);
  } finally {
    await client.close();
  }
}

exportDatabase();
