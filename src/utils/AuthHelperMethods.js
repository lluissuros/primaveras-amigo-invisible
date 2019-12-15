import credentials from "./dangerouslyHardcodedCredentials";

export function isLoggedIn() {
  if (checkStoredCredentials()) {
    console.log("valid stored credentials");
    return true;
  }
  throw new Error("invalid stored credentials");
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
