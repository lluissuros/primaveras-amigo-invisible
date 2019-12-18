import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import Header from "../components/Header";

import {
  Card,
  Logo,
  Form,
  Input,
  Button,
  Error,
  GradientBox
} from "../components/StyledComponents";

import { logout } from "../utils/AuthHelperMethods";
import { getConfessions, createConfession } from "../utils/api";

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

function CreateComments({ history }) {
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [confession, setConfession] = useState("");
  const [confessions, setConfessions] = useState([]);

  useEffect(() => {
    getConfessions()
      .then(responseData => setConfessions(responseData))
      .catch(e => setError(e.message));
  }, []);

  const handleLogout = () => {
    logout();
    history.push(`/`);
  };

  const isValidText = () => {
    return confession.length > 5;
  };

  const notifySucces = (message = "no message") =>
    toast(message, { type: toast.TYPE.SUCCESS });

  const notifyError = (message = "no message") =>
    toast(message, { type: toast.TYPE.ERROR });

  const handleSubmit = e => {
    e.preventDefault();
    if (!isValidText()) {
      notifyError("minim 5 caracters");
      return;
    }
    setIsFetching(true);
    createConfession(confession)
      .then(createdConfession => {
        notifySucces(createdConfession.text);
        console.log(createdConfession);
        getConfessions()
          .then(responseData => setConfessions(responseData))
          .then(() => setConfession(""))
          .catch(e => notifyError(e.message))
          .then(() => setIsFetching(false));
      })
      .catch(e => notifyError(e.message))
      .then(() => setIsFetching(false));
  };

  const isButtonDisabled = isFetching || !isValidText();

  const butttonText = () => {
    if (isFetching) {
      return "...enviant 🚀";
    }
    if (isValidText()) {
      return "👌 Comparteix-ho";
    }
    return "✍️ Comparteix-ho";
  };

  return (
    <div>
      <Header username="testUser" onLogout={() => handleLogout()}></Header>
      {/* <HeaderPlaceholder></HeaderPlaceholder> */}
      {error && <Error>{`error message: ${error} `}</Error>}
      <Card style={{ margin: "90px auto" }}>
        <div style={{ display: "flex" }}>
          <h4>Escriu el que penses i ➡️➡️➡️ </h4>{" "}
          <Button
            style={{
              padding: "5px 12px",
              marginRight: "6px"
            }}
            onClick={handleSubmit}
            disabled={isButtonDisabled}
          >
            {butttonText()}
          </Button>
        </div>
        {/* <Form style={{ height: "300px", justifyContent: "space-around" }}> */}
        <Form>
          <GradientBox>
            <TextArea
              placeholder="your text"
              value={confession}
              onChange={e => {
                setConfession(e.target.value);
              }}
            ></TextArea>
          </GradientBox>
        </Form>
      </Card>
      {/* <div>{JSON.stringify(confessions)}</div> */}
    </div>
  );
}

export default CreateComments;
