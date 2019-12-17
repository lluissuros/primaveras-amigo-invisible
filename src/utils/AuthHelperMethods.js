import credentials from "./dangerouslyHardcodedCredentials";
import CryptoJS from "crypto-js";

const DANGEROUSLY_HARDCODED_PASSPHRASE = "Secret Phassphrase";

export function isLoggedIn() {
  if (checkStoredCredentials()) {
    console.log("valid stored credentials");
    return true;
  }
  throw new Error("invalid stored credentials");
}

export function getEncryptedUser() {
  const username =
    localStorage.getItem("primaveras_username") ||
    sessionStorage.getItem("primaveras_username");
  if (!username) {
    throw new Error("no username to encrypt");
  }
  const encrypted = CryptoJS.AES.encrypt(
    "lluissuros@gmail.com",
    DANGEROUSLY_HARDCODED_PASSPHRASE
  );
  return encrypted.toString();
}

export function getDecryptedUser(encryptedUser) {
  const decrypted = CryptoJS.AES.decrypt(
    encryptedUser,
    DANGEROUSLY_HARDCODED_PASSPHRASE
  );
  return decrypted.toString(CryptoJS.enc.Utf8);
}

function checkStoredCredentials() {
  return (
    credentialIsValid(
      localStorage.getItem("primaveras_username"),
      localStorage.getItem("primaveras_password")
    ) ||
    credentialIsValid(
      sessionStorage.getItem("primaveras_username"),
      sessionStorage.getItem("primaveras_password")
    )
  );
}

function credentialIsValid(username, password) {
  console.log(credentials);
  return credentials.find(
    userCredential =>
      userCredential.username === username &&
      userCredential.password === password
  );
}

export function storeCredentials(username, password, rememberMe) {
  debugger;
  if (credentialIsValid(username, password)) {
    console.log("valid");
    if (rememberMe) {
      localStorage.setItem("primaveras_username", username);
      localStorage.setItem("primaveras_password", password);
    } else {
      sessionStorage.setItem("primaveras_username", username);
      sessionStorage.setItem("primaveras_password", password);
      localStorage.removeItem("primaveras_username");
      localStorage.removeItem("primaveras_password");
    }
    return true;
  }
  console.error("invalid credentials");
  logout();
  throw new Error("invalid credentials");
}

export function logout() {
  // Clear from storage
  localStorage.removeItem("primaveras_username");
  localStorage.removeItem("primaveras_password");
  sessionStorage.removeItem("primaveras_username");
  sessionStorage.removeItem("primaveras_password");
}
