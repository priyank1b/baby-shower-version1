import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function AudioPlayer({ isGateOpened }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Soothing ambient guitar track for celestial baby shower cozy atmosphere
  const audioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3";

  useEffect(() => {
    if (isGateOpened && !hasInteracted) {
      const playAudio = async () => {
        try {
          if (audioRef.current) {
            audioRef.current.volume = 0.25; // soft, subtle volume
            await audioRef.current.play();
            setIsPlaying(true);
            setHasInteracted(true);
          }
        } catch (err) {
          console.log("Autoplay blocked. Waiting for user input.", err);
        }
      };
      playAudio();
    }
  }, [isGateOpened, hasInteracted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log(err));
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        preload="auto"
      />
      <motion.button
        onClick={togglePlay}
        className="flex items-center gap-2 px-3 py-2 bg-slate-950/80 backdrop-blur-md border border-purple-500/30 text-purple-200 rounded-full shadow-lg hover:bg-slate-900 transition-colors focus:outline-none"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="sound-on"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center gap-1.5"
            >
              <Volume2 className="w-4 h-4 text-purple-400" />
              {/* Visualizer bars */}
              <div className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 bg-purple-400 rounded-full animate-bounce h-full" style={{ animationDelay: '0.1s', animationDuration: '0.7s' }}></span>
                <span className="w-0.5 bg-purple-400 rounded-full animate-bounce h-full" style={{ animationDelay: '0.3s', animationDuration: '0.9s' }}></span>
                <span className="w-0.5 bg-purple-400 rounded-full animate-bounce h-full" style={{ animationDelay: '0.2s', animationDuration: '0.6s' }}></span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="sound-off"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center gap-1.5"
            >
              <VolumeX className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500 font-quicksand">Lullaby Off</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

export default AudioPlayer;
