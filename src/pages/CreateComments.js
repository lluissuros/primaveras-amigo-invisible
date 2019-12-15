import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { Card } from "../components/StyledComponents";
import { logout } from "../utils/AuthHelperMethods";

function CreateComments({ history }) {
  const handleLogout = () => {
    logout();
    history.push(`/`);
  };

  return (
    <div>
      <button onClick={() => handleLogout()}>logout</button>
      <Card>
        <div>Testing database</div>
      </Card>
    </div>
  );
}

export default CreateComments;
