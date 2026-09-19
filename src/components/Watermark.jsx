import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Watermark() {
  const observerRef = useRef(null);
  const intervalRef = useRef(null);

  const checkTampering = () => {
    // 1. Validate Floating Badge Container (at bottom-left)
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

    // 5. Validate Screenshot Cover Container
    const cover = document.getElementById('nivo-screenshot-cover');
    if (!cover) {
      console.warn("Watermark security: screenshot cover element removed.");
      return true;
    }

    if (cover.parentNode !== document.body) {
      console.warn("Watermark security: screenshot cover parent hijacked.");
      return true;
    }

    const coverStyle = window.getComputedStyle(cover);
    if (
      coverStyle.position !== 'fixed' ||
      parseInt(coverStyle.zIndex, 10) < 100000
    ) {
      console.warn("Watermark security: screenshot cover style tampered.");
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

    // Inject @media print style to disable printing and screen sniping
    const styleEl = document.createElement('style');
    styleEl.id = 'nivo-print-protection';
    styleEl.innerHTML = `
      @media print {
        body, html, #root { display: none !important; }
        #nivo-screenshot-cover { display: flex !important; }
      }
    `;
    document.head.appendChild(styleEl);

    const showCover = () => {
      const cover = document.getElementById('nivo-screenshot-cover');
      if (cover) {
        cover.style.display = 'flex';
        const root = document.getElementById('root');
        if (root) root.style.filter = 'blur(12px)';
      }
    };

    const hideCover = () => {
      const cover = document.getElementById('nivo-screenshot-cover');
      if (cover) {
        cover.style.display = 'none';
        const root = document.getElementById('root');
        if (root) root.style.filter = 'none';
      }
    };

    // Listen to focus/blur and visibility change events
    window.addEventListener('blur', showCover);
    window.addEventListener('focus', hideCover);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        showCover();
      } else {
        hideCover();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Block PrintScreen key
    const handleScreenshotKeys = (e) => {
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        showCover();
        navigator.clipboard.writeText("Screenshots are disabled on this preview website.");
        setTimeout(hideCover, 2000);
      }
    };
    window.addEventListener('keyup', handleScreenshotKeys);

    return () => {
      clearTimeout(initialCheck);
      observer.disconnect();
      clearInterval(interval);
      window.removeEventListener('blur', showCover);
      window.removeEventListener('focus', hideCover);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keyup', handleScreenshotKeys);
      const styleTag = document.getElementById('nivo-print-protection');
      if (styleTag) styleTag.remove();
    };
  }, []);

  return createPortal(
    <>

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
          href="https://nivoinvites.com"
          target="_self"
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

      {/* Screen protection overlay for blur / print screen / screenshotting */}
      <div
        id="nivo-screenshot-cover"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#0a201a',
          color: 'white',
          zIndex: 1000000,
          display: 'none',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          fontFamily: "'Outfit', sans-serif",
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        <div style={{ maxWidth: '448px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '1px solid rgba(212, 175, 55, 0.3)', backgroundColor: 'rgba(14, 58, 47, 0.5)', display: 'flex', alignItems: 'center', justify: 'center', margin: '0 auto' }}>
            <span style={{ color: '#d4af37', fontFamily: "'Playfair Display', serif", fontSize: '24px' }}>✦</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#d4af37', margin: 0, letterSpacing: '0.05em' }}>Screen Protected</h2>
          <p style={{ fontSize: '13px', color: '#d1d5db', lineHeight: '1.6', fontWeight: 300, margin: 0 }}>
            Screenshots, screen recording, and printing are disabled on this preview website to protect content copyright.
          </p>
          <p style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#e7cb8a', textTransform: 'uppercase', fontWeight: 600, margin: 0 }}>
            NIVÔ INVITATION STUDIO
          </p>
        </div>
      </div>
    </>,
    document.body
  );
}
