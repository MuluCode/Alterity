import React from "react";
import styled from "styled-components";
import { CurrentUserContext } from "./UserContext";
import { Link } from "react-router-dom";
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

const Conversations = () => {
  const [error, setError] = React.useState(null);
  const { currentUser } = React.useContext(CurrentUserContext);
  const [conversations, setConversations] = React.useState({});
  React.useEffect(() => {
    fetch(`/api/messages/${currentUser._id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setConversations(data.data);
        } else if (data.status === 400) {
          setError(data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const partnerArray = Object.keys(conversations);
  const conversationsArray = Object.values(conversations);
  const mostRecentMessageArray = conversationsArray.map((item) => {
    return Math.max(
      ...Object.keys(item).filter((timestamp) => timestamp !== "chart")
    );
  });

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
  return (
    <Wrapper>
      <Box>
        <Box2>
          <Text>
            {error && (
              <Error>
                {error}
                <ErrorButton onClick={() => setError(null)}>Cool</ErrorButton>
              </Error>
            )}
            {partnerArray.map((partner, index) => (
              <Conversation to={`/conversations/${partner}`}>
                <Partner>{partner}</Partner>
                {conversationsArray[index][mostRecentMessageArray[index]]
                  ._id === currentUser._id ? (
                  <You>
                    <Name>
                      {`${
                        conversationsArray[index][mostRecentMessageArray[index]]
                          ._id
                      }:`}
                    </Name>
                    <Message>
                      {
                        conversationsArray[index][mostRecentMessageArray[index]]
                          .message
                      }
                    </Message>
                    <Alert>open conversation to view older messages</Alert>
                  </You>
                ) : (
                  <Them>
                    <Name>
                      {`${
                        conversationsArray[index][mostRecentMessageArray[index]]
                          ._id
                      }:`}
                    </Name>
                    <Message>
                      {
                        conversationsArray[index][mostRecentMessageArray[index]]
                          .message
                      }
                    </Message>
                    <Alert>open conversation to view older messages</Alert>
                  </Them>
                )}
              </Conversation>
            ))}
          </Text>
        </Box2>
      </Box>
      <PlanetArray>
        {currentUser.chart.map((planet) => (
          <Planet>
            {handleOrb(planet)}
            {handleSign(planet)}
          </Planet>
        ))}
      </PlanetArray>
    </Wrapper>
  );
};

export default Conversations;

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
  height: max-content;
  min-height: 1060px;
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
  background-color: var(--color-very-dark-grey);
  border: var(--color-dark-mustard) 2px solid;
  box-shadow: -10px 0px 70px 20px var(--color-dark-mustard);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: rgba(32, 34, 36, 0.8);
`;

const PlanetArray = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 30px;
  left: 30px;
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
const Conversation = styled(Link)`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 20px 0;
  background-color: var(--color-beige);
  padding: 10px;
  box-shadow: 0 0 3px 3px var(--color-beige);
  position: relative;
  text-decoration: none;
  color: var(--very-dark-grey);
`;
const You = styled.div`
  display: flex;
  height: max-content;
  min-height: 40px;
  padding-bottom: 12px;
  margin-top: 20px;
`;

const Them = styled.div`
  display: flex;
  height: max-content;
  min-height: 40px;
  padding-bottom: 12px;
  margin-top: 20px;
`;

const Name = styled.div`
  width: 25%;
`;
const Message = styled.div`
  width: 75%;
`;
const Alert = styled.div`
  position: absolute;
  color: var(--color-dark-mustard);
  font-size: 12px;
  bottom: 6px;
  right: 15px;
`;

const Partner = styled.div`
  font-size: 18px;
  color: var(--color-dark-mustard);
  background-color: rgba(53, 56, 59, 0.7);
  padding: 2px;
  box-shadow: 0 0 2px 2px rgba(53, 56, 59, 0.7);
  width: max-content;
`;
