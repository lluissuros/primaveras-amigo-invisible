import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MoonLoader from "react-spinners/MoonLoader";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

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
  createReview
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

function ReviewComments({ history }) {
  const [error, setError] = useState(null);
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

    console.log(validConfessions);
  };

  const fetchData = () => {
    console.log("fetching data...");
    let fetchedConfessions = [];
    let fetchedReviews = [];
    //reset
    setCurrentConfReview(null);
    setIsSpam(false);
    setScore(null);

    getConfessions()
      .then(responseData => {
        fetchedConfessions = responseData;
      })
      .catch(e => setError(e.message))
      .then(() => {
        chooseCurrentReviewIfReady(fetchedConfessions, fetchedReviews);
      });

    // get reviews
    getReviews()
      .then(responseData => {
        fetchedReviews = responseData;
      })
      .catch(e => setError(e.message))
      .then(() => {
        chooseCurrentReviewIfReady(fetchedConfessions, fetchedReviews);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    history.push(`/`);
  };

  const handleSlider = val => {
    console.log(val);
    setScore(val);
  };

  const handleSubmitReview = () => {
    console.log("posting Review...");
    createReview(currentConfReview._id, score, isSpam)
      .then(createdReview => {
        notifySucces(
          `review guardat, merci! score: ${JSON.stringify(createdReview.score)}`
        );
        console.log(createdReview);
        fetchData();
      })
      .catch(e => notifyError(e.message));
  };

  const notifySucces = (message = "no message") =>
    toast(message, { type: toast.TYPE.SUCCESS });

  const notifyError = (message = "no message") =>
    toast(message, { type: toast.TYPE.ERROR });

  const getValidConfessions = (confessions, reviews) => {
    console.log(reviews);
    console.log(confessions);

    // 1- filter not mine confessions
    const encryptedUserId = getEncryptedUser();
    const decryptedUserId = getDecryptedUser(encryptedUserId);
    console.log(encryptedUserId);
    console.log(decryptedUserId);
    const notMineConfessions = confessions.filter(conf => {
      return getDecryptedUser(conf.userId) !== decryptedUserId;
    });

    console.log(notMineConfessions);
    // 2- filter not reviewed by me confessions
    const reviewedByMe = reviews
      .filter(review => {
        return getDecryptedUser(review.userId) === decryptedUserId;
      })
      .map(review => review.confessionId);
    console.log(reviewedByMe);

    const notMineAndNotReviewedYet = notMineConfessions.filter(conf => {
      return !reviewedByMe.includes(conf._id);
    });
    console.log(notMineAndNotReviewedYet);
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
    setCurrentRanking();
    return shuffle(notMineAndNotReviewedYet);
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
              <TextArea readOnly value={"TODO TEXT HERE"}></TextArea>
            </GradientBox>
          </Form>
        </Card>
        {`Has revisat el ${currentPercent} % 🤖`}
        {`Ranking: TODO 👾`}
      </div>
    );
  };

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
