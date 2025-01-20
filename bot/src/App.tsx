import React, { useState, useEffect } from "react";
import { FaHome, FaUsers } from "react-icons/fa";
import Flag from "react-world-flags";
import axios from "axios";
import "./App.css";

function App() {
  const [isEnglish, setIsEnglish] = useState(true); // Default language is English
  const [clickedElement, setClickedElement] = useState(null);
  const [adCount, setAdCount] = useState(0); // Track the number of ads watched
  const [userInfo, setUserInfo] = useState(null); // Store user info fetched from backend
  const [isAdWatching, setIsAdWatching] = useState(false); // Track if the ad is being watched

  // Language toggle handler
  const toggleLanguage = () => {
    setIsEnglish(!isEnglish);
  };

  // Function to convert numbers to Arabic numerals
  const toArabicNumerals = (num: number) => {
    const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return num
      .toString()
      .split("")
      .map((digit) => arabicNumerals[parseInt(digit)])
      .join("");
  };

  // Fetch user info from the backend
  useEffect(() => {
    axios
      .get("/api/user-info")
      .then((response) => {
        setUserInfo(response.data); // Store user data from the backend
      })
      .catch((error) => console.error("Error fetching user info:", error));

    // Load the ad count from localStorage if available
    const storedAdCount = localStorage.getItem("adCount");
    if (storedAdCount) {
      setAdCount(parseInt(storedAdCount, 10));
    }
  }, []);

  // Increment ad count and save to localStorage
  const incrementCounter = () => {
    if (isAdWatching) return; // Prevent multiple clicks before the delay
    setIsAdWatching(true);

    setTimeout(() => {
      const updatedAdCount = adCount + 1;
      setAdCount(updatedAdCount);

      // Save updated ad count in localStorage to persist across sessions
      localStorage.setItem("adCount", updatedAdCount);

      // Send updated ad count to the backend to save it in the database (optional)
      axios
        .post("/api/increment-ad-count", { adCount: updatedAdCount })
        .then((response) => console.log("Ad count updated"))
        .catch((error) => console.error("Error updating ad count:", error));

      setIsAdWatching(false); // Allow further clicks after the delay
    }, 15000); // 15-second delay
  };

  // Handle Home Button Click
  const handleHomeClick = () => {
    setClickedElement("home");
  };

  // Handle Friends Button Click
  const handleFriendsClick = () => {
    setClickedElement("friends");
  };

  return (
    <div className="bg-black flex justify-center items-center h-screen relative overflow-hidden">
      {/* Background Stars */}
      <div className="floating-stars">
        {[...Array(30)].map((_, index) => (
          <div
            key={index}
            className="star"
            style={{
              animationDelay: `${Math.random() * 10}s`,
              fontSize: `${Math.random() * 20 + 15}px`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 5}s`
            }}
          >
            ✨
          </div>
        ))}
      </div>

      <div className="w-full bg-black text-white font-bold flex flex-col max-w-xl justify-center items-center">
        {/* Language Toggle Button (Flag) */}
        <div className="absolute top-4 right-4 cursor-pointer" onClick={toggleLanguage}>
          <Flag code={isEnglish ? "US" : "SA"} alt="flag" width={30} height={20} />
        </div>

        {/* Display Ads Watched Text */}
        <div className="text-lg text-white mb-2">
          {isEnglish ? "Ads Watched" : "الإعلانات المشاهدة"}
        </div>

        {/* Display the ad count */}
        <div className="text-6xl font-bold text-white mb-4">
          {isEnglish ? adCount : toArabicNumerals(adCount)}
        </div>

        {/* Watch Ad Button */}
        <h1
          className="text-3xl font-bold text-black bg-white border-4 border-white rounded-full px-6 py-3 cursor-pointer"
          onClick={incrementCounter}
        >
          {isEnglish ? "Watch Ad" : "شاهد الإعلان"}
        </h1>
      </div>

      {/* Home Button */}
      <div
        className={`absolute bottom-6 left-14 flex flex-col items-center p-2 cursor-pointer transition-all duration-200 home-button ${
          clickedElement === "home" ? "text-white" : "text-[#C0C0C0]"
        } hover:text-[#B0B0B0]`}
        onClick={handleHomeClick}
      >
        <FaHome
          size={28}
          className={`${clickedElement === "home" ? "text-white" : "text-[#C0C0C0]"}`}
        />
        <span className={`${clickedElement === "home" ? "text-white" : "text-[#C0C0C0]"} text-sm mt-1`}>
          {isEnglish ? "Home" : "الصفحة الرئيسية"}
        </span>
      </div>

      {/* Friends Button */}
      <div
        className={`absolute bottom-6 right-14 flex flex-col items-center p-2 cursor-pointer transition-all duration-200 friends-button ${
          clickedElement === "friends" ? "text-white" : "text-[#C0C0C0]"
        } hover:text-[#B0B0B0]`}
        onClick={handleFriendsClick}
      >
        <FaUsers
          size={28}
          className={`${clickedElement === "friends" ? "text-white" : "text-[#C0C0C0]"}`}
        />
        <span className={`${clickedElement === "friends" ? "text-white" : "text-[#C0C0C0]"} text-sm mt-1`}>
          {isEnglish ? "Friends" : "الأصدقاء"}
        </span>
      </div>
    </div>
  );
}

export default App;
