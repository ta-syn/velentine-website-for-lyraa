
import React from 'react';
import Particles from "@tsparticles/react";

const CyberParticles: React.FC = () => {

  return (
    <Particles
      id="tsparticles"
      options={{ 
        fullScreen: { enable: true, zIndex: -1 },
        background: { color: "transparent" },
        fpsLimit: 60,
        particles: {
          color: { value: ["#FF0080", "#00F0FF", "#B026FF", "#ffffff"] },
          links: {
            color: "#FF0080",
            distance: 150,
            enable: true,
            opacity: 0.05,
            width: 1,
          },
          move: {
            enable: true,
            speed: 0.8,
            direction: "none",
            random: true,
            straight: false,
            outModes: { default: "out" },
          },
          number: { density: { enable: true }, value: 50 },
          opacity: { value: { min: 0.1, max: 0.4 } },
          shape: { 
            type: ["circle", "heart"],
          },
          size: { value: { min: 1, max: 4 } },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: "bubble" },
            onClick: { enable: true, mode: "push" },
          },
          modes: {
            bubble: { distance: 200, size: 6, duration: 2, opacity: 0.8, color: "#FF0080" },
            push: { quantity: 4 },
          },
        },
      }}
    />
  );
};

export default CyberParticles;
