import React, { useEffect, useRef, useState } from "react";

// Windows 11 start menu: search box, app grid, and the user / power row.
export default function StartMenu(props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const { close } = props;

  useEffect(() => {
    // Focusing on a phone would pop the keyboard over the menu.
    if (window.innerWidth >= 768 && inputRef.current) inputRef.current.focus();

    const closeOnEscape = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [close]);

  const search = query.trim().toLowerCase();
  const visibleApps = props.apps.filter(
    (app) => !app.disabled && app.title.toLowerCase().includes(search)
  );

  const open = (id) => {
    close();
    props.openApp(id);
  };

  const lock = () => {
    close();
    props.lockScreen();
  };

  const powerOff = () => {
    close();
    props.shutDown();
  };

  return (
    <>
      {/* Click-away layer above the taskbar */}
      <div className="win-start-backdrop z-40" onClick={close} />
      <div className="win-start-menu z-50" role="dialog" aria-label="Start">
        <div className="px-5 md:px-8 pt-6">
          <div className="win-start-search">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for apps"
              aria-label="Search for apps"
              autoComplete="off"
              spellCheck="false"
            />
          </div>
        </div>

        <div className="px-7 md:px-10 pt-5 pb-2 text-sm font-semibold">
          {search ? "Search results" : "Pinned"}
        </div>

        <div className="win-start-grid windowMainScreen">
          {visibleApps.map((app) => (
            <button
              key={app.id}
              type="button"
              className="win-start-app"
              onClick={() => open(app.id)}
            >
              <img src={app.icon} alt="" draggable="false" />
              <span>{app.title}</span>
            </button>
          ))}
          {visibleApps.length === 0 ? (
            <p className="win-start-empty">No apps match “{query.trim()}”.</p>
          ) : null}
        </div>

        <div className="win-start-footer">
          <div className="flex items-center min-w-0">
            <img
              src="./images/logos/meee.jpeg"
              alt=""
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <span className="ml-3 text-sm truncate">Helmi Lakhder</span>
          </div>
          <div className="flex items-center flex-shrink-0">
            <button
              type="button"
              className="win-start-power"
              onClick={lock}
              title="Lock"
              aria-label="Lock"
            >
              <img
                width="16px"
                height="16px"
                src="./themes/Yaru/status/changes-prevent-symbolic.svg"
                alt=""
              />
            </button>
            <button
              type="button"
              className="win-start-power"
              onClick={powerOff}
              title="Power off"
              aria-label="Power off"
            >
              <img
                width="16px"
                height="16px"
                src="./themes/Yaru/status/system-shutdown-symbolic.svg"
                alt=""
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
