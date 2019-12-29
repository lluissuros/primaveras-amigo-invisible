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
import { getConfessions, getReviews, getRankedResults } from "../utils/api";

const overrideSpinner = css`
  display: block;
  margin: 90px auto;
  border-color: red;
`;

const TextArea = styled.textarea`
  background: transparent;
  min-height: 190px;
  min-width: 300px;
  font-size: 14px;
  padding: 12px;
  box-sizing: border-box;
`;

function ResultsPage({ history }) {
  const [error, setError] = useState("hello");

  const fetchData = () => {
    try {
      console.log("fetching data...");
      getRankedResults().then(results => {
        const {
          scoresByConfessionId,
          spamByConfessionId,
          byHigherScore,
          byHigherAgreement
        } = results;
        const byLowerScore = byHigherScore.slice(0).reverse();
        const byLessAgreement = byHigherAgreement.slice(0).reverse();

        console.log("results");
        console.log(results);
        console.log(byHigherScore);
        console.log(byLowerScore);
        console.log(byHigherAgreement);
        console.log(byLessAgreement);
      });
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

  const notifySucces = (message = "no message") =>
    toast(message, { type: toast.TYPE.SUCCESS });

  const notifyError = (message = "no message") =>
    toast(message, { type: toast.TYPE.ERROR });

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

      <MoonLoader
        css={overrideSpinner}
        sizeUnit={"px"}
        size={200}
        color={"#ffc107"}
      />
    </div>
  );
}

export default ResultsPage;
