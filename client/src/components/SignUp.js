import React from "react";
import styled from "styled-components";
import BirthWheel from "./BirthWheel";
import { CurrentUserContext } from "./UserContext";

const SignUp = () => {
  const [email, setEmail] = React.useState(null);
  const [username, setUsername] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [confirmPassword, setConfirmPassword] = React.useState(null);
  const [dob, setDob] = React.useState(null);
  const [tob, setTob] = React.useState(null);
  const [birthAddress, setBirthAddress] = React.useState(null);
  const [error, setError] = React.useState(null);

  const { currentUser, setCurrentUser } = React.useContext(CurrentUserContext);

  const handleClick = (ev) => {
    ev.preventDefault();
    const data = {
      email: email,
      _id: username,
      password: password,
      confirmPassword: confirmPassword,
      dateOfBirth: dob,
      timeOfBirth: tob,
      birthAddress: birthAddress,
    };
    fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 201) {
          setCurrentUser(data.data);
          window.location = "/settings";
        } else if (data.status === 400) {
          setError(data.message);
        } else console.log(data);
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
        <Box2>
          <Text>
            <Input
              type="email"
              placeholder="email"
              style={{
                top: "90px",
                left: "142px",
                borderTop: "#b57207 2px dashed",
                borderLeft: "#b57207 2px dashed",
              }}
              onChange={(ev) => setEmail(ev.target.value)}
            ></Input>
            <Input
              type="text"
              placeholder="username"
              style={{
                top: "170px",
                left: "70px",
                borderTop: "#b57207 2px dashed",
                borderLeft: "#b57207 2px dashed",
              }}
              onChange={(ev) => setUsername(ev.target.value)}
            ></Input>
            <Input
              type="password"
              placeholder="password"
              style={{
                top: "250px",
                left: "27px",
                borderTop: "#b57207 2px dashed",
                borderLeft: "#b57207 2px dashed",
              }}
              onChange={(ev) => setPassword(ev.target.value)}
            ></Input>
            <Input
              type="password"
              placeholder="confirm password"
              style={{
                top: "330px",
                left: "5px",
                borderTop: "#b57207 2px dashed",
                borderLeft: "#b57207 2px dashed",
              }}
              onChange={(ev) => setConfirmPassword(ev.target.value)}
            ></Input>
            <Input
              type="text"
              placeholder="date of birth  ( DD/MM/YYYY)"
              style={{
                top: "470px",
                left: "17px",
                borderBottom: "#b57207 2px dashed",
                borderLeft: "#b57207 2px dashed",
              }}
              onChange={(ev) => setDob(ev.target.value)}
            ></Input>
            <Input
              type="text"
              placeholder="time of birth (00:00 - 23:59)"
              style={{
                top: "550px",
                left: "51px",
                borderBottom: "#b57207 2px dashed",
                borderLeft: "#b57207 2px dashed",
              }}
              onChange={(ev) => setTob(ev.target.value)}
            ></Input>
            <Input
              type="text"
              placeholder="birth location (City, State, Country)"
              style={{
                top: "630px",
                left: "110px",
                width: "540px",
                borderBottom: "#b57207 2px dashed",
                borderLeft: "#b57207 2px dashed",
              }}
              onChange={(ev) => setBirthAddress(ev.target.value)}
            ></Input>
            <Submit
              type="submit"
              style={{
                top: "320px",
                left: "570px",
              }}
              onClick={(ev) => handleClick(ev)}
            >
              Create Account
            </Submit>
          </Text>
        </Box2>
      </Box>
    </Wrapper>
  );
};

export default SignUp;

const Wrapper = styled.div`
  width: 100%;
  height: calc(100vh - 110px);
  max-width: 1200px;
  background-color: var(--color-dark-grey);
  background: rgba(53, 56, 59, 0.7);
  position: relative;
  display: flex;
  align-items: flex-start;
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
  padding-top: 200px;
  width: 100%;
  border-bottom: 1px var(--color-dark-mustard) dashed;
  border-right: 1px var(--color-dark-mustard) dashed;
  display: flex;
  justify-content: flex-end;
`;
const Box2 = styled.div`
  z-index: 2;
  width: 920px;
  height: 800px;
  border-top: 1px var(--color-dark-mustard) dashed;
  border-left: 1px var(--color-dark-mustard) dashed;
  display: flex;
  justify-content: flex-end;
`;

const Text = styled.form`
  margin-right: 120px;
  color: var(--color-oxford-blue);
  z-index: 2;
  font-family: var(--font-body);
  width: 100%;
  padding: 30% 0;
  padding-left: 35px;
  border-radius: 50%;
  background-color: var(--color-very-dark-grey);
  border: var(--color-dark-mustard) 1px solid;
  box-shadow: -15px 0px 80px 20px var(--color-dark-mustard);
  position: relative;
`;
const Input = styled.input`
  width: 450px;
  z-index: 2;
  background-color: var(--color-very-dark-grey);
  color: #c38e38;
  border-radius: 0px;
  border: 2px solid var(--color-very-dark-grey);
  &:focus {
    outline: none;
    border: var(--color-dark-mustard) 2px solid;
    box-shadow: 0px 0px 5px 2px var(--color-dark-mustard);
  }
  position: absolute;
`;
const Submit = styled.button`
  font-size: 22px;
  color: var(--color-very-dark-grey);
  background-color: var(--color-dark-mustard);
  height: 200px;
  width: 200px;
  border-radius: 50%;
  box-shadow: 0px 0px 7px 3px var(--color-dark-mustard);
  &:focus {
    outline: none;
    box-shadow: 0px 0px 5px 2px var(--color-dark-mustard);
    background-color: var(--color-very-dark-grey);
    color: var(--color-dark-mustard);
    text-shadow: 0 0 4px var(--color-dark-mustard);
  }
  transition: all ease 600ms;
  &:hover {
    background-color: var(--color-very-dark-grey);
    border: 1px solid var(--color-dark-mustard);
    color: var(--color-dark-mustard);
    text-shadow: 0 0 4px var(--color-dark-mustard);
  }
  position: absolute;
`;
const Error = styled.div`
  background-color: var(--color-dark-grey);
  border-radius: 8px;
  position: absolute;
  top: 580px;
  left: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 3;
  width: 400px;
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
