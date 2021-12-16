import React from "react";
import styled from "styled-components";
import BirthWheel from "./BirthWheel";
import { CurrentUserContext } from "./UserContext";

const SignIn = () => {
  const { currentUser, setCurrentUser } = React.useContext(CurrentUserContext);
  const [error, setError] = React.useState(null);
  const [username, setUsername] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const handleSubmit = (ev) => {
    ev.preventDefault();
    fetch(`/api/user?username=${username}&password=${password}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setCurrentUser(data.data);
          window.location = "/";
        } else if (data.status === 400) {
          setError(data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
    <Wrapper>
      {error && (
        <Error>
          {error}
          <ErrorButton onClick={() => setError(null)}>Cool</ErrorButton>
        </Error>
      )}
      <Margin>
        <BirthWheel />
      </Margin>
      <Box>
        <Text>
          <Input
            type="text"
            placeholder="username"
            onChange={(ev) => setUsername(ev.target.value)}
          ></Input>
          <Input
            type="password"
            placeholder="password"
            onChange={(ev) => setPassword(ev.target.value)}
          ></Input>
          <Submit type="submit" onClick={(ev) => handleSubmit(ev)}>
            Submit
          </Submit>
        </Text>
      </Box>
    </Wrapper>
  );
};

export default SignIn;

const Wrapper = styled.div`
  width: 100%;
  height: calc(100vh - 110px);
  max-width: 1200px;
  background-color: var(--color-dark-grey);
  background: rgba(53, 56, 59, 0.7);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-left: 3px var(--color-dark-mustard) solid;
`;

const Margin = styled.div`
  z-index: 0;
  position: absolute;
  width: 100%;
  padding-top: 50px;
  height: calc(100vh - 120px);
  max-height: calc(100vh - 120px);
`;
const Box = styled.div`
  z-index: 2;
  width: 100%;
  border-bottom: 1px var(--color-dark-mustard) dashed;
  border-right: 1px var(--color-dark-mustard) dashed;
  display: flex;
  justify-content: flex-end;
`;
const Text = styled.form`
  margin-right: 120px;
  color: var(--color-oxford-blue);
  z-index: 2;
  font-family: var(--font-body);
  width: 45%;
  padding: 16% 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 35px;
  border-radius: 50%;
  background-color: var(--color-very-dark-grey);
  border: var(--color-dark-mustard) 1px solid;
  box-shadow: -15px 0px 80px 20px var(--color-dark-mustard);
`;
const Input = styled.input`
  z-index: 2;
  background-color: var(--color-very-dark-grey);
  border: var(--color-dark-mustard) 2px dashed;
  margin-bottom: 5px;
  color: var(--color-dark-mustard);
  text-shadow: 0 0 4px var(--color-dark-mustard);
  &:focus {
    outline: none;
    border: var(--color-dark-mustard) 2px solid;
    box-shadow: 0px 0px 5px 2px var(--color-dark-mustard);
  }
`;
const Submit = styled.button`
  font-size: 18px;
  padding: 4px;
  margin-top: 5px;
  color: var(--color-very-dark-grey);
  background-color: var(--color-dark-mustard);
  &:focus {
    outline: none;
    box-shadow: 0px 0px 5px 2px var(--color-dark-mustard);
  }
  transition: all ease 400ms;
  &:hover {
    box-shadow: 0px 0px 5px 2px var(--color-dark-mustard);
  }
`;
const Error = styled.div`
  background-color: var(--color-dark-grey);
  border-radius: 8px;
  position: absolute;
  top: 570px;
  left: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 3;
  width: 300px;
  padding: 15px;
  font-family: var(--font-heading);
  border: 2px solid var(--color-dark-mustard);
`;
const ErrorButton = styled.button`
  background-color: var(--color-dark-mustard);
  color: var(--color-dark-grey);
  border: 1px solid var(--color-very-dark-grey);
  font-size: 14px;
  margin-top: 10px;
  width: 80px;
  border-radius: 4px;
  transition: all ease 400ms;
  &:hover {
    border: 1px solid var(--color-dark-mustard);
    box-shadow: 0px 0px 5px 2px var(--color-dark-mustard);
  }
`;
