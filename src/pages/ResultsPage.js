import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MoonLoader from "react-spinners/MoonLoader";
import SkewLoader from "react-spinners/SkewLoader";
import Slider from "rc-slider";
import Select from "react-select";
import styled from "styled-components";
import "rc-slider/assets/index.css";
import { css } from "@emotion/core";

import finishImg from "../img/finish.jpeg";
import errorImg from "../img/error.jpeg";
import {
  Card,
  Logo,
  Form,
  Input,
  Button,
  Error,
  GradientBox
} from "../components/StyledComponents";
import Header from "../components/Header";
import {
  logout,
  getDecryptedUser,
  getEncryptedUser,
  getUsers,
  getPassword
} from "../utils/AuthHelperMethods";
import { getConfessions, getReviews, getRankedResults } from "../utils/api";

const overrideSpinner = css`
  display: block;
  margin: 90px auto;
  width: 70px;
  height: 170px;
  border-left: 200px solid #ff9800;
  border-right: 200px solid #ffc107;
  border-bottom: 200px solid #009688;
  background: linear-gradient(to bottom, #f44336, #673ab7);
`;

const TextAreaResult = styled.div`
  background: transparent;
  min-width: 360px;
  font-size: 14px;
  padding: 24px;
  box-sizing: border-box;
  font-family: "Comic Sans MS";
  white-space: pre-line;
  text-align: justify;
`;

const selectOptions = [
  { value: "byHigherScore", label: "Puntuació més alta 😎" },
  { value: "byLowerScore", label: "Puntuació més baixa 🤦" },
  { value: "byHigherAgreement", label: "Màxim acord 🤝" },
  { value: "byLessAgreement", label: "Màxim desacord 🤯" }
  //   { value: "spam", label: "Spam rellevant" }
];

const customSelectStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: "1px solid orange",
    color: state.isSelected ? "#111111" : "white",
    background: state.isSelected
      ? "linear-gradient(to right, orange, red)"
      : "#111111",
    padding: 15
  }),
  control: () => ({
    // none of react-select's styles are passed to <Control />
    width: 250,
    marginBottom: 20,
    // background: "#FFDC00",
    background: "linear-gradient(to right, orange, red)",
    borderRadius: "5px",
    border: "2px solid #9C27B0"
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = "opacity 300ms";
    return { ...provided, opacity, transition };
  }
};

const ConfessionsList = ({ confessions, results }) => {
  const createColors = () => {
    //yes I do it with mutation SO WHAT like this they don't repeat colors
    const colors = [
      "red",
      "orange",
      "#FFDC00",
      "#F012BE",
      "#39CCCC",
      "#7FDBFF",
      "#01FF70",
      "#85144b"
    ];
    const colorR = colors.splice(Math.floor(Math.random() * colors.length), 1);
    const colorL = colors.splice(Math.floor(Math.random() * colors.length), 1);
    return { colorR, colorL };
  };

  return (
    <div>
      {confessions.map(conf => {
        const { colorR, colorL } = createColors();
        const currentConf = results.confessionsById[conf.confessionId];
        return (
          <section key={currentConf._id} style={{ marginBottom: "18px" }}>
            <Form>
              <GradientBox
                colorR={colorR}
                colorL={colorL}
                style={{ flexDirection: "column" }}
              >
                <TextAreaResult>{currentConf.text}</TextAreaResult>
                <hr style={{ width: "100px" }} />
                <div style={{ fontSize: "8px", marginBottom: "6px" }}>
                  {conf.scores.join(" , ")}
                </div>
              </GradientBox>
            </Form>
          </section>
        );
      })}
    </div>
  );
};

function ResultsPage({ history }) {
  const [error, setError] = useState("hello");
  const [results, setResults] = useState(null);
  const [selectedRankingTitle, setSelectedRankingTitle] = useState(null);
  const [confessionsList, setConfessionsList] = useState([]);

  const fetchData = () => {
    try {
      console.log("fetching data...");
      //reset
      setError(null);

      getRankedResults()
        .then(results => {
          results.byLowerScore = results.byHigherScore.slice(0).reverse();
          results.byLessAgreement = results.byHigherAgreement
            .slice(0)
            .reverse();
          const {
            confessionsById,
            scoresByConfessionId,
            spamByConfessionId,
            byHigherScore,
            byHigherAgreement,
            byLowerScore,
            byLessAgreement
          } = results;
          setResults(results);

          console.log(" _______ REsults ________");
          console.log(results);
          console.log(confessionsById);
          console.log(byHigherScore);
          console.log(byLowerScore);
          console.log(byHigherAgreement);
          console.log(byLessAgreement);
        })
        .catch(() => setError("💩❓💩DA FUCK un error 💩❓💩"));
    } catch {
      setError("💩❓💩DA FUCK un error 💩❓💩");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    history.push(`/`);
  };

  const notifySucces = (message = "no message") =>
    toast(message, { type: toast.TYPE.SUCCESS });

  const notifyError = (message = "no message") =>
    toast(message, { type: toast.TYPE.ERROR });

  const handleSelectChange = selectedItem => {
    console.log("inputValue=" + selectedItem.value);
    setSelectedRankingTitle(selectedItem.label);
    setConfessionsList(results[selectedItem.value]);
  };

  if (!results) {
    return (
      <div
        style={{
          background: "linear-gradient(to bottom, #f44336, #673ab7)",
          height: "370px",
          filter: "blur(10px)",
          transitionDuration: "2s"
        }}
      >
        <SkewLoader
          css={overrideSpinner}
          sizeUnit={"px"}
          size={200}
          color={"#F012BE"}
        />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <Error>{error}</Error>
        <img style={{ width: "300px", margin: "20px 0px" }} src={errorImg} />
        <Button onClick={fetchData}>TORNA A PROVAR</Button>
      </Card>
    );
  }

  return (
    <div>
      <Header
        username="testUser"
        onLogout={() => handleLogout()}
        onClickInfo={() => {
          history.push("/gracies");
        }}
      ></Header>
      {error && <Error>{`error message: ${error} `}</Error>}

      <Card style={{ marginTop: "90px" }}>
        <h3>{selectedRankingTitle || "🏆 Selecciona criteri de ranking 🏆"}</h3>
        <Select
          style={{ margin: "20px" }}
          inputProps={{ readOnly: true }}
          isSearchable={false}
          label="Selecciona criteri:"
          options={selectOptions}
          styles={customSelectStyles}
          onChange={handleSelectChange}
        />
        <ConfessionsList confessions={confessionsList} results={results} />
      </Card>
    </div>
  );
}

export default ResultsPage;
