import React, { useEffect, useRef } from "react";
import DockApp from "../base/dock_app";

// macOS dock. Like Ubuntu's side bar it slides away while a window overlaps it
// and comes back when the pointer reaches the bottom edge of the screen.
export default function Dock(props) {
  const hideTimer = useRef(null);

  useEffect(() => () => clearTimeout(hideTimer.current), []);

  const showDock = () => {
    clearTimeout(hideTimer.current);
    props.hideSideBar(null, false);
  };

  const hideDockLater = () => {
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      props.hideSideBar(null, true);
    }, 1500);
  };

  return (
    <>
      <div className={"mac-dock-wrap" + (props.hide ? " is-hidden" : "")}>
        <div
          className="mac-dock"
          onMouseEnter={showDock}
          onMouseLeave={hideDockLater}
        >
          <button
            type="button"
            aria-label="Launchpad"
            aria-expanded={props.allAppsView}
            onClick={props.showAllApps}
            className="mac-dock-item"
          >
            <span className="mac-launchpad-icon" aria-hidden="true">
              {Array.from({ length: 9 }, (_, index) => (
                <i key={index} />
              ))}
            </span>
            <span className="dock-tooltip">Launchpad</span>
          </button>
          {Object.keys(props.closed_windows).length !== 0
            ? props.apps.map((app, index) => {
                if (props.favourite_apps[app.id] === false) return null;
                return (
                  <DockApp
                    key={index}
                    variant="dock"
                    id={app.id}
                    title={app.title}
                    icon={app.icon}
                    isClose={props.closed_windows}
                    isFocus={props.focused_windows}
                    openApp={props.openAppByAppId}
                  />
                );
              })
            : null}
        </div>
      </div>
      {/* Bottom edge that brings a hidden dock back */}
      <div
        onMouseEnter={showDock}
        onMouseLeave={hideDockLater}
        className="w-full h-1 absolute bottom-0 left-0 bg-transparent z-50"
      ></div>
    </>
  );
}
