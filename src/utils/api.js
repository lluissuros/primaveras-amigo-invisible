import { getEncryptedUser, getDecryptedUser } from "./AuthHelperMethods";

//const BASE_URL = "https://primaveras-server.herokuapp.com/";
const BASE_URL = "http://localhost:5000";

console.error("USING LOCALHOST CHANGE IT");

export function getConfessions() {
  // Get a token from api server using the fetch api
  return makeAuthenticatedRequest(BASE_URL, null, {
    method: "GET"
  });
}

export function getReviews() {
  // Get a token from api server using the fetch api
  return makeAuthenticatedRequest(`${BASE_URL}/reviews/`, null, {
    method: "GET"
  });
}

export function createConfession(text, userId = "userID MISSING") {
  const encryptedUserId = getEncryptedUser();
  console.log("test encrypted userId", encryptedUserId);
  console.log("test Dencrypted userId", getDecryptedUser(encryptedUserId));
  return makeAuthenticatedRequest(BASE_URL, null, {
    method: "POST",
    body: JSON.stringify({
      text,
      userId: encryptedUserId
    })
  });
}

export function createReview(userId, confessionId, score, isSpam = false) {
  const encryptedUserId = getEncryptedUser();
  console.log("test encrypted userId", encryptedUserId);
  console.log("test Dencrypted userId", getDecryptedUser(encryptedUserId));

  const newReview = {
    userId: getEncryptedUser(),
    isSpam,
    confessionId,
    score
  };

  return makeAuthenticatedRequest(`${BASE_URL}/review/`, null, {
    method: "POST",
    body: JSON.stringify(newReview)
  });
}

export function __createConfession(text, userId = "userID MISSING") {
  console.log("Posting request...");
  fetch(BASE_URL, {
    method: "post",
    body: { text, userId }
  })
    .then(response => response.json())
    .catch(e => {
      throw new Error(e.message);
    });
}

function makeAuthenticatedRequest(url, token, options) {
  // performs api calls sending the required authentication headers
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json"
  };

  // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  return fetch(url, {
    headers,
    ...options
  })
    .then(response => response.json())
    .then(responseData => {
      if (responseData.err) {
        throw new Error(responseData.err);
      }
      return responseData;
    })
    .catch(e => {
      throw new Error(e.message);
    });
}
