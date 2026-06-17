import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Watermark() {
  const containerRef = useRef(null);
  const observerRef = useRef(null);
  const intervalRef = useRef(null);

  const checkTampering = () => {
    // 1. Validate Outer Full-Screen Overlay Container
    const overlay = document.getElementById('nivo-watermark-overlay');
    if (!overlay) {
      console.warn("Watermark security: overlay container removed.");
      return true; 
    }

    if (overlay.parentNode !== document.body) {
      console.warn("Watermark security: overlay parent node hijacked.");
      return true;
    }

    const overlayStyle = window.getComputedStyle(overlay);
    if (
      overlayStyle.display === 'none' ||
      overlayStyle.visibility === 'hidden' ||
      parseInt(overlayStyle.zIndex, 10) < 9999 ||
      overlayStyle.pointerEvents !== 'none' ||
      overlayStyle.position !== 'fixed'
    ) {
      console.warn("Watermark security: overlay container style tampering detected.");
      return true; 
    }

    // 2. Validate all 3 Scattered Watermark Contents
    const contentIds = ['nivo-watermark-content-1', 'nivo-watermark-content-2', 'nivo-watermark-content-3'];
    for (const id of contentIds) {
      const content = document.getElementById(id);
      if (!content) {
        console.warn(`Watermark security: content element ${id} removed.`);
        return true;
      }

      const contentStyle = window.getComputedStyle(content);
      if (
        contentStyle.display === 'none' ||
        contentStyle.visibility === 'hidden' ||
        parseFloat(contentStyle.opacity) < 0.01
      ) {
        console.warn(`Watermark security: content visual style of ${id} altered.`);
        return true;
      }

      // Validate nested image inside each watermark content
      const logoImg = content.querySelector('img');
      if (!logoImg) {
        console.warn(`Watermark security: brand logo image inside ${id} removed.`);
        return true;
      }

      const logoStyle = window.getComputedStyle(logoImg);
      if (logoStyle.display === 'none' || logoStyle.visibility === 'hidden' || parseFloat(logoStyle.opacity) < 0.01) {
        console.warn(`Watermark security: brand logo image inside ${id} hidden.`);
        return true;
      }

      // Validate brand/demo texts inside each watermark content
      const textSpans = content.querySelectorAll('span');
      if (textSpans.length < 2) {
        console.warn(`Watermark security: brand description texts inside ${id} removed.`);
        return true;
      }

      const brandText = textSpans[0].innerText || '';
      const demoText = textSpans[1].innerText || '';

      if (!brandText.toUpperCase().includes('NIVÔ') && !brandText.toUpperCase().includes('NIVO')) {
        console.warn(`Watermark security: brand text strings inside ${id} altered.`);
        return true;
      }
    }

    // 3. Validate Floating Badge Container (at bottom-left)
    const badge = document.getElementById('nivo-watermark-badge');
    if (!badge) {
      console.warn("Watermark security: badge element removed.");
      return true;
    }

    if (badge.parentNode !== document.body) {
      console.warn("Watermark security: badge parent node hijacked.");
      return true;
    }

    const badgeStyle = window.getComputedStyle(badge);
    if (
      badgeStyle.display === 'none' ||
      badgeStyle.visibility === 'hidden' ||
      parseFloat(badgeStyle.opacity) < 0.01 ||
      parseInt(badgeStyle.zIndex, 10) < 9998 ||
      badgeStyle.position !== 'fixed'
    ) {
      console.warn("Watermark security: badge style tampering detected.");
      return true;
    }

    // 4. Validate Floating Badge Inner Elements
    const anchor = badge.querySelector('a');
    if (!anchor) {
      console.warn("Watermark security: badge link removed.");
      return true;
    }

    const badgeLogoImg = badge.querySelector('img');
    if (!badgeLogoImg) {
      console.warn("Watermark security: badge logo image removed.");
      return true;
    }

    if (anchor.children.length < 3) {
      console.warn("Watermark security: badge layout parts removed.");
      return true;
    }

    const badgeText = badge.innerText || '';
    if (!badgeText.toUpperCase().includes('PREVIEW') || (!badgeText.toUpperCase().includes('NIVÔ') && !badgeText.toUpperCase().includes('NIVO'))) {
      console.warn("Watermark security: badge text content altered.");
      return true;
    }

    return false;
  };

  const triggerLock = () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    document.body.innerHTML = `
      <div style="position: fixed; inset: 0; background-color: #0a201a; color: white; z-index: 100000; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; text-align: center; font-family: 'Outfit', sans-serif; user-select: none; -webkit-user-select: none;">
        <div style="max-width: 448px; margin: 0 auto; box-sizing: border-box; display: flex; flex-direction: column; gap: 24px;">
          <div style="width: 64px; height: 64px; border-radius: 50%; border: 1px solid rgba(212, 175, 55, 0.3); background-color: rgba(14, 58, 47, 0.5); display: flex; align-items: center; justify-content: center; margin: 0 auto;">
            <span style="color: #d4af37; font-family: 'Playfair Display', serif; font-size: 24px;">✦</span>
          </div>
          <h2 style="font-family: 'Playfair Display', serif; font-size: 30px; color: #d4af37; margin: 0; letter-spacing: 0.05em;">Preview Locked</h2>
          <p style="font-size: 14px; color: #d1d5db; line-height: 1.625; font-weight: 300; margin: 0;">
            This invitation template demo is protected. Modifying, hiding, or deleting the preview watermarks is not allowed.
          </p>
          <p style="font-size: 10px; letter-spacing: 0.2em; color: #e7cb8a; text-transform: uppercase; font-weight: 600; margin: 0;">
            NIVÔ INVITATION STUDIO
          </p>
          <div style="margin-top: 8px;">
            <button onclick="window.location.reload()" style="cursor: pointer; background-color: #daa854; border: none; color: #0a201a; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; padding: 12px 28px; transition: all 0.3s; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              Reload Preview
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
  };

  useEffect(() => {
    const initialCheck = setTimeout(() => {
      if (checkTampering()) {
        triggerLock();
      }
    }, 400);

    const observer = new MutationObserver(() => {
      setTimeout(() => {
        if (checkTampering()) {
          triggerLock();
        }
      }, 50);
    });
    observerRef.current = observer;

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'id'],
    });

    const interval = setInterval(() => {
      if (checkTampering()) {
        triggerLock();
      }
    }, 1200);
    intervalRef.current = interval;

    return () => {
      clearTimeout(initialCheck);
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  const renderWatermarkElement = (id, top, left) => (
    <div
      id={id}
      style={{
        position: 'absolute',
        top: top,
        left: left,
        transform: 'translate(-50%, -50%) rotate(-20deg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.12,
        textAlign: 'center',
        pointerEvents: 'none',
      }}
    >
      <img
        src="/branding/logo.png"
        alt="NIVÔ Logo"
        style={{
          width: '120px',
          height: '120px',
          objectFit: 'contain',
          marginBottom: '10px',
          pointerEvents: 'none',
        }}
      />
      <span
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '28px',
          fontWeight: '700',
          color: '#c68a33',
          letterSpacing: '4px',
          lineHeight: 1.1,
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}
      >
        NIVÔ STUDIO
      </span>
      <span
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '11px',
          fontWeight: '600',
          color: '#c68a33',
          letterSpacing: '6px',
          marginTop: '6px',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}
      >
        DEMO PREVIEW
      </span>
    </div>
  );

  return createPortal(
    <>
      <div
        ref={containerRef}
        id="nivo-watermark-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 9999,
          display: 'flex',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          msUserSelect: 'none',
        }}
      >
        {renderWatermarkElement('nivo-watermark-content-1', '25%', '25%')}
        {renderWatermarkElement('nivo-watermark-content-2', '50%', '50%')}
        {renderWatermarkElement('nivo-watermark-content-3', '75%', '75%')}
      </div>

      <div
        id="nivo-watermark-badge"
        className="select-none"
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 9998,
          pointerEvents: 'auto',
        }}
      >
        <a
          href="https://nivo-invitations.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-3 bg-emerald-950/95 hover:bg-emerald-950 border border-gold-400/40 px-4 py-2.5 shadow-xl transition-all duration-300 hover:-translate-y-1 group rounded-none"
        >
          <div className="relative w-6 h-6 rounded-full overflow-hidden border border-gold-400/20 bg-emerald-900 flex-shrink-0 flex items-center justify-center">
            <img
              src="/branding/logo.png"
              alt="NIVÔ Logo"
              className="w-4 h-4 object-contain opacity-90 group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          
          <div className="flex flex-col text-left">
            <span className="text-[9px] tracking-[0.2em] uppercase text-gold-300 font-medium leading-none">PREVIEW BY</span>
            <span className="text-xs font-serif text-white font-semibold tracking-wide mt-1 leading-none">NIVÔ Studio</span>
          </div>

          <div className="w-5 h-5 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400 group-hover:bg-gold-400 group-hover:text-emerald-950 transition-all duration-300 ml-1">
            <span className="text-xs font-sans leading-none font-bold">→</span>
          </div>
        </a>
      </div>
    </>,
    document.body
  );
}
