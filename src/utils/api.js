import {
  getEncryptedUser,
  getDecryptedUser,
  getUsers
} from "./AuthHelperMethods";

const BASE_URL = "https://primaveras-server.herokuapp.com/";
// const BASE_URL = "http://localhost:5000/";

export function getConfessions() {
  // Get a token from api server using the fetch api
  return makeAuthenticatedRequest(BASE_URL, null, {
    method: "GET"
  });
}

export function getReviews() {
  // Get a token from api server using the fetch api
  return makeAuthenticatedRequest(`${BASE_URL}reviews/`, null, {
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

export function createReview(confessionId, score, isSpam = false) {
  const encryptedUserId = getEncryptedUser();
  console.log("test encrypted userId", encryptedUserId);
  console.log("test Dencrypted userId", getDecryptedUser(encryptedUserId));

  const newReview = {
    confessionId,
    score,
    isSpam,
    userId: getEncryptedUser()
  };

  console.log(newReview);
  console.log("posting to db...");
  return makeAuthenticatedRequest(`${BASE_URL}review/`, null, {
    method: "POST",
    body: JSON.stringify(newReview)
  });
}

export function getSortedRanking(confessions, reviews) {
  //we calculate it in the front end, if it takes very long we could warp it in a Promise

  //pendingReviewsByUser = confessions.length - confessionsByUser - reviewsByUser
  const usersObject = getUsers().reduce((acc, user) => {
    acc[user] = 0;
    return acc;
  }, {});
  const postsByUser = confessions.reduce((acc, confession) => {
    const userReal = getDecryptedUser(confession.userId);
    acc[userReal] = acc[userReal] + 1;
    return acc;
  }, Object.assign({}, usersObject));

  const reviewsByUser = reviews.reduce((acc, review) => {
    const userReal = getDecryptedUser(review.userId);
    acc[userReal] = acc[userReal] + 1;
    return acc;
  }, Object.assign({}, usersObject));

  const percentages = getUsers().map(user => {
    const pendingReviews =
      confessions.length - postsByUser[user] - reviewsByUser[user];
    const percentage =
      (100 * (confessions.length - pendingReviews)) / confessions.length;
    return { user, percentage };
  });

  const sortedPercentages = percentages.sort((a, b) => {
    return b.percentage - a.percentage;
  });

  console.log(usersObject);
  console.log(postsByUser);
  console.log(reviewsByUser);
  console.log(percentages);

  return sortedPercentages;
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
