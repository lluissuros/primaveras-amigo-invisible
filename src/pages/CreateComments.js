import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import AuthForm from "../components/AuthForm";
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

function CreateComments({ history }) {
  const [error, setError] = useState(null);
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

  const handleSubmit = e => {
    e.preventDefault();
    createConfession(confession)
      .then(createdConfession => {
        console.log(createdConfession);
        getConfessions()
          .then(responseData => setConfessions(responseData))
          .catch(e => setError(e.message));
      })
      .catch(e => setError(e.message));
    setConfession("");
  };

  return (
    <div>
      <button onClick={() => handleLogout()}>logout</button>
      {error && <Error>{`error message: ${error} `}</Error>}
      <Card>
        <div>Testing database: post something, and get it from db</div>
        <form>
          <textarea
            placeholder="your text"
            value={confession}
            onChange={e => {
              setConfession(e.target.value);
            }}
          ></textarea>
          <button onClick={handleSubmit}>submit</button>
        </form>
      </Card>
      <div>{JSON.stringify(confessions)}</div>
    </div>
  );
}

export default CreateComments;
