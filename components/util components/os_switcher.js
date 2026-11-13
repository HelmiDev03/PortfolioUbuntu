import React, { useEffect, useRef, useState } from "react";
import { FaApple, FaUbuntu, FaWindows } from "react-icons/fa";
import { OS_LIST } from "../../lib/os";

const OS_ICONS = { ubuntu: FaUbuntu, windows: FaWindows, macos: FaApple };

export function OSIcon({ os, size = 14, className }) {
  const Icon = OS_ICONS[os] || FaUbuntu;
  return <Icon size={size} className={className} aria-hidden="true" />;
}

// Four-pane logo used by the Windows start button and boot screen.
export function WindowsLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <rect x="1" y="1" width="8.5" height="8.5" rx="1" fill="#6fd0ff" />
      <rect x="10.5" y="1" width="8.5" height="8.5" rx="1" fill="#4cc2ff" />
      <rect x="1" y="10.5" width="8.5" height="8.5" rx="1" fill="#2ea3f2" />
      <rect x="10.5" y="10.5" width="8.5" height="8.5" rx="1" fill="#0f7fd8" />
    </svg>
  );
}

// Button that lives in every system bar and lets the visitor pick the OS skin.
// `placement` is where the menu opens relative to the button.
export default function OSSwitcher({ os, changeOS, placement = "bottom" }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const closeOnOutsidePress = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const closeOnEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const select = (id) => {
    setOpen(false);
    changeOS(id);
  };

  return (
    <div ref={wrapperRef} className="os-switcher relative flex items-center">
      <button
        type="button"
        className="os-switcher-btn"
        onClick={() => setOpen(!open)}
        title="Switch operating system"
        aria-label="Switch operating system"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <OSIcon os={os} size={14} />
        <span className="hidden sm:inline ml-1.5">Switch OS</span>
      </button>
      {open ? (
        <div
          role="menu"
          className={
            "os-switcher-menu" +
            (placement === "top" ? " os-switcher-menu-up" : "")
          }
        >
          <div className="os-switcher-heading">Operating system</div>
          {OS_LIST.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitemradio"
              aria-checked={item.id === os}
              className={
                "os-switcher-item" + (item.id === os ? " is-active" : "")
              }
              onClick={() => select(item.id)}
            >
              <OSIcon os={item.id} size={16} />
              <span className="flex-1 text-left ml-2.5">{item.name}</span>
              {item.id === os ? <span aria-hidden="true">✓</span> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
