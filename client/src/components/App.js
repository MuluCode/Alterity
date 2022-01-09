import React from "react";
import styled from "styled-components";
import { BrowserRouter, Switch, Route, Link, NavLink } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";
import HomeIcon from "@mui/icons-material/Home";
import Header from "./Header";
import Homepage from "./Homepage";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Settings from "./Settings";
import GlobalStyles from "./GlobalStyles";
import { CurrentUserContext } from "./UserContext";
import Profile from "./Profile";
import Conversations from "./Conversations";
import Conversation from "./Conversation";

const App = () => {
  const { currentUser, unreadMessages } = React.useContext(CurrentUserContext);
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Header />
      <Main>
        {currentUser && (
          //icons to navigate to home, profile and inbox pages once user has logged in
          <>
            <Circle style={{ top: "206px" }} to="/">
              <HomeIcon style={{ fontSize: 28 }} />
            </Circle>
            <Circle style={{ top: "306px" }} to={`/profile/${currentUser._id}`}>
              <PersonIcon style={{ fontSize: 28 }} />
            </Circle>
            {currentUser.conversations && (
              <Circle style={{ top: "406px" }} to="/conversations">
                <MailIcon style={{ fontSize: 26 }} />
              </Circle>
            )}
            {unreadMessages > 0 && (
              //new message notification icon attached to inbox icon
              <UnreadNotification>{unreadMessages}</UnreadNotification>
            )}
          </>
        )}
        <Switch>
          <Route exact path="/">
            <Homepage />
          </Route>
          {currentUser ? (
            //settings and profile pages only accessible when user logged in
            <>
              <Route exact path="/settings">
                <Settings />
              </Route>
              <Route exact path="/profile/:id">
                <Profile />
              </Route>
              {currentUser.conversations && (
                //inbox and conversation pages only accessible once user has sent a message
                <>
                  <Route exact path="/conversations">
                    <Conversations />
                  </Route>
                  <Route exact path="/conversations/:id">
                    <Conversation />
                  </Route>
                </>
              )}
            </>
          ) : (
            <>
              <Route exact path="/signup">
                <SignUp />
              </Route>
              <Route exact path="/sign-in">
                <SignIn />
              </Route>
            </>
          )}
          <Route path="">404: Oops!</Route>
        </Switch>
      </Main>
    </BrowserRouter>
  );
};

const Main = styled.div`
  background-image: url("https://images.unsplash.com/photo-1535418126925-0bfb3a0ee0d7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80");
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  height: max-content;
  border-top: 120px var(--color-dark-blue) solid;
  min-width: 1360px;
  position: relative;
`;
const Circle = styled(NavLink)`
  position: fixed;
  width: 60px;
  height: 60px;
  left: 10px;
  border-radius: 50%;
  box-shadow: 0 0 5px 3px var(--color-dark-mustard);
  z-index: 10;
  transition: 600ms all ease;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-family: var(--font-heading);
  font-size: 24px;
  font-weight: bold;
  background-color: var(--color-dark-mustard);
  color: var(--color-very-dark-grey);
  &:hover {
    background-color: var(--color-very-dark-grey);
    border: 1px solid var(--color-dark-mustard);
    color: var(--color-dark-mustard);
    text-shadow: 0 0 5px var(--color-dark-mustard);
  }
`;
const UnreadNotification = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-very-dark-grey);
  border: 1px solid var(--color-dark-mustard);
  color: var(--color-dark-mustard);
  text-shadow: 0 0 5px var(--color-dark-mustard);
  border-radius: 50%;
  top: 450px;
  left: 45px;
  z-index: 12;
  width: 25px;
  height: 25px;
`;

export default App;
