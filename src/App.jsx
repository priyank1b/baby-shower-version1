import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CelestialBackground from "./components/CelestialBackground";
import AudioPlayer from "./components/AudioPlayer";
import CelestialGate from "./components/CelestialGate";
import BabyInvitationCard from "./components/BabyInvitationCard";

function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [wishes, setWishes] = useState([]);

  // Load guest star wishes from localstorage on mount
  useEffect(() => {
    const localWishes = localStorage.getItem("celestial_wishes");
    if (localWishes) {
      setWishes(JSON.parse(localWishes));
    } else {
      // Seed a couple of pretty starter stars in the sky
      const starterWishes = [
        { id: 1, name: "Aunt Maya", notes: "Sending all our love and blessings to the sweet little star!", date: new Date().toLocaleString() },
        { id: 2, name: "Uncle Dev", notes: "We can't wait to hold the baby! Congratulations Tanya & Raghav! 🌟", date: new Date().toLocaleString() }
      ];
      localStorage.setItem("celestial_wishes", JSON.stringify(starterWishes));
      setWishes(starterWishes);
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#0b0a1a] flex items-center justify-center overflow-hidden">
      {/* 1. Interactive star wish background */}
      <CelestialBackground wishes={wishes} />

      {/* 2. Cozy lullaby audio player */}
      <AudioPlayer isGateOpened={isOpened} />

      {/* 3. Gate to Card state transitions */}
      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div
            key="gate-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full flex items-center justify-center"
          >
            <CelestialGate onOpen={() => setIsOpened(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="card-view"
            initial={{ opacity: 0, y: 120 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -120 }}
            transition={{ type: "spring", stiffness: 45, damping: 15, delay: 0.2 }}
            className="w-full h-full flex items-center justify-center p-4 relative z-10"
          >
            <BabyInvitationCard onWishAdded={(updatedWishes) => setWishes(updatedWishes)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
