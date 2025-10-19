import "dotenv/config";
import app from "./app";
import { AppDataSource } from "./db";
import "reflect-metadata"

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await AppDataSource.initialize();
    console.log('database connected')
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
  }
}

main();
