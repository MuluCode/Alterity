import React from "react";
import styled from "styled-components";
import { CurrentUserContext } from "./UserContext";
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

const Settings = () => {
  const { currentUser, setCurrentUser } = React.useContext(CurrentUserContext);
  const [error, setError] = React.useState(null);
  const [gender, setGender] = React.useState(currentUser.gender);
  const [pGender, setPGender] = React.useState(currentUser.preferredGender);
  const [bio, setBio] = React.useState(currentUser.bio);
  const [newPreferences, setNewPreferences] = React.useState({
    Sun: "Aries",
    Moon: "Aries",
    Mars: "Aries",
    Mercury: "Aries",
    Jupiter: "Aries",
    Venus: "Aries",
    Saturn: "Aries",
    Neptune: "Aries",
    Pluto: "Aries",
    Uranus: "Aries",
    Ascendant: "Aries",
  });
  const [newPriorities, setNewPriorities] = React.useState({
    Sun: 1,
    Moon: 1,
    Mars: 1,
    Mercury: 1,
    Jupiter: 1,
    Venus: 1,
    Saturn: 1,
    Neptune: 1,
    Pluto: 1,
    Uranus: 1,
    Ascendant: 1,
  });

  const signs = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];
  const chart = currentUser.chart;
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
  const handleSubmit = (ev) => {
    ev.preventDefault();
    fetch("/api/user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...currentUser,
        preferences: newPreferences,
        priorities: newPriorities,
        bio: bio,
        gender: gender,
        preferredGender: pGender,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setCurrentUser(data.data);
          window.location = "/";
        } else if (data.status === 400) {
          setError(data.message);
        } else console.log(data);
      });
  };

  const handleRASubmit = (ev) => {
    ev.preventDefault();
    let prefObject = {};
    for (let j = 0; j < 6; j++) {
      for (let i = 0; i < chart.length; i++) {
        if (chart[i].sign === signs[j]) {
          prefObject = { ...prefObject, [chart[i].name]: signs[j + 6] };
        }
      }
    }
    for (let j = 6; j < 12; j++) {
      for (let i = 0; i < chart.length; i++) {
        if (chart[i].sign === signs[j]) {
          prefObject = { ...prefObject, [chart[i].name]: signs[j - 6] };
        }
      }
    }
    const priorities = {
      Sun: 1,
      Moon: 2,
      Mars: 4,
      Mercury: 7,
      Jupiter: 6,
      Venus: 3,
      Saturn: 8,
      Neptune: 10,
      Pluto: 9,
      Uranus: 11,
      Ascendant: 5,
    };
    fetch("/api/user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...currentUser,
        preferences: prefObject,
        priorities: priorities,
        bio: bio,
        gender: gender,
        preferredGender: pGender,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setCurrentUser(data.data);
          window.location = "/";
        } else if (data.status === 400) {
          setError(data.message);
        } else console.log(data);
      });
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
            <Category>
              <Label>Your gender analog...</Label>
              <Question onChange={(ev) => setGender(ev.target.value)}>
                <Label>butch</Label>
                <Input type="radio" name="gender" value="butch" />
                <Label>femme</Label>
                <Input type="radio" name="gender" value="femme" />
                <Label>not my vibe</Label>
                <Input type="radio" name="gender" value="other" />
              </Question>
            </Category>
            <Category>
              <Label>Preferred partner gender analog...</Label>
              <Question onChange={(ev) => setPGender(ev.target.value)}>
                <Label>butch</Label>
                <Input type="radio" name="other-gender" value="butch" />
                <Label>femme</Label>
                <Input type="radio" name="other-gender" value="femme" />
                <Label>not my vibe</Label>
                <Input type="radio" name="other-gender" value="other" />
              </Question>
            </Category>
            <Category>
              <Label>
                <div>Partner planet preferences</div>
                <div style={{ paddingRight: "28px" }}>Priority</div>
              </Label>

              {chart.map((planet) => (
                <Question>
                  <Label style={{ width: "100px" }}>{planet.name}</Label>
                  <Select
                    style={{ width: "200px" }}
                    onChange={(ev) =>
                      setNewPreferences({
                        ...newPreferences,
                        [planet.name]: ev.target.value,
                      })
                    }
                  >
                    {signs.map((sign) => (
                      <Option value={sign}>{sign}</Option>
                    ))}
                  </Select>
                  <Select
                    style={{ width: "100px" }}
                    onChange={(ev) =>
                      setNewPriorities({
                        ...newPriorities,
                        [planet.name]: Number(ev.target.value),
                      })
                    }
                  >
                    {chart.map((planet, index) => (
                      <Option value={index + 1}>{index + 1}</Option>
                    ))}
                  </Select>
                </Question>
              ))}
            </Category>
            <Category>
              {!currentUser.bio ? (
                <BigInput
                  placeholder="what do you want others to know about you?"
                  rows="8"
                  onChange={(ev) => setBio(ev.target.value)}
                />
              ) : (
                <BigInput
                  rows="8"
                  onChange={(ev) => setBio(ev.target.value)}
                  defaultValue={currentUser.bio}
                />
              )}
            </Category>
            <Buttons>
              <Submit onClick={(ev) => handleSubmit(ev)}>
                Submit Custom Settings
              </Submit>
              <Submit onClick={(ev) => handleRASubmit(ev)}>
                Radical Alterity!
              </Submit>
            </Buttons>
          </Text>
        </Box2>
      </Box>
      <PlanetArray>
        {chart.map((planet) => (
          <Planet>
            {handleOrb(planet)}
            {handleSign(planet)}
          </Planet>
        ))}
      </PlanetArray>
    </Wrapper>
  );
};

export default Settings;

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

const Box = styled.div`
  z-index: 2;
  padding-top: 50px;
  width: 100%;
  border-bottom: 1px var(--color-dark-mustard) dashed;
  border-right: 1px var(--color-dark-mustard) dashed;
  display: flex;
  justify-content: flex-end;
`;
const Box2 = styled.div`
  z-index: 2;
  width: 900px;
  height: 1060px;
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
  align-items: flex-start;
  background: rgba(32, 34, 36, 0.8);
`;
const Category = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 550px;
  z-index: 2;
  font-size: 16px;
  height: 70px;
  margin-top: 30px;
`;
const Question = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 20px;
  width: 100%;
  color: var(--color-beige);
`;
const Label = styled.div`
  color: var(--color-beige);
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
`;
const Input = styled.input`
  &:focus {
    outline: none;
  }
`;
const BigInput = styled.textarea`
  position: absolute;
  bottom: 150px;
  height: 140px;
  width: 520px;
  font-size: 18px;
  background-color: var(--color-beige);
  border-radius: none;
  &:focus {
    outline: none;
  }
`;

const Buttons = styled.div`
  display: flex;
  position: absolute;
  bottom: 50px;
  left: 50px;
  width: 400px;
  height: 40px;
  justify-content: space-between;
`;
const Submit = styled.button`
  font-size: 18px;
  color: var(--color-beige);
  border: 1px solid var(--color-beige);
  background-color: var(--color-dark-grey);
  &:focus {
    outline: none;
    box-shadow: 0px 0px 5px 2px var(--color-dark-grey);
    border: 1px solid var(--color-dark-grey);
  }
  transition: all ease 400ms;
  &:hover {
    box-shadow: 0px 0px 5px 2px var(--color-dark-grey);
    border: 1px solid var(--color-dark-grey);
  }
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
const Select = styled.select`
  background-color: var(--color-beige);
  font-family: var(--font-body);
  font-size: 16px;
  &:focus {
    outline: none;
  }
`;
const Option = styled.option``;

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
