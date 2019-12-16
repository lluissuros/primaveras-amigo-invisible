import React, { useState } from "react";
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

function CreateComments({ history }) {
  const [confession, setConfession] = useState("");

  const handleLogout = () => {
    logout();
    history.push(`/`);
  };

  const handleSubmit = e => {
    console.log(e);
    e.preventDefault();
    console.log("handleSubmit", confession);
    setConfession("");
  };

  return (
    <div>
      <button onClick={() => handleLogout()}>logout</button>
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
    </div>
  );
}

export default CreateComments;
