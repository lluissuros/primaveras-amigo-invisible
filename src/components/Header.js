import React from "react";
import styled from "styled-components";
import { AlternativeButton } from "./StyledComponents";

const HeaderToTop = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 12px 0px;
  z-index: 1;
  background: ${props => props.theme.black};
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Header = ({ username, onLogout, onClickInfo }) => {
  return (
    <React.Fragment>
      <HeaderToTop>
        <FlexContainer>
          <div
            onClick={onClickInfo}
            style={{ fontSize: "29px", marginLeft: "1rem" }}
          >
            💅
          </div>
          <div style={{ display: "flex" }}>
            <span style={{ fontSize: "10px" }}>🔥💙❤️🧡</span>
            <h1 style={{ margin: "0px 12px" }}>{` Fase3 `}</h1>
            <span style={{ fontSize: "10px" }}>💛💚💜🌶️</span>
          </div>

          <div style={{ minWidth: "76px" }}>
            <AlternativeButton
              style={{ marginRight: "1rem" }}
              onClick={() => onLogout()}
            >
              log out
            </AlternativeButton>
          </div>
        </FlexContainer>

        <div>
          <hr />
        </div>
      </HeaderToTop>
    </React.Fragment>
  );
};

export default Header;
