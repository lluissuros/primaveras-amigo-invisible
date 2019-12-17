import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import PrivateRoute from "./PrivateRoute";
import Login from "./pages/Login";
import CreateComments from "./pages/CreateComments";
import { setToken, logout, getConfirm } from "./utils/AuthHelperMethods";
import CryptoJS from "crypto-js";

toast.configure();
console.log("toast configured");

function App() {
  return (
    <React.Fragment>
      <Router>
        <div>
          <Switch>
            {/* <Route path="/createcommments" component={CreateComments} /> */}
            <Route path="/login" component={Login} />

            {/* <PrivateRoute path="/createcommments" component={CreateComments} /> */}
            <PrivateRoute path="/createcommments" component={CreateComments} />
            <Route component={Login} />
          </Switch>
        </div>
      </Router>
    </React.Fragment>
  );
}

export default App;
