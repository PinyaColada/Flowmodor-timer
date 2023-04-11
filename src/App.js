import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  background-color: #333;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TimerCircle = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  border: 2px solid white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const TimerText = styled.h1`
  color: white;
  font-family: "Courier New", monospace;
  user-select: none;
`;

const Ripple = styled.div`
  position: absolute;
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
  animation: ripple 0.8s ease-out;
  @keyframes ripple {
    0% {
      width: 200px;
      height: 200px;
      opacity: 1;
      border: 3px solid white;
    }
    100% {
      width: 300px;
      height: 300px;
      opacity: 0;
      border: 2px solid white;
    }
  }
`;

const App = () => {
  // State variables
  const [seconds, setSeconds] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [showRipple, setShowRipple] = useState(false);
  const [isDepleting, setIsDepleting] = useState(false);
  const [minutes, setMinutes] = useState(0);

  // Audio files
  const startSound = new Audio("/start.wav");
  const endSound = new Audio("/end.wav");
  const restSound = new Audio("/rest.wav");

  const [hasPlayedRestSound, setHasPlayedRestSound] = useState(false);

  // Update minutes and seconds when seconds change
  useEffect(() => {
    if (seconds >= 60) {
      setSeconds(0);
      setMinutes((prevMinutes) => prevMinutes + 1);
    } else if (seconds < 0 && minutes > 0) {
      setSeconds(59);
      setMinutes((prevMinutes) => prevMinutes - 1);
    } else if (seconds < 0 && minutes === 0) {
      setSeconds(0);
      setIsDepleting(false);
      if (!hasPlayedRestSound) {
        restSound.play(); // Play rest sound when timer reaches 0 after depleting
        setHasPlayedRestSound(true);
      }
    } 
  }, [seconds]);

  // Function to toggle the timer
  const toggleTimer = (increase) => {
    clearInterval(intervalId);
    const id = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + (increase ? 1 : -1));
    }, (increase ? 5000 : 1000));
    setIntervalId(id);
  };

  // Function to handle timer click
  const handleClick = () => {
    setShowRipple(true);

    // Timer is not running or has reached 0 and is not depleting
    if (intervalId === null || (seconds === 0 && !isDepleting)) {
      startSound.play();
      setIsDepleting(false);
      toggleTimer(true);
    }
    // Timer is depleting
    else if (!isDepleting) {
      endSound.play();
      setHasPlayedRestSound(false);
      setIsDepleting(true);
      toggleTimer(false);
    }
    // Timer is running
    else {
      startSound.play();
      setIsDepleting(false);
      toggleTimer(true);
    }
  };

  return (
    <Container>
      <TimerCircle onClick={handleClick}>
        {showRipple && <Ripple onAnimationEnd={() => setShowRipple(false)} />}
        <TimerText>
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </TimerText>
      </TimerCircle>
    </Container>
  );
};

export default App;

