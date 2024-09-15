import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_secret: process.env.JWT_ACCESS_SECRET,
  STORE_ID: process.env.STORE_ID,
  SIGNATURE_KEY: process.env.SIGNATURE_KEY,
  PAYMENT_URL: process.env.PAYMENT_URL,
  PAYMENT_Check_URL: process.env.PAYMENT_Check_URL,
};
