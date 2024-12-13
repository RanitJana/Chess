import CryptoJS from "crypto-js";

// Secret Key (This must be securely shared or generated per session)
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY; // Ideally generated dynamically in a secure app

// Encrypt Function
export const encryptMessage = (message) => {
  return CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
};

// Decrypt Function
export const decryptMessage = (encryptedMessage) => {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
