import React from "react";
import styled from "styled-components";

// get our fontawesome imports
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FormRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: left;
`;

const SearchInput = ({ searchValue, onInputChange }) => {
  return (
    <div>
      <FormRow>
        <label htmlFor="search">
          <FontAwesomeIcon icon={faSearch} style={{ marginRight: "6px" }} />
        </label>

        <input
          style={{ outline: "none" }}
          type="text"
          name="search"
          placeholder="by contains"
          value={searchValue}
          onChange={e => onInputChange(e.target.value)}
        />
      </FormRow>
    </div>
  );
};

export default SearchInput;
