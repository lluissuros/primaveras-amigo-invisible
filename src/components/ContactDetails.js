import React, { useState, useEffect } from "react";
import styled from "styled-components";

import SearchInput from "./SearchInput";
import Paginator from "./Paginator";
import { paginate } from "../utils/helpers";

const PAGE_SIZE = 20;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
`;

const Avatar = styled.img`
  height: 48px;
  border-radius: 50%;
`;

const ConnectionAvatar = styled.img`
  background-color: red;
  height: 70%;
  border-radius: 50%;
`;

const Name = styled.span`
  font-size: 36px;
  margin-left: 12px;
  vertical-align: top;
`;

const FlexSpaceBetweenContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 520px;
`;

const ConnectionsListContainer = styled.ul`
  padding: 0px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  font-size: 12px;
  font-weight: 300;
  text-align: center;
  height: 370px;
`;

const ConnectionCardItem = styled.li`
  display: flex;
  flex-direction: column;
  padding: 6px;
  justify-content: space-between;
  width: 15%;
  min-width: 70px;
  max-width: 85px;
  height: 80px;
  list-style-type: none;
  display: flex;
  align-items: center;
  margin: 6px;
  border-radius: 3px;
  border: solid 1px #ff980073;
  background-color: #ffeb3b45;
`;

const ContactTitle = ({ contact }) => (
  <div>
    <Avatar src={contact.avatar} />
    <Name>{contact.name}</Name>
  </div>
);

const ContactDetails = ({ contact, connections }) => {
  const [browserPage, setBrowserPage] = useState(0);
  const [filteredConnections, setFilteredConnections] = useState(connections);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setFilteredConnections(connections);
    setSearchValue("");
  }, [connections]);

  const handleSearch = searchValue => {
    setBrowserPage(0);
    setSearchValue(searchValue);
    if (searchValue === "") {
      setFilteredConnections(connections);
      return;
    }
    const alphabeticallyBySearch = connections
      .filter(contact =>
        contact.name.toLowerCase().includes(searchValue.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
    setFilteredConnections(alphabeticallyBySearch);
  };

  const handlePaginator = direction => {
    if (direction === "forward") {
      const maxPage = Math.floor(filteredConnections.length / PAGE_SIZE);
      setBrowserPage(Math.min(browserPage + 1, maxPage));
    } else {
      setBrowserPage(Math.max(browserPage - 1, 0));
    }
  };

  return (
    <FlexSpaceBetweenContainer>
      <Header>
        <div style={{ minWidth: "300px" }}>
          {contact && <ContactTitle contact={contact} />}
        </div>
        <SearchInput searchValue={searchValue} onInputChange={handleSearch} />
      </Header>

      <div>
        <hr />
      </div>

      <section style={{ overflowY: "scroll" }}>
        <ConnectionsListContainer>
          {filteredConnections &&
            paginate(filteredConnections, browserPage, PAGE_SIZE).map(
              connection => (
                <ConnectionCardItem key={connection.id}>
                  <ConnectionAvatar src={connection.avatar}></ConnectionAvatar>
                  <div>{connection.name}</div>
                </ConnectionCardItem>
              )
            )}
        </ConnectionsListContainer>
      </section>

      <footer>
        <div>
          <hr />
        </div>
        <Paginator
          currentPage={browserPage + 1}
          totalPages={Math.ceil(filteredConnections.length / PAGE_SIZE)}
          onForward={() => handlePaginator("forward")}
          onBackWards={() => handlePaginator("backwards")}
        />
      </footer>
    </FlexSpaceBetweenContainer>
  );
};

export default ContactDetails;
