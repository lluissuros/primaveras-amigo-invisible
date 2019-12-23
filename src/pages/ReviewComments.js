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
  const [confessions, setConfessions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isSpam, setIsSpam] = useState(false);
  const [score, setScore] = useState(null);

  const SliderWithTooltip = Slider.createSliderWithTooltip(Slider);

  const fetchData = () => {
    console.log("fetching data...");
    setConfessions([]);
    setReviews([]);
    setIsFetching(true);
    let fetchedConfessions = false;
    let fetchedReviews = false;

    getConfessions()
      .then(responseData => {
        setConfessions(responseData);
        fetchedConfessions = true;
      })
      .catch(e => setError(e.message))
      .then(() => {
        setIsFetching(!fetchedConfessions || !fetchedReviews);
      });

    // get reviews

    getReviews()
      .then(responseData => {
        setReviews(responseData);
        fetchedReviews = true;
      })
      .catch(e => setError(e.message))
      .then(() => {
        setIsFetching(!fetchedConfessions || !fetchedReviews);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    history.push(`/`);
  };

  const handleSubmitReview = () => {
    console.log("handleSubmitReview");
    // 1- create review object (encode username)
    // 2- post review
    // 3- notify toast, and load again confessions
    // isFecthing true, confessions and reviews = []
    // 4 - fetch Data
  };

  const notifySucces = (message = "no message") =>
    toast(message, { type: toast.TYPE.SUCCESS });

  const notifyError = (message = "no message") =>
    toast(message, { type: toast.TYPE.ERROR });

  const getValidConfessions = () => {
    // 1- filter not mine confessions
    // 2- filter not reviewed by me confessions
    // 3- scramble
    console.log(reviews);
    console.log(confessions);
  };

  const PostByUserList = () => {
    //TODO DELETE
    const usersObject = getUsers().reduce((acc, user) => {
      acc[user] = 0;
      return acc;
    }, {});
    const postsByUser = confessions.reduce((acc, confession) => {
      const userReal = getDecryptedUser(confession.userId);
      acc[userReal] = acc[userReal] + 1;
      return acc;
    }, usersObject);

    return (
      <div style={{ margin: "100px 0px", textAlign: "left" }}>
        {Object.entries(postsByUser).map(pair => (
          <div key={pair[0]}>{`${pair[1]} comments by user ${pair[0]}`}</div>
        ))}
      </div>
    );
  };

  const ReviewComponent = () => {
    console.log(getValidConfessions());

    const mockConfession = confessions[0];

    //1 - get valid confessions for the current user
    //2 - render confession (confession, checbox, slider)

    return (
      <div>
        <Card style={{ marginTop: "90px " }}>
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

          <SliderWithTooltip
            style={{ margin: "10px 0px 63px 0px" }}
            railStyle={{
              background:
                "linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(100,100,100,1) 50%, rgba(86,255,0,1) 100%)"
            }}
            trackStyle={{ background: "none" }}
            min={-100}
            max={100}
            marks={{
              "-100": {
                style: {
                  fontSize: "16px"
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
                  fontSize: "16px"
                },
                label: "👍🍺✅💯"
              }
            }}
          />

          <Form>
            <GradientBox>
              <TextArea readOnly value={mockConfession}></TextArea>
            </GradientBox>
          </Form>
        </Card>
      </div>
    );
  };

  return (
    <div>
      <Header username="testUser" onLogout={() => handleLogout()}></Header>
      {error && <Error>{`error message: ${error} `}</Error>}

      {isFetching ? (
        <MoonLoader
          css={overrideSpinner}
          sizeUnit={"px"}
          size={200}
          color={"#ffc107"}
          loading={isFetching}
        />
      ) : (
        <ReviewComponent />
      )}
    </div>
  );
}

export default ReviewComments;
