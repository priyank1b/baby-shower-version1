import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";

function CelestialBackground({ wishes = [] }) {
  const canvasRef = useRef(null);
  const [activeStar, setActiveStar] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState([]);

  // Distribute guest wishes as interactive stars on the canvas
  useEffect(() => {
    const initializedStars = wishes.map((wish, index) => {
      // Deterministic positioning based on id or index so they stay in place
      const seed = wish.id || index;
      
      // Compute deterministic percentages (between 5% and 95%)
      let pctX = 0.05 + ((seed * 19) % 90) / 100;
      let pctY = 0.05 + ((seed * 37) % 90) / 100;

      // Keep stars away from the central card area (width: 30%-70%, height: 15%-85%)
      if (pctX > 0.3 && pctX < 0.7 && pctY > 0.15 && pctY < 0.85) {
        pctX = pctX < 0.5 ? pctX - 0.25 : pctX + 0.25;
      }

      return {
        id: wish.id || index,
        pctX,
        pctY,
        size: Math.random() * 4 + 4, // interactive stars are larger (8-12px glow)
        name: wish.name,
        notes: wish.notes || "Sent warm wishes! 🌟",
        twinkleSpeed: 0.02 + (Math.random() * 0.03),
        phase: Math.random() * Math.PI,
        color: ["#fde047", "#fef08a", "#c084fc", "#e9d5ff"][index % 4], // gold/purple pastels
      };
    });

    setStars(initializedStars);
  }, [wishes]);

  // Main canvas animation loop (twinkling background particles + drawing guest stars)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId;
    let bgParticles = [];
    const bgParticleCount = 100;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Small ambient background stars
    for (let i = 0; i < bgParticleCount; i++) {
      bgParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: 0.005 + Math.random() * 0.015,
        phase: Math.random() * Math.PI * 2
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw small ambient background stars
      bgParticles.forEach((p) => {
        p.phase += p.twinkleSpeed;
        const currentOpacity = Math.abs(Math.sin(p.phase)) * p.opacity;
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw interactive guest stars
      stars.forEach((s) => {
        s.phase += s.twinkleSpeed;
        const currentOpacity = 0.4 + Math.abs(Math.sin(s.phase)) * 0.6;
        
        ctx.save();
        ctx.shadowBlur = s.size * 2.5;
        ctx.shadowColor = s.color;

        // Draw star aura
        ctx.fillStyle = s.color;
        ctx.globalAlpha = currentOpacity;
        ctx.beginPath();
        
        // Draw 4-point star shape
        const cx = s.pctX * canvas.width;
        const cy = s.pctY * canvas.height;
        const spikes = 4;
        const outerRadius = s.size;
        const innerRadius = s.size / 2.5;
        
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
          x = cx + Math.cos(rot) * outerRadius;
          y = cy + Math.sin(rot) * outerRadius;
          ctx.lineTo(x, y);
          rot += step;

          x = cx + Math.cos(rot) * innerRadius;
          y = cy + Math.sin(rot) * innerRadius;
          ctx.lineTo(x, y);
          rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [stars]);

  // Handle click on canvas to identify clicked guest star
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Find if clicked near any star
    let foundStar = null;
    for (let s of stars) {
      const starX = s.pctX * canvas.width;
      const starY = s.pctY * canvas.height;
      const distance = Math.sqrt(Math.pow(clickX - starX, 2) + Math.pow(clickY - starY, 2));
      // Increased buffer to 35px for highly reliable tap/click registration
      if (distance < 35) {
        foundStar = s;
        break;
      }
    }

    if (foundStar) {
      setActiveStar(foundStar);
      setTooltipPos({ 
        x: foundStar.pctX * canvas.width, 
        y: foundStar.pctY * canvas.height 
      });
    } else {
      setActiveStar(null);
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      {/* Drifting Clouds (Pastel Lavender and Peach glowing clouds) */}
      <div className="absolute -top-[15%] -left-[10%] w-[60%] h-[50%] rounded-full bg-purple-950/20 blur-[120px] drift-cloud-left pointer-events-none" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[65%] h-[55%] rounded-full bg-amber-950/10 blur-[130px] drift-cloud-right pointer-events-none" />
      <div className="absolute top-[40%] right-[-15%] w-[45%] h-[45%] rounded-full bg-indigo-950/25 blur-[100px] drift-cloud-left pointer-events-none" />

      {/* Interactive canvas layer */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="absolute inset-0 w-full h-full pointer-events-auto cursor-pointer"
      />

      {/* Star Wish Modal/Tooltip */}
      <AnimatePresence>
        {activeStar && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            className="absolute z-50 pointer-events-auto bg-slate-950/95 border border-purple-500/40 rounded-2xl p-4 shadow-2xl text-xs w-56 font-quicksand text-slate-200"
            style={{
              left: tooltipPos.x < window.innerWidth - 250 ? tooltipPos.x + 15 : tooltipPos.x - 240,
              top: tooltipPos.y < window.innerHeight - 150 ? tooltipPos.y - 40 : tooltipPos.y - 140,
              boxShadow: "0 0 30px rgba(168,85,247,0.3)"
            }}
          >
            <div className="flex justify-between items-start mb-2 border-b border-purple-500/20 pb-1">
              <span className="font-bold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> {activeStar.name}
              </span>
              <button
                onClick={() => setActiveStar(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="italic text-slate-300 leading-relaxed font-medium">
              "{activeStar.notes}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CelestialBackground;
