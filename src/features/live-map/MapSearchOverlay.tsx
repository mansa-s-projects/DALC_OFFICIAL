'use client';

import React, { useCallback, useRef } from 'react';

interface MapSearchOverlayProps {
  value: string;
  onChange: (v: string) => void;
}

export function MapSearchOverlay({ value, onChange }: MapSearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = useCallback(() => {
    onChange('');
    inputRef.current?.focus();
  }, [onChange]);

  return (
    <>
      <style>{`
        .dalc-search-wrap {
          position: absolute;
          top: 60px;
          left: 16px;
          z-index: 20;
          width: 256px;
        }

        @media (max-width: 640px) {
          .dalc-search-wrap {
            left: 12px;
            right: 12px;
            width: auto;
          }
        }

        .dalc-search-inner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 12px;
          height: 38px;
          background: rgba(8, 8, 10, 0.75);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          transition: border-color 180ms, box-shadow 180ms;
        }

        .dalc-search-inner:focus-within {
          border-color: rgba(200, 164, 107, 0.45);
          box-shadow: 0 0 0 3px rgba(200, 164, 107, 0.08);
        }

        .dalc-search-icon {
          flex-shrink: 0;
          color: rgba(255, 255, 255, 0.3);
          transition: color 180ms;
        }

        .dalc-search-inner:focus-within .dalc-search-icon {
          color: rgba(200, 164, 107, 0.7);
        }

        .dalc-search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-size: 12px;
          letter-spacing: 0.03em;
          min-width: 0;
        }

        .dalc-search-input::placeholder {
          color: rgba(255, 255, 255, 0.28);
        }

        .dalc-search-clear {
          all: unset;
          cursor: pointer;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.45);
          font-size: 11px;
          line-height: 1;
          transition: background 150ms, color 150ms;
        }

        .dalc-search-clear:hover {
          background: rgba(255, 255, 255, 0.18);
          color: #fff;
        }
      `}</style>

      <div className="dalc-search-wrap">
        <div className="dalc-search-inner">
          {/* Search icon */}
          <svg
            className="dalc-search-icon"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>

          {/* Input */}
          <input
            ref={inputRef}
            className="dalc-search-input"
            type="text"
            placeholder="Search venues…"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label="Search venues"
            autoComplete="off"
            spellCheck={false}
          />

          {/* Clear button — only visible when there's text */}
          {value.length > 0 && (
            <button
              type="button"
              className="dalc-search-clear"
              onClick={handleClear}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </>
  );
}
