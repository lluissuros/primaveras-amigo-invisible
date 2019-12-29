import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, createGlobalStyle } from "styled-components";

import PrivateRoute from "./PrivateRoute";
import Login from "./pages/Login";
import CreateComments from "./pages/CreateComments";
import ReviewTest from "./pages/ReviewTest";
import ReviewComments from "./pages/ReviewComments";
import ResultsPage from "./pages/ResultsPage";
import InfoPage from "./pages/InfoPage";

toast.configure();
console.log("toast configured");

const theme = {
  //colors from https://clrs.cc/
  black: "#111111",
  silver: "#DDDDDD",
  darkBackgroundColor: "#39CCCC",
  mediumBackgroundColor: "#39cccc61",
  colorfulColor: "#f44336b8",
  colorfulDarkerColor: "#ffc107",
  whiteBackgroundColor: "#FFFFFF",
  borderColor: "#85144b",
  darkFontColor: "#111111",
  lightFontColor: "#AAAAAA",
  actionColor: "#39CCCC",
  errorColor: "#FF4136"
};

const GlobalStyle = createGlobalStyle`
    html {
        // height: 100%;
        background: ${props => props.theme.black};
        display: flex;
    }
    
    body {
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen-Sans,
        Ubuntu, Cantarell, Helvetica Neue, sans-serif;
      margin: auto;
      text-align: center;
      transition: background-color 1s;
      color: ${props => props.theme.silver}
    
    }

    textarea {
         border: none; 
         outline:none;
         resize: none;
         color: ${props => props.theme.silver}
    }

      hr {
        border-top: 1px solid #ffc107;
      }
    
    h4 {
      margin: 3px;
    }
  
    ul {
      margin: 0px;
      padding: 0px;
      display: flex;
      flex-direction: column;
      list-style-type: none;
      list-style: none;
    }
  `;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <React.Fragment>
        <Router>
          <div>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/info" component={InfoPage} />
              <PrivateRoute
                path="/createcommments_venga_va"
                component={CreateComments}
              />
              <PrivateRoute path="/review" component={ReviewComments} />
              <PrivateRoute path="/results" component={ResultsPage} />
              <Route path="/test" component={ReviewTest}></Route>
              <Route component={Login} />
            </Switch>
          </div>
        </Router>
      </React.Fragment>
    </ThemeProvider>
  );
}

export default App;
