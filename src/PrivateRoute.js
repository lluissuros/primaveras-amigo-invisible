import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isLoggedIn, logout } from "./utils/AuthHelperMethods";

function PrivateRoute({ component: Component, ...rest }) {
  const isLogged = () => {
    try {
      return isLoggedIn();
    } catch (err) {
      /* Looks like there's an error so we'll print it out and log the user out for security reasons. */
      console.log("logging out because of error", err);
      logout();
      return false;
    }
  };

  return (
    <Route
      {...rest}
      render={props =>
        isLogged() ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

export default PrivateRoute;
