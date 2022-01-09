import React from "react";
import styled from "styled-components";
import { NavLink, Link } from "react-router-dom";
import Logo from "./Logo";
import { CurrentUserContext } from "./UserContext";

const Header = () => {
  // put state variables from context
  const { currentUser, setCurrentUser } = React.useContext(CurrentUserContext);

  //signout function
  const handleSignOut = () => {
    setCurrentUser(null);
    window.location = "/";
  };
  return (
    <Wrapper>
      <Name
        //render logo with a link to homepage
        to="/"
      >
        <Logo />
        alter
      </Name>
      <Nav>
        {currentUser ? (
          //render settings and signout link if there is a current user or sign-in and create account links if there is no user
          <>
            <StyledNavLink
              to="/settings"
              activeStyle={{
                background: "#b57207",
                color: "#202224",
                boxShadow: "0px 0px 5px 2px #b57207",
              }}
            >
              Settings
            </StyledNavLink>
            <SignOut onClick={(ev) => handleSignOut(ev)}>Sign Out</SignOut>
          </>
        ) : (
          <>
            <StyledNavLink
              to="/sign-in"
              activeStyle={{
                background: "#b57207",
                color: "#202224",
                boxShadow: "0px 0px 5px 2px #b57207",
              }}
            >
              Sign In
            </StyledNavLink>
            <StyledNavLink
              to="/signup"
              activeStyle={{
                background: "#b57207",
                color: "#202224",
                boxShadow: "0px 0px 5px 2px #b57207",
              }}
            >
              New User
            </StyledNavLink>
          </>
        )}
      </Nav>
    </Wrapper>
  );
};

const Wrapper = styled.header`
  display: flex;
  position: fixed;
  justify-content: space-between;
  align-items: center;
  background: var(--color-very-dark-grey);
  height: 110px;
  padding: var(--padding-page) 24px;
  border-bottom: 2px var(--color-dark-mustard) solid;
  width: 100vw;
  z-index: 10;
`;
const Name = styled(Link)`
  display: flex;
  align-items: center;
  font-family: var(--font-logo);
  font-size: 48px;
  color: var(--color-dark-blue);
  text-decoration: none;
  text-shadow: 4px 3px 15px var(--color-dark-mustard);
  transition: all ease 600ms;
  &:hover {
    text-shadow: 2px 2px 4px var(--color-dark-mustard);
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
`;
const StyledNavLink = styled(NavLink)`
  background-image: url("https://images.unsplash.com/photo-1535418126925-0bfb3a0ee0d7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80");
  border: 1px solid var(--color-dark-mustard);
  border-radius: 20px;
  color: var(--color-dark-mustard);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: var(--font-heading);
  font-size: 18px;
  height: 42px;
  margin: 0 0 0 8px;
  padding: 0 14px;
  box-shadow: 0px 0px 4px 1px var(--color-dark-mustard);

  text-decoration: none;
  transition: all ease 400ms;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  &:hover {
    background: var(--color-dark-mustard);
    color: var(--color-very-dark-grey);
    box-shadow: 0px 0px 5px 2px #b57207;
  }
  &:focus {
    outline: none;
    border: var(--color-dark-mustard) 2px solid;
    box-shadow: 0px 0px 5px 2px var(--color-dark-mustard);
  }
`;
const SignOut = styled.button`
  background-image: url("https://images.unsplash.com/photo-1535418126925-0bfb3a0ee0d7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80");
  border: 1px solid var(--color-dark-mustard);
  border-radius: 20px;
  color: var(--color-dark-mustard);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: var(--font-heading);
  font-size: 18px;
  height: 42px;
  margin: 0 0 0 8px;
  padding: 0 14px;
  box-shadow: 0px 0px 4px 1px var(--color-dark-mustard);

  text-decoration: none;
  transition: all ease 400ms;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  &:hover {
    background: var(--color-dark-mustard);
    color: var(--color-very-dark-grey);
    background: #b57207;
    color: #202224;
    box-shadow: 0px 0px 5px 2px #b57207;
  }
  &:focus {
    outline: none;
    border: var(--color-dark-mustard) 2px solid;
    box-shadow: 0px 0px 5px 2px var(--color-dark-mustard);
    background: #b57207;
    color: #202224;
  }
`;

export default Header;
