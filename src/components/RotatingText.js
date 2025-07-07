import React, { useState, useEffect } from "react";

const RotatingText = () => {
  const names = ["you", "John", "Alice", "Sam", "Mike"]; // List of names to cycle through
  const [currentName, setCurrentName] = useState(names[0]); // Initial name

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentName((prevName) => {
        const currentIndex = names.indexOf(prevName);
        const nextIndex = (currentIndex + 1) % names.length;
        console.log("Next Name: ", names[nextIndex]);
        return names[nextIndex];
      });
    }, 2000); // Change name every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []); // Empty dependency array means this runs once on mount

  return currentName;
};

export default RotatingText;
