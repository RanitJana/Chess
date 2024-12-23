const _env = {
  DB_NAME: process.env.DB_NAME,
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT,
  ORIGIN: process.env.ORIGIN,
  ACCESS_TOKEN_SEC: process.env.ACCESS_TOKEN_SEC,
  ACCESS_TOKEN_EXP: process.env.ACCESS_TOKEN_EXP,
  REFRESH_TOKEN_SEC: process.env.REFRESH_TOKEN_SEC,
  REFRESH_TOKEN_EXP: process.env.REFRESH_TOKEN_EXP,
};

const cookieOptions = {
  httpOnly: false, // Ensures the cookie is sent only via HTTP(S) and not accessible to JavaScript (e.g., `document.cookie`).
  secure: false, // Ensures the cookie is sent only over HTTPS.
  maxAge: 24 * 60 * 60 * 1000, //set for 1 day.
  sameSite: "none",
};

export { _env, cookieOptions };
