const connectDB = require("./src/configs/db");
const app = require("./src/app");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", { error });
    process.exit(1);
  }
};

startServer();
