import React, { useState } from "react";
import Clock from "../util components/clock";
import Status from "../util components/status";
import StatusCard from "../util components/status_card";
import OSSwitcher, { WindowsLogo } from "../util components/os_switcher";
import DockApp from "../base/dock_app";

// Windows 11 taskbar: start button and apps in the middle, system tray on the right.
export default function Taskbar(props) {
  const [statusCard, setStatusCard] = useState(false);

  return (
    <div className="main-navbar-vp win-taskbar absolute bottom-0 left-0 w-full h-12 z-50 flex items-center select-none text-white">
      {/* Balances the tray so the apps sit in the centre of the screen */}
      <div className="hidden md:block flex-1" />

      <div className="win-task-apps flex-1 md:flex-none min-w-0 px-1">
        <button
          type="button"
          aria-label="Start"
          aria-expanded={props.allAppsView}
          onClick={props.showAllApps}
          className={
            "win-task-item" + (props.allAppsView ? " is-focused" : "")
          }
        >
          <WindowsLogo size={22} />
          <span className="dock-tooltip">Start</span>
        </button>
        {Object.keys(props.closed_windows).length !== 0
          ? props.apps.map((app, index) => {
              if (props.favourite_apps[app.id] === false) return null;
              return (
                <DockApp
                  key={index}
                  variant="taskbar"
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

      <div className="flex-shrink-0 md:flex-1 h-full flex items-center justify-end pr-1 md:pr-2 text-xs">
        <OSSwitcher os={props.os} changeOS={props.changeOS} placement="top" />
        <button
          type="button"
          onClick={props.openTutorial}
          title="Open Tutorial"
          aria-label="Open tutorial"
          className="win-tray-btn font-bold text-sm"
        >
          ?
        </button>
        <div
          id="status-bar"
          tabIndex="0"
          onFocus={() => setStatusCard(true)}
          className="win-tray-btn relative outline-none"
        >
          <Status hideArrow={true} />
          <StatusCard
            placement="up"
            shutDown={props.shutDown}
            lockScreen={props.lockScreen}
            visible={statusCard}
            toggleVisible={() => setStatusCard(false)}
          />
        </div>
        <div className="win-tray-btn win-tray-clock">
          <Clock onlyTime={true} />
          <span className="hidden sm:inline">
            <Clock onlyDay={true} />
          </span>
        </div>
      </div>
    </div>
  );
}
