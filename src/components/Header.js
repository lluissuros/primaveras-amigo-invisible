import React from "react";
import styled from "styled-components";
import { SmallButton } from "./StyledComponents";

const Container = styled.header`
  margin: 12px 24px;
  display: flex;
  justify-content: space-between;
`;

const Header = ({ username, onLogout }) => {
  return username ? (
    <React.Fragment>
      <Container>
        <h1 style={{ margin: "0px" }}>{`Welcome, ${username}`}</h1>
        <SmallButton onClick={() => onLogout()}>LOGOUT</SmallButton>
      </Container>
      <div>
        <hr />
      </div>
    </React.Fragment>
  ) : null;
};

export default Header;
