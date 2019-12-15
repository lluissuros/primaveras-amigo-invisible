import React, { useState } from "react";
import logoImg from "../img/logo_goldenspear.jpg";
import {
  Card,
  Logo,
  Form,
  Input,
  Button,
  Error
} from "../components/StyledComponents";
import styled from "styled-components";

const LogoContainer = styled.div`
  height: 175px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  justify-content: left;
  margin: 3px;
`;

function AuthForm({ error, onConfirm, btnMessage }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleConfirm = () => {
    onConfirm(userName, password, rememberMe);
  };

  return (
    <Card style={{ width: "300px" }}>
      <LogoContainer>
        <Logo src={logoImg} />
      </LogoContainer>
      <Form>
        <Input
          type="username"
          value={userName}
          onChange={e => {
            setUserName(e.target.value);
          }}
          placeholder="username"
        />
        <Input
          type="password"
          value={password}
          onChange={e => {
            setPassword(e.target.value);
          }}
          placeholder="password"
        />

        <RowContainer>
          <input
            style={{ display: "inline" }}
            type="checkbox"
            checked={rememberMe}
            onChange={e => setRememberMe(e.target.checked)}
          />
          <span>{"Remember me"}</span>
        </RowContainer>

        <Button onClick={handleConfirm}>{btnMessage}</Button>
      </Form>
      {error && <Error>{`error message: ${error} `}</Error>}
    </Card>
  );
}

export default AuthForm;
