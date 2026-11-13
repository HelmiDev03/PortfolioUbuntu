import React from "react";

// App launcher used by the Windows taskbar and the macOS dock.
// It keeps the `sidebar-<id>` element id that Window uses as the target of its
// minimize animation.
export default function DockApp(props) {
  const isOpen = props.isClose[props.id] === false;
  const isFocused = isOpen && props.isFocus[props.id];

  return (
    <button
      type="button"
      id={"sidebar-" + props.id}
      aria-label={props.title}
      onClick={() => props.openApp(props.id)}
      className={
        (props.variant === "dock" ? "mac-dock-item" : "win-task-item") +
        (isOpen ? " is-open" : "") +
        (isFocused ? " is-focused" : "")
      }
    >
      <img src={props.icon} alt="" draggable="false" />
      <span className="dock-tooltip">{props.title}</span>
      <span className="dock-indicator" />
    </button>
  );
}
