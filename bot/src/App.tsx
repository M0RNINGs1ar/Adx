import { useState, useEffect } from "react";
import { FaHome, FaHandPointer, FaRocket, FaClipboardList, FaRedo, FaClock, FaBatteryFull } from "react-icons/fa";
import Flag from "react-world-flags";
import "./App.css";

// Global declaration for Adsgram (Add this at the top of the file)
declare global {
  interface Window {
    Adsgram: any; // Declaring the Adsgram object on the window interface
  }
}

function App() {
  const AdController = window.Adsgram.init({
    blockId: "int-7245",
    debug: false,
    debugBannerType: "FullscreenMedia"
  });

  const [isEnglish, setIsEnglish] = useState(true);
  const [clickedElement, setClickedElement] = useState<string | null>(null);
  const [remainingClicks, setRemainingClicks] = useState(1000);
  const [isAdWatching, setIsAdWatching] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [clickTime, setClickTime] = useState(1000);
  const [boostersActive, setBoostersActive] = useState(false);
  const [message, setMessage] = useState("");
  const [multiplyClicks, setMultiplyClicks] = useState(1);

  const [energyLimitLevel, setEnergyLimitLevel] = useState(0);
  const [multiplyClicksLevel, setMultiplyClicksLevel] = useState(0);
  const [reduceClickTimeCost, setReduceClickTimeCost] = useState(50);

  // State for tracking the number of ads watched
  const [adCount, setAdCount] = useState<number>(0); // Initialize adCount with 0

  const handleWatchAdClick = () => {
    if (isAdWatching) return; // Prevent multiple clicks while ad is watching

    setIsAdWatching(true);

    // Log the AdController object to check its methods
    console.log(AdController);

    // Here we'll add a check for available methods
    if (typeof AdController.show === "function") {
      AdController.show()
        .then(() => {
          console.log("Ad loaded successfully.");
          setAdCount((prev: number) => prev + 1); // Increase ad count after successfully watching an ad
        })
        .catch((error: Error) => {
          console.error("Error loading ad:", error); // If there is an error, log it in the console
        })
        .finally(() => {
          setIsAdWatching(false); // Reset ad watching state
        });
    } else {
      // Log an error message if loadInterstitialAd method doesn't exist
      console.error("loadInterstitialAd method is not available.");
      setIsAdWatching(false); // Reset the ad watching state
    }
  };

  useEffect(() => {
    const savedBalance = localStorage.getItem("balance");
    if (savedBalance) {
      setBalance(Number(savedBalance));
    }

    if (remainingClicks < 1000) {
      const intervalId = setInterval(() => {
        setRemainingClicks((prev) => {
          if (prev < 1000) {
            return prev + 1;
          } else {
            clearInterval(intervalId);
            return 1000;
          }
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [remainingClicks]);

  const toggleLanguage = () => {
    setIsEnglish(!isEnglish);
  };

  const incrementClickCount = () => {
    if (isAdWatching || remainingClicks <= 0) return;
    setIsAdWatching(true);

    setTimeout(() => {
      setRemainingClicks((prev) => prev - 1);
      setBalance((prev) => prev + multiplyClicks);
      localStorage.setItem("balance", (balance + multiplyClicks).toString());
      setIsAdWatching(false);
    }, clickTime);
  };

  const activateMultiply = () => {
    const cost = 50 * Math.pow(2, multiplyClicksLevel);
    if (balance < cost) {
      showMessage(cost);
      return;
    }

    setMultiplyClicksLevel((prev) => prev + 1);
    setMultiplyClicks((prev) => prev * 2);
    setBalance((prev) => prev - cost);
    localStorage.setItem("balance", (balance - cost).toString());
    setMessage("");
  };

  const activateRefill = () => {
    const cost = 50 * Math.pow(2, multiplyClicksLevel);
    if (balance < cost) {
      showMessage(cost);
      return;
    }
    setRemainingClicks(1000 + 100 * multiplyClicksLevel);
    setBalance((prev) => prev - cost);
    localStorage.setItem("balance", (balance - cost).toString());
    setMessage("");
  };

  const activateEnergyLimit = () => {
    const cost = 100 * Math.pow(2, energyLimitLevel);
    if (balance < cost) {
      showMessage(cost);
      return;
    }

    setEnergyLimitLevel((prev) => prev + 1);
    setRemainingClicks(1000 + 1000 * energyLimitLevel);
    setBalance((prev) => prev - cost);
    localStorage.setItem("balance", (balance - cost).toString());
    setMessage(isEnglish ? `Energy Limit Activated! Level ${energyLimitLevel}` : `تم تفعيل حد الطاقة! المستوى ${energyLimitLevel}`);
  };

  const activateReduceClickTime = () => {
    const cost = reduceClickTimeCost * 2;
    if (balance < cost) {
      showMessage(cost);
      return;
    }

    setClickTime((prev) => Math.max(prev - 500, 200));
    setBalance((prev) => prev - cost);
    localStorage.setItem("balance", (balance - cost).toString());
    setReduceClickTimeCost((prev) => prev * 2);
    setMessage("");
  };

  const showMessage = (cost: number) => {
    setMessage(isEnglish ? `You need ${cost} clicks to activate this!` : `أنت بحاجة إلى ${cost} نقرة لتفعيل هذا!`);
    setTimeout(() => {
      setMessage(""); 
    }, 3000);
  };

  const handleJoinZooClick = () => {
    window.location.href = "https://t.me/zoo_story_bot/game?startapp=ref1409700382"; 
  };

  const renderTaskScreen = () => (
    <div className="w-full bg-black text-white font-bold flex flex-col max-w-xl justify-center items-center p-6">
      <h2 className="text-2xl mb-4">{isEnglish ? "Task" : "المهمة"}</h2>
      {message && (
        <div className="text-red-500 mb-4">
          {message}
        </div>
      )}
      <button
        onClick={handleJoinZooClick}
        className="text-black bg-white py-3 px-8 rounded-full mb-4 flex items-center justify-center"
      >
        {isEnglish ? "Join Zoo" : "الانضمام إلى الحديقة"}
      </button>
      <button
        onClick={handleWatchAdClick}
        className="text-black bg-white py-3 px-8 rounded-full mb-4 flex items-center justify-center"
      >
        {isEnglish ? `Watch Ad` : `شاهد الإعلان`}
      </button>
    </div>
  );

  const renderBoosters = () => (
    <div className="w-full bg-black text-white font-bold flex flex-col max-w-xl justify-center items-center p-6">
      <h2 className="text-2xl mb-4">{isEnglish ? "Boosters" : "المعززات"}</h2>
      {message && (
        <div className="text-red-500 mb-4">
          {message}
        </div>
      )}
      <button onClick={activateMultiply} className="text-black bg-white py-3 px-8 rounded-full mb-4 flex items-center justify-center">
        <FaHandPointer size={20} className="mr-2" />
        {isEnglish ? `Multiply Clicks : LvL ${multiplyClicksLevel}` : `مضاعفة النقرات : المستوى ${multiplyClicksLevel}`}
      </button>
      <button onClick={activateRefill} className="text-black bg-white py-3 px-8 rounded-full mb-4 flex items-center justify-center">
        <FaRedo size={20} className="mr-2" />
        {isEnglish ? `Refill Clicks` : `إعادة تعبئة النقاط`}
      </button>
      <button onClick={activateReduceClickTime} className="text-black bg-white py-3 px-8 rounded-full mb-2 flex items-center justify-center">
        <FaClock size={20} className="mr-2" />
        {isEnglish ? `Reduce Click Time` : `تقليل وقت النقر`}
      </button>
      <button onClick={activateEnergyLimit} className="text-black bg-white py-3 px-8 rounded-full mt-4 flex items-center justify-center">
        <FaBatteryFull size={20} className="mr-2" />
        {isEnglish ? `Energy Limit : LvL ${energyLimitLevel}` : `حد الطاقة : المستوى ${energyLimitLevel}`}
      </button>
    </div>
  );

  const renderHomeScreen = () => (
    <div className="w-full bg-black text-white font-bold flex flex-col max-w-xl justify-center items-center">
      <div className="absolute top-4 right-4 cursor-pointer" onClick={toggleLanguage}>
        <Flag code={isEnglish ? "US" : "SA"} alt="flag" width={30} height={20} />
      </div>

      <div className="text-xl text-white mb-2">
        {isEnglish ? "Balance" : "الرصيد"}: {balance}
      </div>

      {/* Display ad count */}
      <div className="text-lg text-white mb-2">
        {isEnglish ? `Ads Watched: ${adCount}` : `الإعلانات التي تم مشاهدتها: ${adCount}`}
      </div>

      <div className="absolute top-4 left-4 text-xl text-black bg-white border-4 border-white rounded-full px-4 py-2 font-bold">
        {remainingClicks} / {1000}
      </div>

      <div className="text-lg text-white mb-2">
        {isEnglish ? "Clicks Available" : "النقرات المتاحة"}
      </div>

      <h1
        className={`text-3xl font-bold text-black bg-white border-4 border-white rounded-full px-6 py-3 cursor-pointer ${remainingClicks <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={remainingClicks > 0 ? incrementClickCount : undefined}
      >
        {isEnglish ? "Click Me!" : "انقر هنا!"}
      </h1>
    </div>
  );

  return (
    <div className="bg-black flex justify-center items-center h-screen relative overflow-hidden">
      <div className="floating-stars">
        {[...Array(30)].map((_, index) => (
          <div
            key={index}
            className="star"
            style={{
              animationDelay: `${Math.random() * 10}s`,
              fontSize: `${Math.random() * 20 + 15}px`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 5}s`,
            }}
          >
            ✨
          </div>
        ))}
      </div>

      {clickedElement === "tasks" ? renderTaskScreen() : boostersActive ? renderBoosters() : renderHomeScreen()}

      <div className="absolute bottom-6 left-10 flex flex-col items-center p-2 cursor-pointer transition-all duration-200 home-button"
        onClick={() => {
          setClickedElement("home");
          setBoostersActive(false);
        }}
      >
        <FaHome size={28} />
        <span className="text-sm mt-1">{isEnglish ? "Home" : "الصفحة الرئيسية"}</span>
      </div>

      <div className="absolute bottom-6 left-24 flex flex-col items-center p-2 cursor-pointer transition-all duration-200"
        onClick={() => setBoostersActive(!boostersActive)}
      >
        <FaRocket size={28} />
        <span className="text-sm mt-1">{isEnglish ? "Boosters" : "المعززات"}</span>
      </div>
      <div className="absolute bottom-6 left-40 flex flex-col items-center p-2 cursor-pointer transition-all duration-200"
        onClick={() => {
          setClickedElement("tasks");
          setBoostersActive(false);
        }}
      >
        <FaClipboardList size={28} />
        <span className="text-sm mt-1">{isEnglish ? "Tasks" : "المهام"}</span>
      </div>
    </div>
  );
}

export default App;
