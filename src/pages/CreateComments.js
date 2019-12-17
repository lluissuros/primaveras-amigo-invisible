import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";

import {
  Card,
  Logo,
  Form,
  Input,
  Button,
  Error
} from "../components/StyledComponents";

import { logout } from "../utils/AuthHelperMethods";
import { getConfessions, createConfession } from "../utils/api";

const TextArea = styled.textarea`
  border: 2px solid lightgrey;
  border-radius: 3px;
  min-height: 120px;
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

  return (
    <div>
      <button onClick={() => handleLogout()}>logout</button>
      {error && <Error>{`error message: ${error} `}</Error>}
      <Card>
        <div>Escriu el que pensess</div>
        <Form style={{ height: "300px", justifyContent: "space-around" }}>
          <TextArea
            placeholder="your text"
            value={confession}
            onChange={e => {
              setConfession(e.target.value);
            }}
          ></TextArea>
          <Button onClick={handleSubmit} disabled={isFetching}>
            {isFetching ? "loading" : "submit"}
          </Button>
        </Form>
      </Card>
      <div>{JSON.stringify(confessions)}</div>
    </div>
  );
}

export default CreateComments;
