import React, { useState } from "react";
import styled from "styled-components";
import Paginator from "./Paginator";
import SearchInput from "./SearchInput";
import LettersList from "./LettersList";
import { paginate } from "../utils/helpers";

const PAGE_SIZE = 50;

const FlexContainer = styled.section`
  padding-top: 10px;
  box-sizing: border-box;
  display: flex;
  height: 500px;
  flex-direction: row;
  width: 100%;
`;

const FlexSpaceBetweenContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ContactLink = styled.div`
  :hover {
    cursor: pointer;
    background-color: #ffeb3b7d;
    font-weight: 700;
  }
  :focus {
    outline: none;
  }
`;

const ScrollContainer = styled.div`
  height: 470px;
  overflow-y: scroll;
`;

const ContactsBrowser = ({ contacts, onSelectedContact }) => {
  const [browserPage, setBrowserPage] = useState(0);
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = searchValue => {
    setBrowserPage(0);
    setSearchValue(searchValue);
    const alphabeticallyBySearch = contacts
      .filter(contact =>
        contact.name.toLowerCase().includes(searchValue.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
    setFilteredContacts(alphabeticallyBySearch);
  };

  const handleLetterClick = letter => {
    setBrowserPage(0);
    const alphabeticallyByLetter = contacts
      .filter(contact =>
        contact.name.toLowerCase().startsWith(letter.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
    setFilteredContacts(alphabeticallyByLetter);
  };

  const handlePaginator = direction => {
    if (direction === "forward") {
      const maxPage = Math.floor(filteredContacts.length / PAGE_SIZE);
      setBrowserPage(Math.min(browserPage + 1, maxPage));
    } else {
      setBrowserPage(Math.max(browserPage - 1, 0));
    }
  };

  return (
    <React.Fragment>
      <SearchInput
        style={{ marginBottom: "11px" }}
        searchValue={searchValue}
        onInputChange={handleSearch}
      ></SearchInput>

      <FlexContainer>
        <LettersList onLetterClick={handleLetterClick} />
        <FlexSpaceBetweenContainer>
          <ScrollContainer>
            {paginate(filteredContacts, browserPage, PAGE_SIZE).map(contact => (
              <ContactLink
                key={contact.id}
                onClick={() => onSelectedContact(contact)}
              >
                {contact.name}
              </ContactLink>
            ))}
          </ScrollContainer>

          <div>
            <hr />
          </div>

          <Paginator
            currentPage={browserPage + 1}
            totalPages={Math.ceil(filteredContacts.length / PAGE_SIZE)}
            onForward={() => handlePaginator("forward")}
            onBackWards={() => handlePaginator("backwards")}
          />
        </FlexSpaceBetweenContainer>
      </FlexContainer>
    </React.Fragment>
  );
};

export default ContactsBrowser;
