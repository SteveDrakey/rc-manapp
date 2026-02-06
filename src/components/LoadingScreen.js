import React, { useState, useEffect, useMemo } from 'react';
import { Shield, Wifi, Zap, CheckCircle, Server, Database, Globe, Lock } from 'lucide-react';

const statusMessages = [
  { icon: Server, text: 'Connecting to project server...' },
  { icon: Database, text: 'Loading site deployment data...' },
  { icon: Globe, text: 'Syncing rollout schedules...' },
  { icon: Lock, text: 'Verifying access credentials...' },
  { icon: Shield, text: 'Running integrity checks...' },
  { icon: CheckCircle, text: 'All systems operational' },
];

const words = [
  { text: 'AGILE', icon: Zap, color: '#f97316' },
  { text: 'AVAILABLE', icon: Wifi, color: '#3b82f6' },
  { text: 'ASSURED', icon: Shield, color: '#10b981' },
];

// TrueNorth IT compass logo as a Lego brick grid
// Each cell: 0=empty, color string = filled brick
const LOGO_GRID = (() => {
  // 21x21 grid - compass rose / north star with "TN" monogram
  const E = null; // empty
  const B = '#0055BF'; // Lego blue
  const W = '#FFFFFF'; // Lego white
  const R = '#B40000'; // Lego red (north arrow)
  const G = '#237841'; // Lego green
  const D = '#1B2A4A'; // Dark blue
  const O = '#F97316'; // Orange accent

  return [
    //  0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20
    [E, E, E, E, E, E, E, E, E, R, R, R, E, E, E, E, E, E, E, E, E], // 0  - top of north arrow
    [E, E, E, E, E, E, E, E, R, R, R, R, R, E, E, E, E, E, E, E, E], // 1
    [E, E, E, E, E, E, E, E, R, R, W, R, R, E, E, E, E, E, E, E, E], // 2
    [E, E, E, E, E, E, E, R, R, W, W, W, R, R, E, E, E, E, E, E, E], // 3
    [E, E, E, E, E, E, R, R, W, W, W, W, W, R, R, E, E, E, E, E, E], // 4
    [E, E, E, E, E, B, D, B, W, W, D, W, W, B, D, B, E, E, E, E, E], // 5  - compass body starts
    [E, E, E, E, B, D, B, D, B, D, D, D, B, D, B, D, B, E, E, E, E], // 6
    [E, E, E, B, D, B, D, B, D, B, D, B, D, B, D, B, D, B, E, E, E], // 7
    [E, E, R, W, B, D, B, D, B, D, D, D, B, D, B, D, W, R, E, E, E], // 8  - west arrow
    [E, R, R, W, D, B, D, D, D, O, O, O, D, D, B, D, W, R, R, E, E], // 9  - center row
    [R, R, W, W, D, D, D, D, O, O, O, O, O, D, D, D, W, W, R, R, E], // 10 - center (compass star)
    [E, R, R, W, D, B, D, D, D, O, O, O, D, D, B, D, W, R, R, E, E], // 11
    [E, E, R, W, B, D, B, D, B, D, D, D, B, D, B, D, W, R, E, E, E], // 12 - east arrow
    [E, E, E, B, D, B, D, B, D, B, D, B, D, B, D, B, D, B, E, E, E], // 13
    [E, E, E, E, B, D, B, D, B, D, D, D, B, D, B, D, B, E, E, E, E], // 14
    [E, E, E, E, E, B, D, B, W, W, D, W, W, B, D, B, E, E, E, E, E], // 15
    [E, E, E, E, E, E, G, G, W, W, W, W, W, G, G, E, E, E, E, E, E], // 16 - south arrow (green)
    [E, E, E, E, E, E, E, G, G, W, W, W, G, G, E, E, E, E, E, E, E], // 17
    [E, E, E, E, E, E, E, E, G, G, W, G, G, E, E, E, E, E, E, E, E], // 18
    [E, E, E, E, E, E, E, E, G, G, G, G, G, E, E, E, E, E, E, E, E], // 19
    [E, E, E, E, E, E, E, E, E, G, G, G, E, E, E, E, E, E, E, E, E], // 20 - bottom of south arrow
  ];
})();

// "TRUENORTH" text as Lego bricks (5 rows tall, pixel font)
const TEXT_GRID = (() => {
  const B = '#0055BF';
  const E = null;
  // Each letter is 5 tall x variable wide, separated by 1 empty col
  // T R U E N O R T H
  const T = [[B,B,B],[E,B,E],[E,B,E],[E,B,E],[E,B,E]];
  const R = [[B,B,E],[B,E,B],[B,B,E],[B,E,B],[B,E,B]];
  const U = [[B,E,B],[B,E,B],[B,E,B],[B,E,B],[B,B,B]];
  const EL= [[B,B,B],[B,E,E],[B,B,E],[B,E,E],[B,B,B]];
  const N = [[B,E,B],[B,B,B],[B,B,B],[B,E,B],[B,E,B]];
  const O = [[B,B,B],[B,E,B],[B,E,B],[B,E,B],[B,B,B]];
  const H = [[B,E,B],[B,E,B],[B,B,B],[B,E,B],[B,E,B]];

  const letters = [T, R, U, EL, N, O, R, T, H];
  const spacer = [[E],[E],[E],[E],[E]];

  // Combine all letters with spacers
  const rows = [[], [], [], [], []];
  letters.forEach((letter, idx) => {
    for (let row = 0; row < 5; row++) {
      rows[row].push(...letter[row]);
      if (idx < letters.length - 1) {
        rows[row].push(...spacer[row]);
      }
    }
  });
  return rows;
})();

// "IT" subtitle as Lego bricks
const IT_GRID = (() => {
  const O = '#F97316'; // orange for IT
  const E = null;
  const I = [[O,O,O],[E,O,E],[E,O,E],[E,O,E],[O,O,O]];
  const T = [[O,O,O],[E,O,E],[E,O,E],[E,O,E],[E,O,E]];

  const spacer = [[E],[E],[E],[E],[E]];
  const rows = [[], [], [], [], []];
  [I, T].forEach((letter, idx) => {
    for (let row = 0; row < 5; row++) {
      rows[row].push(...letter[row]);
      if (idx < 1) {
        rows[row].push(...spacer[row]);
      }
    }
  });
  return rows;
})();

// Build the rendering order for bricks (randomized for a natural building effect)
function buildBrickOrder(grid) {
  const bricks = [];
  for (let r = grid.length - 1; r >= 0; r--) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c]) {
        bricks.push({ r, c, color: grid[r][c] });
      }
    }
  }
  // Shuffle for natural building feel, but bottom-up bias
  for (let i = bricks.length - 1; i > 0; i--) {
    const j = Math.max(0, i - Math.floor(Math.random() * 6));
    [bricks[i], bricks[j]] = [bricks[j], bricks[i]];
  }
  return bricks;
}

function LegoBrick({ color, size = 16, delay = 0, placed = false }) {
  const studSize = size * 0.35;
  const studOffset = (size - studSize) / 2;
  return (
    <div
      className={`lego-brick ${placed ? 'lego-brick-placed' : ''}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        animationDelay: `${delay}ms`,
        position: 'relative',
        borderRadius: 2,
      }}
    >
      {/* Lego stud on top */}
      <div
        className="lego-stud"
        style={{
          width: studSize,
          height: studSize,
          left: studOffset,
          top: -studSize * 0.35,
          backgroundColor: color,
          position: 'absolute',
          borderRadius: '50%',
          boxShadow: `inset 0 -1px 2px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.2)`,
        }}
      />
      {/* Brick surface highlight */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 2,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

function LegoGrid({ grid, brickSize = 16, bricksPlaced, gap = 1, idPrefix = 'logo' }) {
  const totalCols = grid[0]?.length || 0;
  const totalRows = grid.length;
  const gridWidth = totalCols * (brickSize + gap);
  const gridHeight = totalRows * (brickSize + gap);

  return (
    <div
      style={{
        position: 'relative',
        width: gridWidth,
        height: gridHeight + brickSize * 0.35,
        paddingTop: brickSize * 0.35,
      }}
    >
      {grid.map((row, r) =>
        row.map((color, c) => {
          if (!color) return null;
          const brickKey = `${idPrefix}-${r}-${c}`;
          const isPlaced = bricksPlaced.has(brickKey);
          return (
            <div
              key={brickKey}
              style={{
                position: 'absolute',
                left: c * (brickSize + gap),
                top: r * (brickSize + gap) + brickSize * 0.35,
              }}
            >
              <LegoBrick
                color={color}
                size={brickSize}
                placed={isPlaced}
              />
            </div>
          );
        })
      )}
    </div>
  );
}

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState(0);
  const [wordsRevealed, setWordsRevealed] = useState(0);
  const [phase, setPhase] = useState('building'); // 'building' | 'text' | 'words' | 'status' | 'done'
  const [fadeOut, setFadeOut] = useState(false);
  const [bricksPlaced, setBricksPlaced] = useState(new Set());
  const [textBricksPlaced, setTextBricksPlaced] = useState(new Set());
  const [itBricksPlaced, setItBricksPlaced] = useState(new Set());
  const [buildComplete, setBuildComplete] = useState(false);
  const [textComplete, setTextComplete] = useState(false);

  // Pre-compute brick orders
  const logoBrickOrder = useMemo(() => buildBrickOrder(LOGO_GRID), []);
  const textBrickOrder = useMemo(() => buildBrickOrder(TEXT_GRID), []);
  const itBrickOrder = useMemo(() => buildBrickOrder(IT_GRID), []);

  // Phase 1: Build the compass logo brick by brick
  useEffect(() => {
    if (phase !== 'building') return;
    let idx = 0;
    const bricksPerTick = 3;
    const interval = setInterval(() => {
      if (idx >= logoBrickOrder.length) {
        clearInterval(interval);
        setTimeout(() => {
          setBuildComplete(true);
          setPhase('text');
        }, 300);
        return;
      }
      setBricksPlaced(prev => {
        const next = new Set(prev);
        for (let i = 0; i < bricksPerTick && idx + i < logoBrickOrder.length; i++) {
          const brick = logoBrickOrder[idx + i];
          next.add(`logo-${brick.r}-${brick.c}`);
        }
        return next;
      });
      idx += bricksPerTick;
    }, 25);
    return () => clearInterval(interval);
  }, [phase, logoBrickOrder]);

  // Phase 2: Build the "TRUENORTH" text and "IT" subtitle
  useEffect(() => {
    if (phase !== 'text') return;
    let idx = 0;
    const bricksPerTick = 2;
    const interval = setInterval(() => {
      if (idx >= textBrickOrder.length) {
        clearInterval(interval);
        // Now build "IT"
        let itIdx = 0;
        const itInterval = setInterval(() => {
          if (itIdx >= itBrickOrder.length) {
            clearInterval(itInterval);
            setTimeout(() => {
              setTextComplete(true);
              setPhase('words');
            }, 400);
            return;
          }
          setItBricksPlaced(prev => {
            const next = new Set(prev);
            for (let i = 0; i < 2 && itIdx + i < itBrickOrder.length; i++) {
              const brick = itBrickOrder[itIdx + i];
              next.add(`it-${brick.r}-${brick.c}`);
            }
            return next;
          });
          itIdx += 2;
        }, 30);
        return;
      }
      setTextBricksPlaced(prev => {
        const next = new Set(prev);
        for (let i = 0; i < bricksPerTick && idx + i < textBrickOrder.length; i++) {
          const brick = textBrickOrder[idx + i];
          next.add(`text-${brick.r}-${brick.c}`);
        }
        return next;
      });
      idx += bricksPerTick;
    }, 20);
    return () => clearInterval(interval);
  }, [phase, textBrickOrder, itBrickOrder]);

  // Phase 3: Reveal the three words one by one
  useEffect(() => {
    if (phase !== 'words') return;
    if (wordsRevealed < words.length) {
      const timer = setTimeout(() => {
        setWordsRevealed(prev => prev + 1);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setPhase('status'), 500);
      return () => clearTimeout(timer);
    }
  }, [phase, wordsRevealed]);

  // Phase 4: Cycle through status messages with progress
  useEffect(() => {
    if (phase !== 'status') return;

    const totalDuration = 3000;
    const stepDuration = totalDuration / statusMessages.length;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, totalDuration / 100);

    const statusInterval = setInterval(() => {
      setCurrentStatus(prev => {
        if (prev >= statusMessages.length - 1) {
          clearInterval(statusInterval);
          return statusMessages.length - 1;
        }
        return prev + 1;
      });
    }, stepDuration);

    return () => {
      clearInterval(progressInterval);
      clearInterval(statusInterval);
    };
  }, [phase]);

  // Phase 5: When progress hits 100, transition out
  useEffect(() => {
    if (progress === 100 && phase === 'status') {
      const timer = setTimeout(() => {
        setPhase('done');
        setFadeOut(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [progress, phase]);

  // After fade out, call onComplete
  useEffect(() => {
    if (fadeOut) {
      const timer = setTimeout(() => onComplete(), 800);
      return () => clearTimeout(timer);
    }
  }, [fadeOut, onComplete]);

  const StatusIcon = phase === 'status' || phase === 'done'
    ? statusMessages[currentStatus].icon
    : Server;

  return (
    <div className={`loading-screen ${fadeOut ? 'loading-fade-out' : ''}`}>
      {/* Lego baseplate background */}
      <div className="lego-baseplate" />

      {/* Floating Lego bricks particles */}
      <div className="loading-particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="lego-particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${4 + Math.random() * 4}s`,
            '--particle-color': ['#B40000', '#0055BF', '#F97316', '#237841', '#FFD700'][Math.floor(Math.random() * 5)],
          }} />
        ))}
      </div>

      {/* Main content */}
      <div className="loading-content">
        {/* Lego compass logo */}
        <div className={`lego-logo-container ${buildComplete ? 'lego-logo-complete' : ''}`}>
          <LegoGrid
            grid={LOGO_GRID}
            brickSize={14}
            gap={1}
            bricksPlaced={bricksPlaced}
            idPrefix="logo"
          />
        </div>

        {/* TRUENORTH text in Lego bricks */}
        <div className={`lego-text-container ${textComplete ? 'lego-text-complete' : ''}`}
             style={{ opacity: phase === 'building' ? 0 : 1, transition: 'opacity 0.3s ease' }}>
          <LegoGrid
            grid={TEXT_GRID}
            brickSize={8}
            gap={1}
            bricksPlaced={textBricksPlaced}
            idPrefix="text"
          />
        </div>

        {/* IT subtitle in Lego bricks */}
        <div className={`lego-it-container ${textComplete ? 'lego-text-complete' : ''}`}
             style={{ opacity: phase === 'building' || phase === 'text' && !textBricksPlaced.size ? 0 : 1, transition: 'opacity 0.3s ease' }}>
          <LegoGrid
            grid={IT_GRID}
            brickSize={8}
            gap={1}
            bricksPlaced={itBricksPlaced}
            idPrefix="it"
          />
        </div>

        {/* Subtitle */}
        <h1 className={`loading-title lego-subtitle ${textComplete ? 'lego-subtitle-visible' : ''}`}>
          Programme Manager
        </h1>

        {/* Three words */}
        <div className="loading-words">
          {words.map((word, i) => {
            const WordIcon = word.icon;
            const isRevealed = i < wordsRevealed;
            return (
              <div
                key={word.text}
                className={`loading-word ${isRevealed ? 'loading-word-visible' : ''}`}
                style={{ '--word-color': word.color }}
              >
                <div className="loading-word-icon lego-word-icon">
                  <WordIcon size={20} />
                </div>
                <span className="loading-word-text">{word.text}</span>
                <div className="loading-word-line" />
              </div>
            );
          })}
        </div>

        {/* Status section */}
        <div className={`loading-status-section ${phase === 'status' || phase === 'done' ? 'loading-status-visible' : ''}`}>
          {/* Lego-style progress bar */}
          <div className="lego-progress-track">
            <div
              className="lego-progress-fill"
              style={{ width: `${progress}%` }}
            >
              {[...Array(20)].map((_, i) => (
                <div key={i} className="lego-progress-brick" />
              ))}
            </div>
          </div>

          {/* Status message */}
          <div className="loading-status-row">
            <StatusIcon size={16} className={`loading-status-icon ${progress === 100 ? 'text-emerald-400' : 'text-orange-400'}`} />
            <span className="loading-status-text">
              {phase === 'status' || phase === 'done'
                ? statusMessages[currentStatus].text
                : 'Initialising...'}
            </span>
            <span className="loading-status-percent">
              {progress}%
            </span>
          </div>
        </div>
      </div>

      {/* Bottom tagline */}
      <div className={`loading-tagline ${wordsRevealed >= 3 ? 'loading-tagline-visible' : ''}`}>
        Pizza Express IT Rollout Programme
      </div>
    </div>
  );
}
