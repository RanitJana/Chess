import { google } from "googleapis";
import { _env } from "../constants.js";

const GOOGLE_CLIENT_ID = _env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = _env.GOOGLE_CLIENT_SECRET;

const oauth2client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "postmessage"
);

export default oauth2client;
