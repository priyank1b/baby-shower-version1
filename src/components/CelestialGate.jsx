import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function CelestialGate({ onOpen }) {
  const [isOpened, setIsOpened] = useState(false);
  const [isClickable, setIsClickable] = useState(true);

  const handleOpen = () => {
    if (!isClickable) return;
    setIsClickable(false);
    setIsOpened(true);
    
    // Let the gate swinging transition complete before updating parent layout
    setTimeout(() => {
      onOpen && onOpen();
    }, 1800);
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-[#070512] overflow-hidden">
      
      {/* Background celestial glow behind gate */}
      <div className="absolute w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[140px] -z-10" />

      {/* Instructional header */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.8 }}
            className="absolute top-[12%] text-center px-4 z-40"
          >
            <h2 className="font-playfair text-amber-200 text-sm tracking-[0.4em] uppercase mb-2">
              A Starlit Beginning
            </h2>
            <p className="font-quicksand text-md text-slate-300">
              Touch the crescent moon to open the celestial gates
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main 3D Gate Wrapper */}
      <div className="relative w-80 sm:w-96 h-[65vh] flex items-center justify-center z-30" style={{ perspective: 1200 }}>
        
        {/* Left Gate Panel */}
        <motion.div
          className="absolute top-0 left-0 w-1/2 h-full bg-slate-950 border-y-2 border-l-2 border-amber-500/30 rounded-l-2xl origin-left z-20 shadow-2xl flex items-center justify-end overflow-hidden"
          style={{ transformStyle: "preserve-3d" }}
          animate={isOpened ? { rotateY: -110 } : { rotateY: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        >
          {/* Filigree Details (Gold patterns and stars) */}
          <div className="absolute inset-4 border border-amber-500/15 rounded-l-xl flex flex-col justify-between p-4 pointer-events-none">
            <div className="text-amber-500/20 text-xs font-playfair font-bold">✧</div>
            <div className="text-right text-amber-500/20 text-xl font-playfair">✦</div>
            <div className="text-amber-500/20 text-xs font-playfair font-bold">✧</div>
          </div>
          {/* Left crescent moon half */}
          <div className="w-12 h-24 border-r border-amber-500/20 bg-slate-950 flex items-center justify-end pr-1 z-30" />
        </motion.div>

        {/* Right Gate Panel */}
        <motion.div
          className="absolute top-0 right-0 w-1/2 h-full bg-slate-950 border-y-2 border-r-2 border-amber-500/30 rounded-r-2xl origin-right z-20 shadow-2xl flex items-center justify-start overflow-hidden"
          style={{ transformStyle: "preserve-3d" }}
          animate={isOpened ? { rotateY: 110 } : { rotateY: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        >
          {/* Filigree Details */}
          <div className="absolute inset-4 border border-amber-500/15 rounded-r-xl flex flex-col justify-between p-4 pointer-events-none">
            <div className="text-right text-amber-500/20 text-xs font-playfair font-bold">✧</div>
            <div className="text-left text-amber-500/20 text-xl font-playfair">✦</div>
            <div className="text-right text-amber-500/20 text-xs font-playfair font-bold">✧</div>
          </div>
          {/* Right crescent moon half */}
          <div className="w-12 h-24 border-l border-amber-500/20 bg-slate-950 flex items-center justify-start pl-1 z-30" />
        </motion.div>

        {/* CRESCENT MOON LOCK (Centered between panels) */}
        <AnimatePresence>
          {!isOpened && (
            <motion.div
              className="absolute z-30 cursor-pointer flex items-center justify-center"
              onClick={handleOpen}
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              exit={{ 
                scale: 1.8, 
                opacity: 0, 
                filter: "blur(5px)",
                transition: { duration: 0.6 }
              }}
            >
              {/* Moon Glow */}
              <motion.div
                className="absolute w-20 h-20 bg-purple-500/25 rounded-full blur-lg"
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
              />

              {/* Gold Crescent Moon Lock */}
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.6)] border-2 border-amber-200 flex items-center justify-center relative">
                {/* Crescent Overlay to create moon shape visually inside */}
                <div className="absolute top-1 right-1 w-11 h-11 bg-slate-950 rounded-full border-l border-amber-300/40" />
                
                {/* Stamp details */}
                <span className="font-playfair font-bold text-amber-200 text-xs absolute left-3 z-10">✦</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default CelestialGate;
