import React from "react";
import styled from "styled-components";
import { AlternativeButton } from "./StyledComponents";

const HeaderToTop = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  margin: 12px 0px;
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Header = ({ username, onLogout }) => {
  return (
    <React.Fragment>
      <HeaderToTop>
        <FlexContainer>
          <h1 style={{ margin: "0px 12px" }}>{`Holi ${username}`}</h1>
          <div>
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
