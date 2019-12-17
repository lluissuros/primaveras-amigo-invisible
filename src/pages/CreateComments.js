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
  min-height: 185px;
  min-width: 300px;
  font-size: 14px;
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
    return confession.split(" ").length > 5;
  };

  const notifySucces = (message = "no message") =>
    toast(message, { type: toast.TYPE.SUCCESS });

  const notifyError = (message = "no message") =>
    toast(message, { type: toast.TYPE.ERROR });

  const handleSubmit = e => {
    e.preventDefault();
    if (!isValidText()) {
      notifyError("minim 5 paraules");
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

  return (
    <div>
      <Header username="testUser" onLogout={() => handleLogout()}></Header>
      {error && <Error>{`error message: ${error} `}</Error>}
      <Card>
        <h4>Escriu el que penses</h4>
        <Form style={{ height: "300px", justifyContent: "space-around" }}>
          <GradientBox>
            <TextArea
              placeholder="your text"
              value={confession}
              onChange={e => {
                setConfession(e.target.value);
              }}
            ></TextArea>
          </GradientBox>

          <Button onClick={handleSubmit} disabled={isButtonDisabled}>
            {isFetching ? "loading" : "submit"}
          </Button>
        </Form>
      </Card>
      {/* <div>{JSON.stringify(confessions)}</div> */}
    </div>
  );
}

export default CreateComments;
