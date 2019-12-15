import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { Card } from "../components/StyledComponents";
import { isLoggedIn, storeCredentials } from "../utils/AuthHelperMethods";

function Login() {
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (userName, password, rememberMe) => {
    debugger;
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
      <AuthForm error={error} onConfirm={handleLogin} btnMessage="Log in" />
    </Card>
  );
}

export default Login;
