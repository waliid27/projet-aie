import "dotenv/config";
import app from "./app";
import { AppDataSource } from "./config/data-source";

const port = Number(process.env.PORT || 3000);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1);
  });
