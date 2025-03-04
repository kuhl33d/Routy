import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";

const MONGO_URI =
  "mongodb+srv://mi062921:pass123@cluster0.dh54u.mongodb.net/dev?retryWrites=true&w=majority&appName=Cluster0"; // Change if needed
const TARGET_DB = "dev"; // Replace with your database name
const BACKUP_DIR = "./backup_json"; // Directory where JSON files are stored

async function importDatabase() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB...");

    const db = client.db(TARGET_DB);
    const files = fs.readdirSync(BACKUP_DIR);

    for (let file of files) {
      const collectionName = path.basename(file, ".json");
      const filePath = path.join(BACKUP_DIR, file);
      const rawData = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(rawData);

      if (data.length > 0) {
        await db.collection(collectionName).insertMany(data);
        console.log(`Imported ${data.length} documents into ${collectionName}`);
      } else {
        console.log(`Skipped empty collection: ${collectionName}`);
      }
    }

    console.log("Database import completed!");
  } catch (error) {
    console.error("Error importing database:", error);
  } finally {
    await client.close();
  }
}

importDatabase();
