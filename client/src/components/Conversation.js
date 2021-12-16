import React from "react";
import styled from "styled-components";
import { CurrentUserContext } from "./UserContext";
import { Link, useParams } from "react-router-dom";
import aries from "../assets/signs/aries-sign.png";
import taurus from "../assets/signs/taurus-astrological-sign-symbol.png";
import gemini from "../assets/signs/gemini-zodiac-sign-symbol.png";
import cancer from "../assets/signs/cancer-zodiac-sign-symbol.png";
import leo from "../assets/signs/leo-sign.png";
import virgo from "../assets/signs/virgo-astrological-symbol-sign.png";
import libra from "../assets/signs/libra-sign.png";
import scorpio from "../assets/signs/scorpion-astrological-sign.png";
import sagittarius from "../assets/signs/sagittarius-arrow-sign.png";
import capricorn from "../assets/signs/capricorn-sign.png";
import aquarius from "../assets/signs/aquarius-zodiac-sign-symbol.png";
import pisces from "../assets/signs/pisces-astrological-sign.png";
import sun from "../assets/planets/sun.png";
import moon from "../assets/planets/moon.png";
import mercury from "../assets/planets/mercury.png";
import venus from "../assets/planets/venus.png";
import mars from "../assets/planets/mars.png";
import jupiter from "../assets/planets/jupiter.png";
import saturn from "../assets/planets/saturn.png";
import neptune from "../assets/planets/neptune.png";
import uranus from "../assets/planets/uranus.png";
import pluto from "../assets/planets/pluto.png";

const Conversation = () => {
  const [error, setError] = React.useState(null);
  const { currentUser, setCurrentUser } = React.useContext(CurrentUserContext);
  const [conversation, setConversation] = React.useState({});
  const [chart, setChart] = React.useState(null);
  const [message, setMessage] = React.useState(null);
  const { id } = useParams();
  React.useEffect(() => {
    fetch(`/api/messages/${currentUser._id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setChart(data.data[id].chart);
          console.log(data.data);
          delete data.data[id].chart;
          setConversation(data.data[id]);
        } else if (data.status === 400) {
          setError(data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const handleOrb = (planet) => {
    if (planet.name === "Sun") {
      return <Orb src={sun} />;
    } else if (planet.name === "Moon") {
      return <Orb src={moon} />;
    } else if (planet.name === "Mercury") {
      return <Orb src={mercury} />;
    } else if (planet.name === "Venus") {
      return <Orb src={venus} />;
    } else if (planet.name === "Mars") {
      return <Orb src={mars} />;
    } else if (planet.name === "Jupiter") {
      return <Orb src={jupiter} />;
    } else if (planet.name === "Saturn") {
      return <Orb src={saturn} />;
    } else if (planet.name === "Neptune") {
      return <Orb src={neptune} />;
    } else if (planet.name === "Uranus") {
      return <Orb src={uranus} />;
    } else if (planet.name === "Pluto") {
      return <Orb src={pluto} />;
    } else if (planet.name === "Ascendant") {
      return <Asc>ASC</Asc>;
    }
  };
  const handleSign = (planet) => {
    if (planet.sign === "Aries") {
      return <Sign src={aries} />;
    } else if (planet.sign === "Taurus") {
      return <Sign src={taurus} />;
    } else if (planet.sign === "Gemini") {
      return <Sign src={gemini} />;
    } else if (planet.sign === "Cancer") {
      return <Sign src={cancer} />;
    } else if (planet.sign === "Leo") {
      return <Sign src={leo} />;
    } else if (planet.sign === "Virgo") {
      return <Sign src={virgo} />;
    } else if (planet.sign === "Libra") {
      return <Sign src={libra} />;
    } else if (planet.sign === "Scorpio") {
      return <Sign src={scorpio} />;
    } else if (planet.sign === "Sagittarius") {
      return <Sign src={sagittarius} />;
    } else if (planet.sign === "Capricorn") {
      return <Sign src={capricorn} />;
    } else if (planet.sign === "Aquarius") {
      return <Sign src={aquarius} />;
    } else if (planet.sign === "Pisces") {
      return <Sign src={pisces} />;
    }
  };
  const handleMessage = (ev) => {
    ev.preventDefault();
    if (message !== null && message !== "") {
      fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: currentUser._id,
          recipient: id,
          message: message,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200) {
            setCurrentUser(data.data);
            window.location.reload();
          } else if (data.status === 400) {
            setError(data.message);
          } else console.log(data);
        });
    }
  };
  let timestampArray = Object.keys(conversation);
  const conversationArray = Object.values(conversation);
  let messagesArray = [];
  for (let i = 0; i < conversationArray.length; i++) {
    const mostRecent = Math.max(...timestampArray);
    const index = timestampArray.indexOf(String(mostRecent));
    messagesArray.push(conversationArray[index]);
    let updatedTimeStampArray = timestampArray.filter(
      (thing) => thing !== String(mostRecent)
    );
    timestampArray = updatedTimeStampArray;
  }

  return (
    <Wrapper>
      <PlanetArray to={`/profile/${id}`}>
        <Name>{id}</Name>
        {chart &&
          chart.map((planet) => (
            <Planet>
              {handleOrb(planet)}
              {handleSign(planet)}
            </Planet>
          ))}
      </PlanetArray>
      {conversation && (
        <Box>
          <Box2>
            <Text>
              {error && (
                <Error>
                  {error}
                  <ErrorButton onClick={() => setError(null)}>Cool</ErrorButton>
                </Error>
              )}
              <ContentBox>
                {messagesArray.map((message) => (
                  <Convo>
                    {message._id === currentUser._id ? (
                      <You>
                        <SenderName
                          style={{ width: "10%" }}
                        >{`you:`}</SenderName>
                        <Message style={{ width: "90%" }}>
                          {message.message}
                        </Message>
                      </You>
                    ) : (
                      <Them>
                        <SenderName>{`${message._id}:`}</SenderName>
                        <Message>{message.message}</Message>
                      </Them>
                    )}
                  </Convo>
                ))}
              </ContentBox>
              <FormContainer>
                <Form>
                  <MessageBox
                    placeholder="well, actually, what had happened was..."
                    onChange={(ev) => setMessage(ev.target.value)}
                  ></MessageBox>
                  <Submit type="submit" onClick={(ev) => handleMessage(ev)}>
                    Send
                  </Submit>
                </Form>
              </FormContainer>
            </Text>
          </Box2>
        </Box>
      )}
    </Wrapper>
  );
};

export default Conversation;

const Wrapper = styled.div`
  width: 100%;
  height: max-content;
  min-height: calc(100vh - 110px);
  max-width: 1200px;
  background-color: var(--color-dark-grey);
  background: rgba(53, 56, 59, 0.7);
  position: relative;
  display: flex;
  align-items: flex-start;
  border-left: 3px var(--color-dark-mustard) solid;
`;

const Box = styled.div`
  z-index: 2;
  padding-top: 50px;
  width: 100%;
  border-bottom: 1px var(--color-dark-mustard) dashed;
  border-right: 1px var(--color-dark-mustard) dashed;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 100px;
`;
const Box2 = styled.div`
  z-index: 2;
  width: 900px;
  min-height: 1060px;
  height: max-content;
  border-top: 1px var(--color-dark-mustard) dashed;
  border-left: 1px var(--color-dark-mustard) dashed;
  display: flex;
  justify-content: flex-end;
`;

const Text = styled.form`
  margin-right: 100px;
  color: var(--color-oxford-blue);
  z-index: 2;
  font-family: var(--font-body);
  width: 100%;
  padding: 30px 50px;
  padding-top: 270px;
  background-color: var(--color-very-dark-grey);
  border: var(--color-dark-mustard) 2px solid;
  box-shadow: 0px 0px 40px 10px var(--color-dark-mustard);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  background: rgba(53, 56, 59, 0.7);
`;
const ContentBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 20px 0;
  background-color: var(--color-beige);
  opacity: 80%;
  padding: 10px;
  box-shadow: 0 0 3px 3px var(--color-beige);
  position: relative;
  height: max-content;
  margin-bottom: 20px;
  min-height: 720px;
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top: 40px;
  left: 40px;
  height: 210px;
  background-color: white;
  border-radius: 8px;
  background-color: white;
  z-index: 3;
`;
const Form = styled.form`
  position: relative;
`;
const MessageBox = styled.textarea`
  width: 690px;
  height: 200px;
  border-radius: 8px;
  padding: 5px 10px;
  resize: none;
  background-color: rgba(181, 114, 7, 0.2);
  border: 1px solid var(--color-light-grey);
  color: var(--color-dark-grey);
  font-size: 16px;
  &:focus {
    border: 1px solid var(--color-dark-mustard);
    box-shadow: 0 0 7px 5px rgba(181, 114, 7, 0.5);
    outline: none;
  }
`;
const Submit = styled.button`
  position: absolute;
  right: 10px;
  bottom: 10px;
  z-index: 5;
  background-color: var(--color-light-grey);
  padding: 8px 20px;
  font-size: 16px;
  color: var(--color-very-dark-grey);
  border: 1px solid var(--color-light-grey);
  box-shadow: 0 0 3px 2px rgba(101, 109, 117, 0.8);
  border-radius: 8px;
  transition: 200ms ease-in;
  &:hover {
    color: var(--color-beige);
    background-color: rgba(181, 114, 7, 0.8);
    border: 1px solid rgba(181, 114, 7, 0.5);
    box-shadow: 0 0 3px 3px rgba(181, 114, 7, 0.5);
    outline: none;
  }
`;
const PlanetArray = styled(Link)`
  text-decoration: none;
  color: black;
  display: flex;
  flex-direction: column;
  top: 30px;
  left: 30px;
  opacity: 60%;
  transition: all ease 400ms;
  margin: 20px 0 0 40px;
  &:hover {
    opacity: 100%;
  }
`;

const Planet = styled.div`
  display: flex;
  width: 200px;
  height: 70px;
  align-items: center;
  justify-content: space-between;
  padding: 0px 10px;
  margin: 15px 0;
  background-color: var(--color-beige);
  opacity: 60%;
  box-shadow: 0 0 10px 20px var(--color-very-dark-grey);
`;
const Orb = styled.img`
  width: 80px;
`;
const Sign = styled.img`
  width: 80px;
`;
const Asc = styled.div`
  font-family: var(--font-heading);
  font-size: 40px;
`;

const Error = styled.div`
  background-color: var(--color-light-grey);
  border-radius: 8px;
  position: absolute;
  top: 300px;
  left: 150px;
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
  background-color: blue;
  color: var(--color-dark-grey);
  font-size: 14px;
`;
const Name = styled.div`
  color: rgba(181, 114, 7, 0.7);
  margin: 10px 0 7px 0;
  font-size: 22px;
  font-family: var(--font-body);
`;
const Convo = styled.div`
  width: 100%;
  display: flex;
  height: max-content;
`;
const You = styled.div`
  display: flex;
  width: 100%;
  padding: 10px 0 0 10px;
  color: var(--color-dark-grey);
`;

const Them = styled.div`
  display: flex;
  width: 100%;
  padding: 10px 0 0 10px;
  color: var(--color-very-dark-grey);
`;

const SenderName = styled.div`
  width: 20%;
`;
const Message = styled.div`
  width: 80%;
`;
