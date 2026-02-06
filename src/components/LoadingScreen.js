import React, { useState, useEffect } from 'react';
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

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState(0);
  const [wordsRevealed, setWordsRevealed] = useState(0);
  const [phase, setPhase] = useState('words'); // 'words' | 'status' | 'done'
  const [fadeOut, setFadeOut] = useState(false);

  // Phase 1: Reveal the three words one by one
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

  // Phase 2: Cycle through status messages with progress
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

  // Phase 3: When progress hits 100, transition out
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
      {/* Animated background grid */}
      <div className="loading-grid" />

      {/* Floating particles */}
      <div className="loading-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }} />
        ))}
      </div>

      {/* Main content */}
      <div className="loading-content">
        {/* Logo / Title area */}
        <div className="loading-logo">
          <div className="loading-logo-icon">
            <div className="loading-logo-ring" />
            <span className="loading-logo-text">RC</span>
          </div>
          <h1 className="loading-title">
            Programme Manager
          </h1>
        </div>

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
                <div className="loading-word-icon">
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
          {/* Progress bar */}
          <div className="loading-progress-track">
            <div
              className="loading-progress-fill"
              style={{ width: `${progress}%` }}
            />
            <div
              className="loading-progress-glow"
              style={{ left: `${progress}%` }}
            />
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
