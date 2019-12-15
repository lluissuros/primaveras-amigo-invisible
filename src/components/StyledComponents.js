import styled from "styled-components";

const Card = styled.div`
  box-sizing: border-box;
  max-width: 410px;
  margin: 24px auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Input = styled.input`
  padding: 1rem;
  border: 1px solid #999;
  margin-bottom: 1rem;
  font-size: 0.8rem;
`;

const Button = styled.button`
  background: linear-gradient(to bottom, #6371c7, #5563c1);
  border-color: #3f4eae;
  border-radius: 3px;
  padding: 1rem;
  color: white;
  font-weight: 700;
  width: 100%;
  margin-bottom: 1rem;
  font-size: 0.8rem;
`;

const SmallButton = styled.button`
  background: linear-gradient(to bottom, #ff9800, #ffc1074a);
  border-color: none;
  border-radius: 3px;
  height: 18px;
  color: black;
  font-weight: 700;
  font-size: 0.8rem;
  border: none;
  :hover {
    cursor: pointer;
    background-color: #ff5722;
  }
  :focus {
    outline: none;
  }
`;

const Logo = styled.img`
  height: 150px;
  width: 150px;
  margin-bottom: 1rem;
  border-radius: 6px;
`;

const Error = styled.div`
  background-color: #ff5722;
  margin-top: 12px;
  padding: 12px;
  border-radius: 4px;
`;

export { Form, Input, Button, SmallButton, Logo, Card, Error };
