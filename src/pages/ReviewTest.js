import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MoonLoader from "react-spinners/MoonLoader";
import { css } from "@emotion/core";
import styled from "styled-components";

import {
  Card,
  Logo,
  Form,
  Input,
  Button,
  ActionButton,
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
import { getConfessions, createConfession } from "../utils/api";

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

const HeaderPlaceholder = styled.div`
  height: 65px;
`;

function ReviewTest({ history }) {
  const [error, setError] = useState(null);
  const [counter, setCounter] = useState(0);
  const [isFetching, setIsFetching] = useState(true);
  const [confessions, setConfessions] = useState([]);

  useEffect(() => {
    getConfessions()
      .then(responseData => setConfessions(responseData))
      .catch(e => setError(e.message))
      .then(() => setIsFetching(false));
  }, []);

  const handleLogout = () => {
    logout();
    history.push(`/`);
  };

  const notifySucces = (message = "no message") =>
    toast(message, { type: toast.TYPE.SUCCESS });

  const notifyError = (message = "no message") =>
    toast(message, { type: toast.TYPE.ERROR });

  const sendWelcomeEmailToAll = () => {
    const users = getUsers().filter(el => el.includes("@"));
    // console.log(users);

    const currentUser = users[counter];
    sendWelcomeEmail(currentUser, getPassword(currentUser));

    setCounter(counter + 1);
  };

  const sendWelcomeEmail = (username, password) => {
    const template_params = {
      to_email: username,
      reply_to: "lluissuros@gmail.com",
      from_name: "Comisión de eventus Primaveras",
      link_to_app: "https://primappveras.lluissuros.now.sh/",
      username: username,
      password: password
    };
    const service_id = "default_service";
    const template_id = "template_tC1XVGKb";
    window.emailjs.send(service_id, template_id, template_params);
    console.log(`email sent to ${username}`);
  };

  const PostByUserList = () => {
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
        <PostByUserList />
      )}
      <ActionButton
        onClick={() => {
          sendWelcomeEmailToAll();
        }}
      >
        HERE TEST EMAIL CLICK
      </ActionButton>
    </div>
  );
}

export default ReviewTest;
