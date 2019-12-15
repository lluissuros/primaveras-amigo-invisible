const BASE_URL = "http://localhost:3001";
const LOGIN_URL = `${BASE_URL}/users/login`;
const SIGNUP_URL = `${BASE_URL}/users/signup`;
const CONTACTS_URL = `${BASE_URL}/contacts`;

export function login(username, password) {
  // Get a token from api server using the fetch api
  return makeAuthenticatedRequest(LOGIN_URL, null, {
    method: "POST",
    body: JSON.stringify({
      username,
      password
    })
  });
}

export function signup(username, password) {
  // Get a token from api server using the fetch api
  return makeAuthenticatedRequest(SIGNUP_URL, null, {
    method: "POST",
    body: JSON.stringify({
      username,
      password
    })
  });
}

export function getContacts(tocken) {
  return makeAuthenticatedRequest(CONTACTS_URL, tocken, {
    method: "GET"
  }).then(responseData => responseData.contacts);
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
