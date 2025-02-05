const _env = {
  DB_NAME: process.env.DB_NAME,
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT,
  ORIGIN: process.env.ORIGIN,
  ACCESS_TOKEN_SEC: process.env.ACCESS_TOKEN_SEC,
  ACCESS_TOKEN_EXP: process.env.ACCESS_TOKEN_EXP,
  REFRESH_TOKEN_SEC: process.env.REFRESH_TOKEN_SEC,
  REFRESH_TOKEN_EXP: process.env.REFRESH_TOKEN_EXP,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};

const cookieOptions = {
  httpOnly: process.env.COOKIE_HTTPONLY == 1 ? true : false, // Ensures the cookie is sent only via HTTP(S) and not accessible to JavaScript (e.g., `document.cookie`).
  secure: true, // Ensures the cookie is sent only over HTTPS.
  sameSite: "none",
};

export { _env, cookieOptions };
