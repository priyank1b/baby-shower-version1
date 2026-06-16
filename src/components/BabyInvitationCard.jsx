import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Sparkles, Send, CheckCircle2, User, Heart, Compass, ClipboardList, Trash2, Key } from "lucide-react";
import confetti from "canvas-confetti";

function BabyInvitationCard({ onWishAdded }) {
  const [activeSection, setActiveSection] = useState("invitation");
  
  // RSVP Form States
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpAttending, setRsvpAttending] = useState("yes");
  const [rsvpPrediction, setRsvpPrediction] = useState("Surprise");
  const [rsvpMocktail, setRsvpMocktail] = useState("Lavender Lemonade");
  const [rsvpNotes, setRsvpNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Wishboard States
  const [wishName, setWishName] = useState("");
  const [wishText, setWishText] = useState("");
  const [isHangingStar, setIsHangingStar] = useState(false);
  const [wishSuccess, setWishSuccess] = useState(false);
  
  // Dashboard Admin State
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [rsvpList, setRsvpList] = useState([]);
  const [wishesList, setWishesList] = useState([]);

  // Countdown State (Event Date: Sunday, August 16, 2026)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const targetDate = new Date("2026-08-16T15:00:00+05:30");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load RSVPs & Wishes
  const loadData = () => {
    const rsvps = localStorage.getItem("celestial_rsvps");
    const wishes = localStorage.getItem("celestial_wishes");
    setRsvpList(rsvps ? JSON.parse(rsvps) : []);
    setWishesList(wishes ? JSON.parse(wishes) : []);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Hang a Star on the Wishboard
  const handleWishSubmit = (e) => {
    e.preventDefault();
    if (!wishName.trim() || !wishText.trim()) return;

    setIsHangingStar(true);

    setTimeout(() => {
      const newWish = {
        id: Date.now(),
        name: wishName,
        notes: wishText,
        date: new Date().toLocaleString()
      };

      const existingWishes = JSON.parse(localStorage.getItem("celestial_wishes") || "[]");
      const updatedWishes = [newWish, ...existingWishes];
      localStorage.setItem("celestial_wishes", JSON.stringify(updatedWishes));
      
      setWishesList(updatedWishes);
      onWishAdded && onWishAdded(updatedWishes); // Notify parent to redraw canvas

      setIsHangingStar(false);
      setWishSuccess(true);
      
      // Celestial star-shaped confetti spray
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.65 },
        colors: ["#a855f7", "#fef08a", "#fae8ff", "#ffd1d1"]
      });

      // Reset fields
      setWishName("");
      setWishText("");

      setTimeout(() => setWishSuccess(false), 3000);
    }, 1200);
  };

  // Handle RSVP Submit
  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newRsvp = {
        id: Date.now(),
        name: rsvpName,
        attending: rsvpAttending,
        prediction: rsvpAttending === "yes" ? rsvpPrediction : "N/A",
        mocktail: rsvpAttending === "yes" ? rsvpMocktail : "N/A",
        notes: rsvpNotes,
        date: new Date().toLocaleString()
      };

      const existingRsvps = JSON.parse(localStorage.getItem("celestial_rsvps") || "[]");
      const updatedRsvps = [newRsvp, ...existingRsvps];
      localStorage.setItem("celestial_rsvps", JSON.stringify(updatedRsvps));
      setRsvpList(updatedRsvps);

      setIsSubmitting(false);
      setIsSubmitted(true);
      
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#c084fc", "#fde047", "#ffffff"]
      });
    }, 1200);
  };

  // Clear data for testing convenience
  const clearData = () => {
    if (window.confirm("Are you sure you want to clear all Guest logs?")) {
      localStorage.removeItem("celestial_rsvps");
      localStorage.removeItem("celestial_wishes");
      setRsvpList([]);
      setWishesList([]);
      onWishAdded && onWishAdded([]);
    }
  };

  // Google Calendar Link generator
  const getGoogleCalendarLink = () => {
    const title = encodeURIComponent("Raghav & Tanya's Celestial Baby Shower");
    const dates = "20260816T093000Z/20260816T133000Z"; // UTC time equivalent for 3pm to 7pm IST
    const details = encodeURIComponent("You are cordially invited to celebrate the upcoming arrival of Baby Sharma at our celestial-themed baby shower.");
    const location = encodeURIComponent("The Greenhouse Conservatory, Eden Meadows");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}&sf=true&output=xml`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-[92vw] max-w-xl h-[85vh] bg-[#0f0e26]/85 backdrop-blur-lg rounded-3xl border border-purple-500/25 shadow-2xl relative flex flex-col overflow-hidden text-slate-200 z-30"
      style={{
        boxShadow: "0 0 40px rgba(168,85,247,0.15)"
      }}
    >
      {/* Decorative Gold Filigree Corner Overlays */}
      <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-amber-300/30 rounded-tl-2xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-amber-300/30 rounded-tr-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-amber-300/30 rounded-bl-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-amber-300/30 rounded-br-2xl pointer-events-none" />

      {/* Tabs Header Navigation */}
      <div className="flex justify-around border-b border-purple-500/15 py-4 bg-slate-950/60">
        <button
          onClick={() => { setActiveSection("invitation"); setShowAdmin(false); }}
          className={`font-playfair text-xs tracking-widest transition-all focus:outline-none ${activeSection === "invitation" && !showAdmin ? "text-amber-300 font-bold" : "text-slate-400 hover:text-slate-200"}`}
        >
          Invitation
        </button>
        <button
          onClick={() => { setActiveSection("details"); setShowAdmin(false); }}
          className={`font-playfair text-xs tracking-widest transition-all focus:outline-none ${activeSection === "details" && !showAdmin ? "text-amber-300 font-bold" : "text-slate-400 hover:text-slate-200"}`}
        >
          Details
        </button>
        <button
          onClick={() => { setActiveSection("wishboard"); setShowAdmin(false); }}
          className={`font-playfair text-xs tracking-widest transition-all focus:outline-none ${activeSection === "wishboard" && !showAdmin ? "text-amber-300 font-bold" : "text-slate-400 hover:text-slate-200"}`}
        >
          Wishboard
        </button>
        <button
          onClick={() => { setActiveSection("rsvp"); setShowAdmin(false); }}
          className={`font-playfair text-xs tracking-widest transition-all focus:outline-none ${activeSection === "rsvp" && !showAdmin ? "text-amber-300 font-bold" : "text-slate-400 hover:text-slate-200"}`}
        >
          RSVP
        </button>
      </div>

      {/* Scrollable Main Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 flex flex-col justify-between">
        
        {/* Admin Dashboard Area */}
        {showAdmin ? (
          <div className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-3 mb-4">
                <h3 className="font-playfair text-amber-300 tracking-wider flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" /> Guest Responses & Wishes
                </h3>
                <button
                  onClick={() => setShowAdmin(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>

              {!isAdminUnlocked ? (
                <div className="py-12 text-center">
                  <Key className="w-10 h-10 text-purple-400 mx-auto mb-4 animate-bounce" />
                  <p className="font-playfair text-lg italic text-slate-300 mb-4">Enter Password to Unlock Panel</p>
                  <div className="flex justify-center gap-2 max-w-xs mx-auto">
                    <input
                      type="password"
                      placeholder="Admin Code"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="bg-slate-905 border border-purple-500/30 rounded-xl px-3 py-1.5 text-sm w-full focus:outline-none focus:border-purple-400 text-center"
                    />
                    <button
                      onClick={() => {
                        if (adminPassword.toLowerCase() === "admin" || adminPassword === "baby" || adminPassword === "") {
                          setIsAdminUnlocked(true);
                          loadData();
                        } else {
                          alert("Invalid Admin Password");
                        }
                      }}
                      className="bg-purple-600 hover:bg-purple-500 px-4 py-1.5 rounded-xl text-sm text-white font-semibold font-quicksand"
                    >
                      Unlock
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2">Hint: You can just click Unlock with blank password for testing</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">RSVPs: {rsvpList.length} | Wishes: {wishesList.length}</span>
                    <button
                      onClick={clearData}
                      className="flex items-center gap-1 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Clear All Data
                    </button>
                  </div>

                  {/* RSVPs Table */}
                  <div className="space-y-2">
                    <h4 className="font-playfair text-amber-200 text-xs tracking-wider uppercase">Guestlist RSVP</h4>
                    <div className="overflow-x-auto border border-purple-500/10 rounded-xl max-h-40 overflow-y-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-950/80 border-b border-purple-500/15 text-amber-300 font-playfair">
                            <th className="p-2.5">Name</th>
                            <th className="p-2.5">Status</th>
                            <th className="p-2.5">Guess</th>
                            <th className="p-2.5">Mocktail</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rsvpList.length === 0 ? (
                            <tr>
                              <td colSpan="4" className="p-4 text-center text-slate-500 italic">No responses yet.</td>
                            </tr>
                          ) : (
                            rsvpList.map((rsvp) => (
                              <tr key={rsvp.id} className="border-b border-slate-950 hover:bg-slate-950/30">
                                <td className="p-2.5 font-semibold text-white">{rsvp.name}</td>
                                <td className="p-2.5">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${rsvp.attending === "yes" ? "bg-emerald-950 text-emerald-400" : "bg-red-950 text-red-400"}`}>
                                    {rsvp.attending === "yes" ? "Yes" : "No"}
                                  </span>
                                </td>
                                <td className="p-2.5 text-purple-300">{rsvp.prediction}</td>
                                <td className="p-2.5 text-slate-400">{rsvp.mocktail}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Wishes List */}
                  <div className="space-y-2">
                    <h4 className="font-playfair text-amber-200 text-xs tracking-wider uppercase">Star Wishes</h4>
                    <div className="border border-purple-500/10 rounded-xl p-3 bg-slate-950/50 max-h-40 overflow-y-auto space-y-2 text-xs">
                      {wishesList.length === 0 ? (
                        <p className="text-slate-500 italic text-center">No wishes left yet.</p>
                      ) : (
                        wishesList.map((w) => (
                          <div key={w.id} className="border-b border-slate-900 pb-2 last:border-0 last:pb-0">
                            <div className="flex justify-between font-semibold text-amber-200">
                              <span>{w.name}</span>
                              <span className="text-[10px] text-slate-500">{w.date ? w.date.split(",")[0] : ""}</span>
                            </div>
                            <p className="text-slate-350 italic mt-0.5">"{w.notes}"</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={() => { setShowAdmin(false); setIsAdminUnlocked(false); setAdminPassword(""); }}
              className="mt-6 w-full py-2 bg-slate-950 border border-purple-500/30 rounded-xl text-purple-200 text-xs font-playfair hover:bg-slate-900"
            >
              Back to Invitation
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            
            {/* INVITATION SECTION */}
            {activeSection === "invitation" && (
              <motion.div
                key="invitation"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center text-center space-y-6 flex-1 py-4 justify-center"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <Sparkles className="w-8 h-8 text-amber-300 animate-pulse mx-auto" />
                </motion.div>

                <div className="space-y-1">
                  <h5 className="font-playfair text-amber-200 text-xs tracking-[0.3em] uppercase">
                    A Little Star is on the Way
                  </h5>
                  <p className="font-quicksand text-sm text-slate-400 uppercase tracking-widest mt-1">
                    Celebrate With Us
                  </p>
                </div>

                <div className="space-y-1">
                  <h1 className="font-greatvibes text-6xl text-purple-300 drop-shadow-[0_2px_12px_rgba(168,85,247,0.2)]">
                    Tanya & Raghav's
                  </h1>
                  <h2 className="font-playfair text-xl sm:text-2xl tracking-[0.2em] text-white">
                    CELESTIAL BABY SHOWER
                  </h2>
                </div>

                <div className="w-24 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

                <p className="font-quicksand text-sm sm:text-md text-slate-350 leading-relaxed max-w-md">
                  Join us under a canopy of starlight for an afternoon of cozy celebration, blessings, and celestial joy as we anticipate the arrival of our sweetest little moonlit blessing.
                </p>

                <div className="pt-2 text-center">
                  <p className="font-playfair text-[9px] text-amber-300 tracking-widest uppercase">Hostesses</p>
                  <p className="font-quicksand text-md text-purple-200 font-semibold">Tanya Sharma & Family</p>
                </div>

                <button
                  onClick={() => setActiveSection("details")}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600/35 to-purple-700/35 border border-purple-500/50 text-purple-200 rounded-full font-playfair text-xs tracking-widest hover:from-purple-600 hover:to-purple-700 hover:text-white transition-all hover:scale-105"
                >
                  Explore Details
                </button>
              </motion.div>
            )}

            {/* DETAILS SECTION */}
            {activeSection === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="space-y-5 flex-1 py-1"
              >
                {/* Active Countdown */}
                <div className="bg-slate-950/60 border border-purple-500/20 rounded-2xl p-4 text-center">
                  <h4 className="font-playfair text-amber-200 text-xs tracking-widest uppercase mb-3">Time Until Starlit Arrival</h4>
                  <div className="grid grid-cols-4 gap-2 text-center max-w-xs mx-auto">
                    <div className="bg-slate-900/40 p-2 rounded-xl border border-purple-500/10">
                      <span className="block font-playfair text-xl text-white font-bold">{timeLeft.days}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-quicksand">Days</span>
                    </div>
                    <div className="bg-slate-900/40 p-2 rounded-xl border border-purple-500/10">
                      <span className="block font-playfair text-xl text-white font-bold">{timeLeft.hours}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-quicksand">Hours</span>
                    </div>
                    <div className="bg-slate-900/40 p-2 rounded-xl border border-purple-500/10">
                      <span className="block font-playfair text-xl text-white font-bold">{timeLeft.minutes}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-quicksand">Mins</span>
                    </div>
                    <div className="bg-slate-900/40 p-2 rounded-xl border border-purple-500/10">
                      <span className="block font-playfair text-xl text-white font-bold">{timeLeft.seconds}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-quicksand">Secs</span>
                    </div>
                  </div>
                </div>

                {/* Event Schedule Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Date & Time */}
                  <div className="border border-purple-500/10 bg-slate-950/30 rounded-2xl p-4 flex gap-3 items-start">
                    <Calendar className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-playfair text-white text-xs tracking-wider uppercase mb-1">Date & Time</h4>
                      <p className="font-quicksand text-sm text-purple-200 font-semibold">Sunday, August 16, 2026</p>
                      <p className="font-quicksand text-xs text-slate-400 italic">3:00 PM to 6:00 PM IST</p>
                      <a
                        href={getGoogleCalendarLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-xs text-amber-300 hover:text-amber-200 font-semibold font-quicksand"
                      >
                        + Add to Google Calendar
                      </a>
                    </div>
                  </div>

                  {/* Venue */}
                  <div className="border border-purple-500/10 bg-slate-950/30 rounded-2xl p-4 flex gap-3 items-start">
                    <MapPin className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-playfair text-white text-xs tracking-wider uppercase mb-1">The Sanctuary</h4>
                      <p className="font-quicksand text-sm text-purple-200 font-semibold">Greenhouse Conservatory</p>
                      <p className="font-quicksand text-xs text-slate-400">Eden Meadows, Vasant Kunj, New Delhi</p>
                      <a
                        href="https://maps.google.com/?q=Vasant+Kunj+New+Delhi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-xs text-amber-300 hover:text-amber-200 font-semibold font-quicksand"
                      >
                        Get Directions
                      </a>
                    </div>
                  </div>
                </div>

                {/* Dress Code Section */}
                <div className="border border-purple-500/10 bg-slate-950/30 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-playfair text-white text-xs tracking-wider uppercase">Theme Guidelines</h4>
                    <span className="text-[9px] text-amber-300 tracking-wider uppercase font-quicksand">Starlit Clouds</span>
                  </div>
                  <p className="font-quicksand text-xs text-slate-350 leading-relaxed">
                    We invite you to dress in cozy pastel colors (creams, baby lavender, pastel blues, or gold accents) to match the celestial afternoon.
                  </p>
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => setActiveSection("wishboard")}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600/35 to-purple-700/35 border border-purple-500/50 text-purple-200 rounded-full font-playfair text-xs tracking-widest hover:from-purple-600 hover:to-purple-700 hover:text-white transition-all hover:scale-105"
                  >
                    Go to Wishboard
                  </button>
                </div>
              </motion.div>
            )}

            {/* WISHBOARD SECTION */}
            {activeSection === "wishboard" && (
              <motion.div
                key="wishboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 flex-1 py-1"
              >
                <div className="text-center border-b border-purple-500/10 pb-2">
                  <h3 className="font-playfair text-amber-200 text-xs tracking-widest uppercase">Celestial Wishboard</h3>
                  <p className="font-quicksand text-[11px] text-slate-450 mt-1 leading-relaxed">
                    Type a wish or blessing for the baby. Your message will become a glowing star in the sky background. Click the star later to read it!
                  </p>
                </div>

                {wishSuccess ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-12 space-y-2"
                  >
                    <CheckCircle2 className="w-12 h-12 text-amber-300 mx-auto" />
                    <h4 className="font-playfair text-white text-md tracking-wider">Your Star is Hung!</h4>
                    <p className="font-quicksand text-xs text-slate-350 max-w-xs mx-auto">
                      Look around the sky background. A new glowing star is shining with your name and message. Click it to read!
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleWishSubmit} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-playfair tracking-wider text-slate-400 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-purple-400" /> Your Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="E.g., Simran Sengupta"
                        value={wishName}
                        onChange={(e) => setWishName(e.target.value)}
                        className="w-full bg-slate-950/60 border border-purple-500/20 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-purple-450 text-white font-quicksand placeholder:text-slate-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-playfair tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-purple-400" /> Wish / Blessing
                      </label>
                      <textarea
                        rows="3"
                        required
                        placeholder="E.g., May your life be filled with stars, laughter, and endless dreams! So happy for you..."
                        value={wishText}
                        onChange={(e) => setWishText(e.target.value)}
                        className="w-full bg-slate-950/60 border border-purple-500/20 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-purple-450 text-white font-quicksand placeholder:text-slate-600 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isHangingStar}
                      className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-purple-650 hover:from-purple-450 hover:to-purple-550 disabled:opacity-50 text-white font-semibold font-playfair tracking-widest text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                    >
                      {isHangingStar ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          Hang My Star <Sparkles className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => setActiveSection("rsvp")}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600/35 to-purple-700/35 border border-purple-500/50 text-purple-200 rounded-full font-playfair text-xs tracking-widest hover:from-purple-600 hover:to-purple-700 hover:text-white transition-all hover:scale-105"
                  >
                    Proceed to RSVP
                  </button>
                </div>
              </motion.div>
            )}

            {/* RSVP SECTION */}
            {activeSection === "rsvp" && (
              <motion.div
                key="rsvp"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 flex-1 py-1"
              >
                {isSubmitted ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-12 space-y-4"
                  >
                    <CheckCircle2 className="w-14 h-14 text-amber-300 mx-auto" />
                    <h3 className="font-playfair text-white text-lg tracking-wider">RSVP Received</h3>
                    <p className="font-quicksand text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                      Thank you! Your attendance and sweet predictions have been securely logged. Tanya & Raghav are excited to share this celestial afternoon with you.
                    </p>
                    <button
                      onClick={() => { setIsSubmitted(false); setRsvpName(""); setRsvpNotes(""); }}
                      className="px-4 py-1.5 bg-slate-950 border border-purple-500/20 hover:border-purple-400 rounded-xl text-purple-300 text-xs font-quicksand transition-all"
                    >
                      Update / Submit Another
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleRsvpSubmit} className="space-y-3">
                    <div className="text-center border-b border-purple-500/10 pb-2">
                      <h3 className="font-playfair text-amber-200 text-xs tracking-widest uppercase">Response Form</h3>
                      <p className="font-quicksand text-[10px] text-slate-400 italic">Please RSVP by August 1, 2026</p>
                    </div>

                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-playfair tracking-wider text-slate-400 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-purple-400" /> Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="E.g., Dev Patel"
                        value={rsvpName}
                        onChange={(e) => setRsvpName(e.target.value)}
                        className="w-full bg-slate-950/60 border border-purple-500/20 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-purple-400 text-white font-quicksand placeholder:text-slate-650"
                      />
                    </div>

                    {/* Attendance */}
                    <div className="space-y-1">
                      <label className="text-xs font-playfair tracking-wider text-slate-400">Attendance</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setRsvpAttending("yes")}
                          className={`py-1.5 rounded-xl text-xs font-playfair border transition-all ${rsvpAttending === "yes" ? "bg-purple-600/20 border-purple-400 text-purple-300 font-bold animate-pulse" : "bg-slate-950/30 border-slate-800 text-slate-400 hover:border-slate-700"}`}
                        >
                          Will Attend
                        </button>
                        <button
                          type="button"
                          onClick={() => setRsvpAttending("no")}
                          className={`py-1.5 rounded-xl text-xs font-playfair border transition-all ${rsvpAttending === "no" ? "bg-red-950/20 border-red-800/80 text-red-300 font-bold" : "bg-slate-950/30 border-slate-800 text-slate-400 hover:border-slate-700"}`}
                        >
                          Cannot Attend
                        </button>
                      </div>
                    </div>

                    {/* Reveal Options If Attending */}
                    <AnimatePresence>
                      {rsvpAttending === "yes" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3 overflow-hidden"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            {/* Gender Guess */}
                            <div className="space-y-1">
                              <label className="text-xs font-playfair tracking-wider text-slate-400 flex items-center gap-1.5">
                                <Compass className="w-3.5 h-3.5 text-purple-400" /> Baby Prediction
                              </label>
                              <select
                                value={rsvpPrediction}
                                onChange={(e) => setRsvpPrediction(e.target.value)}
                                className="w-full bg-slate-950/80 border border-purple-500/20 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-purple-450 text-white font-quicksand"
                              >
                                <option value="Boy">Team Boy 💙</option>
                                <option value="Girl">Team Girl 💗</option>
                                <option value="Surprise">Keep it a Surprise 💛</option>
                                <option value="Twins">Double Trouble! ✧</option>
                              </select>
                            </div>

                            {/* Welcome Drinks Mocktail choice */}
                            <div className="space-y-1">
                              <label className="text-xs font-playfair tracking-wider text-slate-400 flex items-center gap-1.5">
                                <Heart className="w-3.5 h-3.5 text-purple-400" /> Cozy Mocktail
                              </label>
                              <select
                                value={rsvpMocktail}
                                onChange={(e) => setRsvpMocktail(e.target.value)}
                                className="w-full bg-slate-950/80 border border-purple-500/20 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-purple-450 text-white font-quicksand"
                              >
                                <option value="Lavender Lemonade">Lavender Lemonade</option>
                                <option value="Peach Spritzer">Peach Spritz</option>
                                <option value="Coconut Rose Colada">Coconut Rose Colada</option>
                              </select>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Note */}
                    <div className="space-y-1">
                      <label className="text-xs font-playfair tracking-wider text-slate-400">Dietary Needs / Message</label>
                      <textarea
                        rows="1.5"
                        placeholder="E.g., Any food allergies or special requests..."
                        value={rsvpNotes}
                        onChange={(e) => setRsvpNotes(e.target.value)}
                        className="w-full bg-slate-950/60 border border-purple-500/20 rounded-xl px-4 py-1.5 text-xs focus:outline-none focus:border-purple-400 text-white font-quicksand placeholder:text-slate-650 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 disabled:opacity-50 text-white font-semibold font-playfair tracking-widest text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                    >
                      {isSubmitting ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          Send RSVP <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}

      </div>

      {/* Footer */}
      <div className="border-t border-purple-500/10 py-3 bg-slate-950 px-6 flex justify-between items-center text-[10px] text-slate-500 font-quicksand">
        <span>Celestial Dreams ✦ Raghav & Tanya</span>
        
        {/* Discreet key to open Guest Dashboard */}
        <button
          onClick={() => { setShowAdmin(true); loadData(); }}
          className="text-slate-700 hover:text-purple-400 transition-colors flex items-center gap-1"
          title="Guest Responses Panel"
        >
          <Key className="w-3 h-3" />
        </button>
      </div>

    </motion.div>
  );
}

export default BabyInvitationCard;
