import React, { useState } from "react";
import { FaApple } from "react-icons/fa";
import Clock from "../util components/clock";
import Status from "../util components/status";
import StatusCard from "../util components/status_card";
import OSSwitcher from "../util components/os_switcher";

const MENUS = ["File", "Edit", "View", "Go", "Window", "Help"];

// macOS menu bar: the focused app's name on the left, status items on the right.
export default function MenuBar(props) {
  const [statusCard, setStatusCard] = useState(false);

  return (
    <div className="main-navbar-vp mac-menubar absolute top-0 left-0 w-full h-7 z-50 flex items-center justify-between select-none text-white">
      <div className="flex items-center min-w-0 h-full pl-2">
        <span className="mac-menu-item">
          <FaApple size={15} aria-hidden="true" />
        </span>
        <span className="mac-menu-item font-bold truncate">
          {props.appName || "Finder"}
        </span>
        <div className="hidden md:flex items-center h-full">
          {MENUS.map((menu) => (
            <span key={menu} className="mac-menu-item">
              {menu}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center flex-shrink-0 h-full pr-2">
        <OSSwitcher os={props.os} changeOS={props.changeOS} />
        <button
          type="button"
          onClick={props.openTutorial}
          title="Open Tutorial"
          aria-label="Open tutorial"
          className="mac-menu-item font-bold"
        >
          ?
        </button>
        <div
          id="status-bar"
          tabIndex="0"
          onFocus={() => setStatusCard(true)}
          className="mac-menu-item relative outline-none"
        >
          <Status hideArrow={true} />
          <StatusCard
            shutDown={props.shutDown}
            lockScreen={props.lockScreen}
            visible={statusCard}
            toggleVisible={() => setStatusCard(false)}
          />
        </div>
        <span className="mac-menu-item">
          <span className="hidden sm:inline">
            <Clock />
          </span>
          <span className="sm:hidden">
            <Clock onlyTime={true} />
          </span>
        </span>
      </div>
    </div>
  );
}
