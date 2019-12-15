import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import PrivateRoute from "./PrivateRoute";
import Login from "./pages/Login";
import CreateComments from "./pages/CreateComments";
import { setToken, logout, getConfirm } from "./utils/AuthHelperMethods";

function App() {
  return (
    <React.Fragment>
      <Router>
        <div>
          <Switch>
            {/* <Route path="/createcommments" component={CreateComments} /> */}
            <Route path="/login" component={Login} />

            <PrivateRoute path="/createcommments" component={CreateComments} />
            <Route component={Login} />
          </Switch>
        </div>
      </Router>
    </React.Fragment>
  );
}

export default App;
