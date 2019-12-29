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

function buildByConfessionId(confessions, reviews) {
  const scoresByConfessionId = {};
  const spamByConfessionId = {};
  for (let i = 0; i < reviews.length; i++) {
    const currentReview = reviews[i];

    if (!getDecryptedUser(currentReview.userId).includes("@")) {
      continue; //invalid user
    }

    if (currentReview.isSpam) {
      //addSpam
      spamByConfessionId[currentReview.confessionId] = spamByConfessionId[
        currentReview.confessionId
      ]
        ? spamByConfessionId[currentReview.confessionId] + 1
        : 1;
      continue;
    }

    //add Score to Array
    scoresByConfessionId[currentReview.confessionId] = scoresByConfessionId[
      currentReview.confessionId
    ]
      ? scoresByConfessionId[currentReview.confessionId].concat(
          currentReview.score
        )
      : [currentReview.score];
  }

  const cleanSpamByConfessionId = Object.entries(spamByConfessionId).reduce(
    (acc, ent) => {
      if (ent[1] > 1) {
        acc[ent[0]] = ent[1];
      }
      return acc;
    },
    {}
  );

  return { scoresByConfessionId, spamByConfessionId: cleanSpamByConfessionId };
}

function byHigherScore(scoresByConfessionId) {
  const average = arr => arr.reduce((acc, el) => acc + el, 0) / arr.length;
  const sortedByAverage = Object.entries(scoresByConfessionId).sort(
    (a, b) => average(b[1]) - average(a[1])
  );
  return sortedByAverage.map(el => {
    return { confessionId: el[0], average: average(el[1]), scores: el[1] };
  });
}

function byLowerScore(scoresByConfessionId) {
  const average = arr => arr.reduce((acc, el) => acc + el, 0) / arr.length;
  const sortedByAverage = Object.entries(scoresByConfessionId).sort(
    (a, b) => average(a[1]) - average(b[1])
  );
  return sortedByAverage.map(el => {
    return { confessionId: el[0], average: average(el[1]), scores: el[1] };
  });
}

export function getRankedResults() {
  return Promise.all([getConfessions(), getReviews()]).then(values => {
    const confessions = values[0];
    const reviews = values[1];
    console.log(confessions);
    console.log(reviews);

    const { scoresByConfessionId, spamByConfessionId } = buildByConfessionId(
      confessions,
      reviews
    );

    return {
      scoresByConfessionId,
      spamByConfessionId,
      byHigherScore: byHigherScore(scoresByConfessionId),
      byLowerScore: byLowerScore(scoresByConfessionId)
    };
    // return {byHigherScore, byLowerScore, byMostAgreement, byLessAgreement, spam}
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

  const confessionIds = confessions.map(conf => conf._id);

  const validReviews = reviews.filter(review =>
    confessionIds.includes(review.confessionId)
  );

  const reviewsByUser = validReviews.reduce((acc, review) => {
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
