
import React, { useState, useCallback, useRef } from 'react';
import FloatingHearts from './components/FloatingHearts';
import { Position } from './types';
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

const App: React.FC = () => {
  const [accepted, setAccepted] = useState(false);
  const [noBtnPos, setNoBtnPos] = useState<Position | null>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);

  const handleYes = () => {
    setAccepted(true);
    // Reset "No" button position
    setNoBtnPos(null);
    
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const moveButton = useCallback((e?: React.SyntheticEvent) => {
    const btn = noBtnRef.current;
    if (!btn) return;
    
    // Prevent default touch actions (like scrolling or clicking) if this is a touch event
    if (e && e.type === 'touchstart') {
       // e.preventDefault(); 
    }

    // Get button dimensions
    const width = btn.offsetWidth;
    const height = btn.offsetHeight;
    
    // Viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Center of the screen
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;

    // Define the "vicinity" radius (e.g., 250px around the center)
    // This keeps the button close to the central tab
    const spreadX = 250; 
    const spreadY = 250;

    // Calculate boundaries relative to center
    const minX = centerX - spreadX;
    const maxX = centerX + spreadX - width;
    const minY = centerY - spreadY;
    const maxY = centerY + spreadY - height;

    // Ensure we don't go off-screen (clamp values)
    const margin = 20;
    const safeMinX = Math.max(margin, minX);
    const safeMaxX = Math.min(viewportWidth - width - margin, maxX);
    const safeMinY = Math.max(margin, minY);
    const safeMaxY = Math.min(viewportHeight - height - margin, maxY);

    // Generate random position within these central bounds
    const newX = Math.floor(Math.random() * (safeMaxX - safeMinX) + safeMinX);
    const newY = Math.floor(Math.random() * (safeMaxY - safeMinY) + safeMinY);

    setNoBtnPos({ x: newX, y: newY });
  }, []);

  const reset = () => {
    setAccepted(false);
    setNoBtnPos(null);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-rose-100 via-purple-100 to-pink-100 overflow-hidden px-4 py-10">
      <FloatingHearts />

      <div 
        className="relative z-10 w-full max-w-md bg-white/15 backdrop-blur-sm border border-white/40 p-8 md:p-10 rounded-[2rem] text-center transform transition-all duration-500"
      >
        {!accepted ? (
          <>
            <div className="mb-8 flex justify-center">
              <img 
                src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzVscmJvbjMwdXhrZW5yand5eGZ5dWNsbmQwemo4anRoMXR5YmF0biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/oGtJSe9HLktXckMzC5/giphy.gif" 
                alt="Cute Cat" 
                className="w-48 h-auto md:w-56 drop-shadow-md rounded-lg"
              />
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-8 leading-tight drop-shadow-sm">
              DISHAAAAA, <br />
              <span className="text-2xl md:text-4xl text-pink-600">will you be my Valentine?</span>
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative min-h-[80px]">
              <button
                onClick={handleYes}
                className="px-10 py-4 bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold rounded-full shadow-lg shadow-pink-200 hover:shadow-pink-400 hover:scale-110 active:scale-95 transition-all duration-200 text-xl z-20"
              >
                Yes! 💖
              </button>

              {/* Placeholder to keep layout stable when No button becomes absolute/fixed */}
              {noBtnPos && (
                <button className="px-10 py-4 opacity-0 pointer-events-none text-xl font-bold" aria-hidden="true">
                  No
                </button>
              )}

              <button
                ref={noBtnRef}
                onMouseEnter={moveButton}
                onTouchStart={moveButton}
                onClick={moveButton}
                style={noBtnPos ? { 
                  position: 'fixed', 
                  left: `${noBtnPos.x}px`, 
                  top: `${noBtnPos.y}px`,
                  zIndex: 9999,
                  transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: 'none'
                } : {}}
                className="px-10 py-4 bg-white/80 backdrop-blur-sm text-gray-600 font-bold rounded-full hover:bg-white transition-colors text-xl select-none touch-manipulation shadow-md border border-white/50"
              >
                No
              </button>
            </div>
            <p className="mt-8 text-pink-500/80 text-sm font-medium animate-pulse italic">
              "No" seems a bit shy... 😉
            </p>
          </>
        ) : (
          <div className="animate-in fade-in zoom-in duration-1000">
            <h1 className="text-5xl md:text-6xl font-bold text-pink-600 mb-6 drop-shadow-sm">YAY! 🎉</h1>
            <div className="mb-8 overflow-hidden rounded-2xl shadow-xl border-4 border-white/50 bg-white">
              <img 
                src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnR6NDZkazIwNWx0amRxdnZsY3Y5aDZ6ajY5cWxtNGVhdnNucXNsYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/wIUQQ07BHzDry/giphy.gif" 
                alt="Celebration GIF" 
                className="w-full h-auto"
              />
            </div>
            <p className="text-xl md:text-2xl text-pink-600 font-semibold mb-2">
              Best decision ever!
            </p>
            <p className="text-gray-600 italic">
              See you on the 14th, beautiful! 🌹
            </p>
            
            <button 
              onClick={reset}
              className="mt-8 text-pink-400 text-xs hover:text-pink-600 transition-colors uppercase tracking-widest font-semibold"
            >
              Start Over
            </button>
          </div>
        )}
      </div>

      <div className="fixed bottom-6 text-pink-400/60 text-xs font-medium tracking-widest uppercase z-20">
        Made with Love ❤️
      </div>
    </div>
  );
};

export default App;
