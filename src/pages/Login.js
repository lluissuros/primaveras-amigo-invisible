import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { Card, GradientBox } from "../components/StyledComponents";
import { isLoggedIn, storeCredentials } from "../utils/AuthHelperMethods";

function Login({ history }) {
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (userName, password, rememberMe) => {
    try {
      storeCredentials(userName, password, rememberMe);
      setError(null);
      setLoggedIn(true);
    } catch (e) {
      setError(e.message);
    }
  };

  try {
    if (loggedIn || isLoggedIn()) {
      return <Redirect to="/createcommments" />;
    }
  } catch (e) {}

  return (
    <Card>
      <GradientBox>
        <div
          onClick={() => history.push("/info")}
          style={{ fontSize: "48px", height: "55px", width: "54px" }}
        >
          ℹ️
        </div>
      </GradientBox>
      <AuthForm error={error} onConfirm={handleLogin} btnMessage="Log in" />
    </Card>
  );
}

export default Login;
