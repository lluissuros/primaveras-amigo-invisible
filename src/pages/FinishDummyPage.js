import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MoonLoader from "react-spinners/MoonLoader";
import SkewLoader from "react-spinners/SkewLoader";
import Slider from "rc-slider";
import Select from "react-select";
import styled from "styled-components";
import "rc-slider/assets/index.css";
import { css } from "@emotion/core";

import finishImg from "../img/finish.jpeg";
import errorImg from "../img/error.jpeg";
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
  width: 70px;
  height: 170px;
  border-left: 200px solid #ff9800;
  border-right: 200px solid #ffc107;
  border-bottom: 200px solid #009688;
  background: linear-gradient(to bottom, #f44336, #673ab7);
`;

const TextArea = styled.div`
  background: transparent;
  font-size: 16px;
  padding: 12px;
  box-sizing: border-box;
`;

const GraciesComponent = ({ blurValue = 0 }) => {
  return (
    <Form style={{ marginTop: "100px", filter: `blur(${blurValue}px)` }}>
      <GradientBox style={{ width: "100px", textAlign: "center" }}>
        <TextArea>GRACIES</TextArea>
      </GradientBox>
    </Form>
  );
};

const blurValues = (length = 100, step = 0.1) => {
  var values = [];
  for (var i = 0; i < length; i++) {
    values.push(i * step);
  }
  return values;
};

function FinishDummyPage({ history }) {
  return (
    <React.Fragment>
      <div
        style={{
          background: "linear-gradient(to bottom, #f44336, #673ab7)",
          height: "370px",
          filter: "blur(10px)",
          transitionDuration: "2s"
        }}
      >
        <SkewLoader
          css={overrideSpinner}
          sizeUnit={"px"}
          size={200}
          color={"#F012BE"}
        />
      </div>

      {blurValues(200).map(blurValue => (
        <GraciesComponent blurValue={blurValue} />
      ))}

      <div>🥇ets una champion🥇</div>
    </React.Fragment>
  );
}

export default FinishDummyPage;
