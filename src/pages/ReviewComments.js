import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MoonLoader from "react-spinners/MoonLoader";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import finishImg from "../img/finish.jpeg";
import errorImg from "../img/error.jpeg";

import { css } from "@emotion/core";
import styled from "styled-components";

import {
  Card,
  Logo,
  Form,
  Input,
  Button,
  Error,
  GradientBox
} from "../components/StyledComponents";
import Header from "../components/Header";
import {
  logout,
  getDecryptedUser,
  getEncryptedUser,
  getUsers,
  getPassword
} from "../utils/AuthHelperMethods";
import {
  getConfessions,
  getReviews,
  createConfession,
  createReview,
  getSortedRanking
} from "../utils/api";

const overrideSpinner = css`
  display: block;
  margin: 90px auto;
  border-color: red;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  justify-content: left;
  margin: 3px;
`;

const TextArea = styled.textarea`
  background: transparent;
  min-height: 190px;
  min-width: 300px;
  font-size: 14px;
  padding: 12px;
  box-sizing: border-box;
`;

const HeaderPlaceholder = styled.div`
  height: 65px;
`;

const LogoContainer = styled.div`
  height: 175px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

function ReviewComments({ history }) {
  const [error, setError] = useState("hello");
  const [currentPercent, setCurrentPercent] = useState(null);
  const [currentRanking, setCurrentRanking] = useState(null);
  const [currentConfReview, setCurrentConfReview] = useState(null);
  const [isSpam, setIsSpam] = useState(false);
  const [score, setScore] = useState(null);

  const SliderWithTooltip = Slider.createSliderWithTooltip(Slider);

  const chooseCurrentReviewIfReady = (confessions, reviews) => {
    if (confessions.length === 0 || reviews.length === 0) {
      console.log("need more info");
      return;
    }
    const validConfessions = getValidConfessions(confessions, reviews);
    setCurrentConfReview(validConfessions[0]);
  };

  const fetchData = () => {
    try {
      console.log("fetching data...");
      let fetchedConfessions = [];
      let fetchedReviews = [];
      //reset
      setError(null);
      setCurrentConfReview(null);
      setIsSpam(false);
      setScore(null);

      getConfessions()
        .then(responseData => {
          fetchedConfessions = responseData;
        })
        .then(() => {
          chooseCurrentReviewIfReady(fetchedConfessions, fetchedReviews);
        })
        .catch(e => setError("💩❓💩DA FUCK un error 💩❓💩"));

      // get reviews
      getReviews()
        .then(responseData => {
          fetchedReviews = responseData;
        })
        .then(() => {
          chooseCurrentReviewIfReady(fetchedConfessions, fetchedReviews);
        })
        .catch(e => setError("💩❓💩DA FUCK un error 💩❓💩"));
    } catch {
      setError("💩❓💩DA FUCK un error 💩❓💩");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    history.push(`/`);
  };

  const handleSlider = val => {
    setScore(val);
  };

  const handleSubmitReview = () => {
    console.log("posting Review...");
    createReview(currentConfReview._id, score, isSpam)
      .then(createdReview => {
        notifySucces(
          `review guardat, merci! score: ${JSON.stringify(createdReview.score)}`
        );
        fetchData();
      })
      .catch(e => notifyError(e.message));
  };

  const notifySucces = (message = "no message") =>
    toast(message, { type: toast.TYPE.SUCCESS });

  const notifyError = (message = "no message") =>
    toast(message, { type: toast.TYPE.ERROR });

  const getValidConfessions = (confessions, reviews) => {
    console.log(confessions);
    console.log(reviews);

    // 1- filter not mine confessions
    const encryptedUserId = getEncryptedUser();
    const decryptedUserId = getDecryptedUser(encryptedUserId);

    const notMineConfessions = confessions.filter(conf => {
      return getDecryptedUser(conf.userId) !== decryptedUserId;
    });

    // 2- filter not reviewed by me confessions
    const reviewedByMe = reviews
      .filter(review => {
        return getDecryptedUser(review.userId) === decryptedUserId;
      })
      .map(review => review.confessionId);

    const notMineAndNotReviewedYet = notMineConfessions.filter(conf => {
      return !reviewedByMe.includes(conf._id);
    });
    // 3- shuffle
    const shuffle = arr =>
      arr.reduceRight(
        (res, _, __, arr) => (
          res.push(arr.splice(0 | (Math.random() * arr.length), 1)[0]), res
        ),
        []
      );

    setCurrentPercent(
      Math.floor(
        (1 - notMineAndNotReviewedYet.length / notMineConfessions.length) * 100
      )
    );

    const currentRanking = getSortedRanking(confessions, reviews);
    const userRankingIndex = currentRanking.findIndex(
      el => el.user === decryptedUserId
    );

    setCurrentRanking(userRankingIndex + 1);
    return shuffle(notMineAndNotReviewedYet);
  };

  // _____________ UI _____________________

  const FinishComponent = () => {
    return (
      <Card
        style={{
          marginTop: "90px",
          padding: "10px",
          width: "350px",
          background: "linear-gradient(to top, #9c27b0, orange)"
        }}
      >
        <h1 style={{ fontSize: "60px", margin: "0px", color: "blueviolet" }}>
          Wow you are amazing
        </h1>
        <h1 style={{ fontSize: "350px", margin: "0px" }}>🏅</h1>

        <img style={{ width: "360px" }} src={finishImg} />

        <h3>👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏</h3>
        <h3>👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏</h3>
        <h3>🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕</h3>
        <h3>👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏</h3>
        <h3>👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏</h3>
        <h3>🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕</h3>
        <h3>🔝🔝🔝🔝🔝🔝🔝🔝🔝🔝🔝🔝🔝🔝🔝🔝🔝🔝🔝</h3>
        <h3>👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏</h3>
        <h3>👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏</h3>
        <h3>👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏</h3>
        <h3>🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕</h3>
        <h3>👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏</h3>
        <h3>👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏</h3>
        <h3>👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏</h3>
        <h3>🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕</h3>
      </Card>
    );
  };

  const ReviewComponent = () => {
    return (
      <div>
        <Card style={{ marginTop: "90px", padding: "10px" }}>
          <div style={{ display: "flex" }}>
            <h4>Et representa el que llegeixes? ➡️ </h4>{" "}
            <Button
              style={{
                padding: "5px 12px",
                marginRight: "6px"
              }}
              onClick={handleSubmitReview}
              disabled={score === null && !isSpam}
            >
              Envia
            </Button>
          </div>

          <RowContainer>
            <input
              style={{ display: "inline" }}
              type="checkbox"
              checked={isSpam}
              onChange={e => setIsSpam(e.target.checked)}
            />
            <span style={{ marginBottom: "12px" }}>{"es Spam/Error??"}</span>
          </RowContainer>

          {!isSpam && (
            <SliderWithTooltip
              onAfterChange={handleSlider}
              defaultValue={score || 0}
              style={{ margin: "10px 0px 63px 0px" }}
              railStyle={{
                background:
                  "linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(100,100,100,1) 50%, rgba(86,255,0,1) 100%)"
              }}
              trackStyle={{ background: "none" }}
              handleStyle={{ background: "yellow" }}
              min={-100}
              max={100}
              marks={{
                "-100": {
                  style: {
                    fontSize: "16px",
                    width: "45px",
                    left: "6%"
                  },
                  label: "🙅🤯❌👎"
                },
                "0": {
                  style: {
                    fontSize: "16px"
                  },
                  label: (
                    <div>
                      <div>😐</div>
                      <div>NO M'AFECTA</div>
                    </div>
                  )
                },
                100: {
                  style: {
                    fontSize: "16px",
                    width: "45px",
                    left: "96%"
                  },
                  label: "👍🍺✅💯"
                }
              }}
            />
          )}

          <Form>
            <GradientBox>
              <TextArea readOnly value={currentConfReview.text}></TextArea>
            </GradientBox>
          </Form>
        </Card>
        <div>{`Has revisat el ${currentPercent} % 🤖`}</div>
        <div>{`Ranking: Vas en la posició numero ${currentRanking} 🏅`}</div>
      </div>
    );
  };

  if (currentPercent >= 100) {
    return <FinishComponent />;
  }

  if (error) {
    return (
      <Card>
        <Error>{error}</Error>
        <img style={{ width: "300px", margin: "20px 0px" }} src={errorImg} />
        <Button onClick={fetchData}>TORNA A PROVAR</Button>
      </Card>
    );
  }

  return (
    <div>
      <Header username="testUser" onLogout={() => handleLogout()}></Header>
      {error && <Error>{`error message: ${error} `}</Error>}

      {!currentConfReview ? (
        <MoonLoader
          css={overrideSpinner}
          sizeUnit={"px"}
          size={200}
          color={"#ffc107"}
        />
      ) : (
        <ReviewComponent />
      )}
    </div>
  );
}

export default ReviewComments;
