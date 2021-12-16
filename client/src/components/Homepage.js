import React from "react";
import styled from "styled-components";
import BirthWheel from "./BirthWheel";
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

const Homepage = () => {
  const { currentUser, setCurrentUser } = React.useContext(CurrentUserContext);
  const [error, setError] = React.useState(null);
  const [feed, setFeed] = React.useState([]);
  const [partialFeed, setPartialFeed] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);

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

  const pages = Math.ceil(feed.length / 4);
  const pagesArray = [];
  for (let i = 1; i <= pages; i++) {
    pagesArray.push(i);
  }

  React.useEffect(() => {
    if (currentUser && currentUser.preferences) {
      fetch(`/api/feed/${currentUser._id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            setFeed(data.data);
            let startIndex = (currentPage - 1) * 4;
            const sliced = data.data.slice(startIndex, startIndex + 4);
            setPartialFeed(sliced);
            window.scrollTo(0, 0);
          } else if (data.status === 400) {
            setError(data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [currentPage]);
  console.log(feed);

  return (
    <UbberWrapper>
      <Wrapper>
        {error && (
          <Error>
            {error}
            <ErrorButton onClick={() => setError(null)}>Cool</ErrorButton>
          </Error>
        )}
        {currentUser && currentUser.preferences ? (
          <>
            {feed && (
              <>
                {partialFeed.map((partner) => (
                  <PlanetArray to={`/profile/${partner._id}`}>
                    <Name>{partner._id}</Name>

                    {partner.chart.map((planet) => (
                      <Planet>
                        {handleOrb(planet)}
                        {handleSign(planet)}
                      </Planet>
                    ))}
                    <Bio>{partner.bio}</Bio>
                  </PlanetArray>
                ))}
              </>
            )}
          </>
        ) : (
          <>
            <Margin>
              <BirthWheel />
            </Margin>
            <Text>
              <Heading>Welcome to alter!</Heading>
              <Description>
                alter is a human connection platform that employs the major
                planetary positions of a user’s western astrological natal chart
                as a basis for relational curation. By analyzing user-provided
                birth information, alter generates a profile that assings each
                of the system's eleven primary celestial bodies one of 12
                possible positions. These paired elements, of what is
                traditionally refered to as a user's birth chart, then allow the
                user to narrow their exposure to other members of the network by
                filtering them through their preferred partner configurations.
                This differentiates each user as 1 in 12 to the 11th power or 1
                in 743 billion possible profile configurations, equipping every
                user with just one more tool in the process toward willfull
                relational pairing.
              </Description>
              <Description>
                It is our mission to offer a tool that allows the astrologically
                astute to select both preferred planetary positions and an order
                of priority for each of those preferences. However, in order to
                promote the accessibility of our application, we also provide a
                default preference setting, which we call{" "}
                <RA>Radical Alterity</RA>.
              </Description>
            </Text>
          </>
        )}
      </Wrapper>
      {partialFeed && (
        <ButtonWrapper>
          {pagesArray.map((page) => {
            return <Button onClick={() => setCurrentPage(page)}>{page}</Button>;
          })}
        </ButtonWrapper>
      )}
    </UbberWrapper>
  );
};

export default Homepage;

const UbberWrapper = styled.div`
  height: max-content;
  min-height: calc(100vh - 110px);
  width: 1200px;
  background-color: var(--color-dark-grey);
  opacity: 70%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-left: 3px var(--color-dark-mustard) solid;
`;
const Wrapper = styled.div`
  height: max-content;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 1200px;
`;

const Margin = styled.div`
  z-index: 0;
  position: absolute;
  width: 100%;
  padding-top: 50px;
  height: calc(100vh - 120px);
  max-height: calc(100vh - 120px);
`;
const Text = styled.div`
  color: var(--color-dark-mustard);
  z-index: 2;
  font-family: var(--font-body);
  width: 68%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 30px;
  border-bottom: 2px var(--color-dark-mustard) dashed;
  padding-right: 30px;
  border-right: 2px var(--color-dark-mustard) dashed;
  margin-top: 470px;
`;
const Heading = styled.h2`
  margin-bottom: 10px;
  width: 60%;
  text-align: left;
  color: var(--color-beige);
  border-bottom: 2px dashed var(--color-beige);
`;
const Description = styled.p`
  margin-top: 10px;
`;
const RA = styled.span`
  color: var(--color-beige);
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
const PlanetArray = styled(Link)`
  text-decoration: none;
  color: black;
  display: flex;
  position: relative;
  flex-direction: column;
  margin: 0 40px;
  opacity: 60%;
  transition: all ease 400ms;
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
const Name = styled.div`
  color: var(--color-dark-mustard);
  margin: 55px 0 7px 0;
  font-size: 22px;
  font-family: var(--font-body);
`;

const Bio = styled.div`
  color: white;
  width: 200px;
  margin: 10px 0 50px 0;
`;
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 900px;
  background-color: var(--color-very-dark-grey);
  border-radius: 8px;
  margin: 20px 0 40px 0;
`;

const Button = styled.button`
  margin: 10px;
  width: 50px;
  font-family: var(--font-heading);
  cursor: pointer;
  background-color: #fffdd0;
  color: var(--color-very-dark-grey);
  transition: all ease 300ms;
  &:hover {
    background-color: var(--color-dark-grey);
    color: #fffdd0;
    border-color: #fffdd0;
  }
`;
