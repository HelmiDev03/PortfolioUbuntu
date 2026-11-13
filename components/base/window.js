import React, { Component } from "react";
import Draggable from "react-draggable";
import Settings from "../apps/settings";
import ReactGA from "react-ga";
import { displayTerminal } from "../apps/terminal";
import { DEFAULT_OS, MAC_DOCK_ZONE, getOSLayout } from "../../lib/os";

export class Window extends Component {
  constructor() {
    super();
    this.id = null;
    this.startX = 0;
    this.startY = 0;
    this.state = {
      cursorType: "cursor-default",
      width: 60,
      height: 85,
      closed: false,
      maximized: false,
      parentSize: {
        height: 100,
        width: 100,
      },
    };
  }
  
  calculateCenterPosition() {
    // Calculate center position based on window size and screen size
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Calculate window dimensions based on percentages
    const windowWidth = screenWidth * (this.state.width / 100.0);
    const windowHeight = screenHeight * (this.state.height / 100.0);
    
    // Calculate top center position (horizontally centered, vertically at top)
    const centerX = (screenWidth - windowWidth) / 2;
    const topY = 20; // Fixed position from top of screen with small margin
    
    return { x: centerX, y: topY };
  }

  componentDidMount() {
    this.id = this.props.id;
    this.setDefaultWindowDimenstion();

    // google analytics
    ReactGA.pageview(`/${this.id}`);

    // on window resize, resize boundary
    window.addEventListener("resize", this.resizeBoundries);
    
    // Position window at top center when mounted
    setTimeout(() => {
      const topCenterPos = this.calculateCenterPosition();
      const windowElement = document.querySelector("#" + this.id);
      if (windowElement) {
        windowElement.style.transform = `translate(${topCenterPos.x}px, ${topCenterPos.y}px)`;
      }
    }, 50);
  }

  componentWillUnmount() {
    ReactGA.pageview("/desktop");
    window.removeEventListener("resize", this.resizeBoundries);
  }

  setDefaultWindowDimenstion = () => {
    if (window.innerWidth < 640) {
      this.setState({ height: 60, width: 85 }, this.resizeBoundries);
    } else {
      if (this.props.size) {
        this.setState({ height: this.props.size.height, width: this.props.size.width }, this.resizeBoundries);
      } else {
        this.setState({ height: 85, width: 60 }, this.resizeBoundries);
      }
    }
  };

  resizeBoundries = () => {
    // space taken by the OS bars above and below the window area
    const { top, bottom } = getOSLayout(this.props.os);
    const isUbuntu = !this.props.os || this.props.os === "ubuntu";
    this.setState({
      parentSize: {
        height:
          window.innerHeight - //parent height
          window.innerHeight * (this.state.height / 100.0) - // this window's height
          (isUbuntu ? 28 /* some padding */ : top + bottom),
        width:
          window.innerWidth - // parent width
          window.innerWidth * (this.state.width / 100.0), //this window's width
      },
    });
  };

  changeCursorToMove = () => {
    this.focusWindow();
    if (this.state.maximized) {
      this.restoreWindow();
    }
    this.setState({ cursorType: "cursor-move" });
  };

  changeCursorToDefault = () => {
    this.setState({ cursorType: "cursor-default" });
  };

  handleVerticleResize = () => {
    this.setState({ height: this.state.height + 0.1 }, this.resizeBoundries);
  };

  handleHorizontalResize = () => {
    this.setState({ width: this.state.width + 0.1 }, this.resizeBoundries);
  };

  setWinowsPosition = () => {
    var r = document.querySelector("#" + this.id);
    var rect = r.getBoundingClientRect();
    r.style.setProperty(
      "--window-transform-x",
      rect.x.toFixed(1).toString() + "px"
    );
    r.style.setProperty(
      "--window-transform-y",
      (rect.y.toFixed(1) - getOSLayout(this.props.os).top).toString() + "px"
    );
  };

  checkOverlap = () => {
    // the Windows taskbar never hides
    if (this.props.os === "windows") return;

    var r = document.querySelector("#" + this.id);
    var rect = r.getBoundingClientRect();
    var overlaps =
      this.props.os === "macos"
        ? rect.bottom > window.innerHeight - MAC_DOCK_ZONE // reaches the Dock
        : rect.x.toFixed(1) < 50; // overlapps with SideBar
    this.props.hideSideBar(this.id, overlaps);
  };

  focusWindow = () => {
    this.props.focus(this.id);
  };

  minimizeWindow = () => {
    this.setWinowsPosition();
    // get corrosponding sidebar app's position
    var dockApp = document.querySelector("#sidebar-" + this.id);
    var r = document.querySelector("#" + this.id);

    if (this.props.os === "windows" || this.props.os === "macos") {
      // shrink the window into its taskbar / dock icon
      var windowRect = r.getBoundingClientRect();
      var targetX = window.innerWidth / 2;
      var targetY = window.innerHeight;
      if (dockApp) {
        var dockAppRect = dockApp.getBoundingClientRect();
        targetX = dockAppRect.x + dockAppRect.width / 2;
        targetY = dockAppRect.y + dockAppRect.height / 2;
      }
      r.style.transform = `translate(${(
        targetX -
        windowRect.width / 2
      ).toFixed(1)}px,${(
        targetY -
        windowRect.height / 2 -
        getOSLayout(this.props.os).top
      ).toFixed(1)}px) scale(0.2)`;
    } else {
      let posx = -310;
      if (this.state.maximized) {
        posx = -510;
      }
      var sidebBarApp = dockApp.getBoundingClientRect();
      // translate window to that position
      r.style.transform = `translate(${posx}px,${
        sidebBarApp.y.toFixed(1) - 240
      }px) scale(0.2)`;
    }
    this.props.hasMinimised(this.id);
  };

  restoreWindow = () => {
    var r = document.querySelector("#" + this.id);
    this.setDefaultWindowDimenstion();
    // get previous position
    let posx = r.style.getPropertyValue("--window-transform-x");
    let posy = r.style.getPropertyValue("--window-transform-y");

    r.style.transform = `translate(${posx},${posy})`;
    setTimeout(() => {
      this.setState({ maximized: false });
      this.checkOverlap();
    }, 300);
  };

  maximizeWindow = () => {
    if (this.state.maximized) {
      this.restoreWindow();
    } else {
      this.focusWindow();
      var r = document.querySelector("#" + this.id);
      this.setWinowsPosition();
      // translate window to maximize position
      if (this.props.os === "windows" || this.props.os === "macos") {
        // fill everything between the OS bars
        const { top, bottom } = getOSLayout(this.props.os);
        r.style.transform = `translate(0px,0px)`;
        this.setState({
          maximized: true,
          height:
            ((window.innerHeight - top - bottom) / window.innerHeight) * 100,
          width: 100,
        });
      } else {
        r.style.transform = `translate(-1pt,-2pt)`;
        this.setState({ maximized: true, height: 96.3, width: 100.2 });
      }
      this.props.hideSideBar(this.id, true);
    }
  };

  closeWindow = () => {
    this.setWinowsPosition();
    this.setState({ closed: true }, () => {
      this.props.hideSideBar(this.id, false);
      setTimeout(() => {
        this.props.closed(this.id);
      }, 300); // after 300ms this window will be unmounted from parent (Desktop)
    });
  };

  render() {
    // Calculate center position for the window
    const centerPosition = this.calculateCenterPosition();
    const os = this.props.os || DEFAULT_OS;

    // each OS draws its own window frame and title bar
    let windowFrame =
      (this.state.maximized ? " rounded-none" : " rounded-lg rounded-b-none") +
      " window-shadow border-black border-opacity-40 border border-t-0 ";
    if (os === "windows") windowFrame = " win-window ";
    if (os === "macos") windowFrame = " mac-window ";

    return (
      <Draggable
        axis="both"
        handle=".bg-ub-window-title"
        grid={[1, 1]}
        scale={1}
        onStart={this.changeCursorToMove}
        onStop={this.changeCursorToDefault}
        onDrag={this.checkOverlap}
        allowAnyClick={false}
        defaultPosition={centerPosition}
        position={this.props.position || null}
        bounds={{
          left: 0,
          top: 0,
          right: this.state.parentSize.width,
          bottom: this.state.parentSize.height,
        }}
      >
        <div
          style={{
            width: `${this.state.width}%`,
            height: `${this.state.height}%`,
          }}
          className={
            this.state.cursorType +
            " " +
            (this.state.closed ? " closed-window " : "") +
            (this.state.maximized ? " duration-300 window-maximized" : "") +
            windowFrame +
            (this.props.minimized ? " opacity-0 invisible duration-200 " : "") +
            (this.props.isFocused ? " z-30 " : " z-20 notFocused") +
            " opened-window overflow-hidden min-w-1/4 min-h-1/4 main-window absolute flex flex-col"
          }
          id={this.id}
        >
          <WindowYBorder resize={this.handleHorizontalResize} />
          <WindowXBorder resize={this.handleVerticleResize} />
          <WindowTopBar
            os={os}
            title={this.props.title}
            icon={this.props.icon}
          />
          <WindowEditButtons
            os={os}
            minimize={this.minimizeWindow}
            maximize={this.maximizeWindow}
            isMaximised={this.state.maximized}
            close={this.closeWindow}
            id={this.id}
          />
          {this.id === "settings" ? (
            <Settings
              changeBackgroundImage={this.props.changeBackgroundImage}
              currBgImgName={this.props.bg_image_name}
              os={os}
              changeOS={this.props.changeOS}
            />
          ) : (
            <WindowMainScreen
              os={os}
              screen={this.props.screen}
              title={this.props.title}
              addFolder={
                this.props.id === "terminal" ? this.props.addFolder : null
              }
              openApp={this.props.openApp}
            />
          )}
        </div>
      </Draggable>
    );
  }
}

export default Window;

// Window's title bar
// (every variant keeps "bg-ub-window-title": it is the window's drag handle)
export function WindowTopBar(props) {
  if (props.os === "windows") {
    return (
      <div className="relative bg-ub-window-title win-titlebar flex items-center flex-shrink-0 w-full text-white select-none">
        <img
          src={props.icon}
          alt=""
          draggable="false"
          className="w-4 h-4 ml-3 mr-2 rounded-sm object-cover flex-shrink-0"
        />
        <span className="text-xs truncate">{props.title}</span>
      </div>
    );
  }

  if (props.os === "macos") {
    return (
      <div className="relative bg-ub-window-title mac-titlebar flex items-center justify-center flex-shrink-0 w-full select-none">
        <span className="truncate">{props.title}</span>
      </div>
    );
  }

  return (
    <div
      className={
        " relative bg-ub-window-title border-t-2 border-white border-opacity-5 py-1.5 px-3 text-white w-full select-none rounded-b-none"
      }
    >
      <div className="flex justify-center text-sm font-bold">{props.title}</div>
    </div>
  );
}

// Window's Borders
export class WindowYBorder extends Component {
  componentDidMount() {
    this.trpImg = new Image(0, 0);
    this.trpImg.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    this.trpImg.style.opacity = 0;
  }
  render() {
    return (
      <div
        className=" window-y-border border-transparent border-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        onDragStart={(e) => {
          e.dataTransfer.setDragImage(this.trpImg, 0, 0);
        }}
        onDrag={this.props.resize}
      ></div>
    );
  }
}

export class WindowXBorder extends Component {
  componentDidMount() {
    this.trpImg = new Image(0, 0);
    this.trpImg.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    this.trpImg.style.opacity = 0;
  }
  render() {
    return (
      <div
        className=" window-x-border border-transparent border-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        onDragStart={(e) => {
          e.dataTransfer.setDragImage(this.trpImg, 0, 0);
        }}
        onDrag={this.props.resize}
      ></div>
    );
  }
}

// Window's Edit Buttons
// (the close button keeps its "close-<id>" id: the terminal's `exit` clicks it)
export function WindowEditButtons(props) {
  if (props.os === "windows") {
    return (
      <div className="win-caption select-none">
        <button
          type="button"
          tabIndex="-1"
          aria-label="Minimize"
          className="win-caption-btn"
          onClick={props.minimize}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <path d="M0 5h10" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>
        <button
          type="button"
          tabIndex="-1"
          aria-label={props.isMaximised ? "Restore" : "Maximize"}
          className="win-caption-btn"
          onClick={props.maximize}
        >
          {props.isMaximised ? (
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              aria-hidden="true"
            >
              <rect x="0.5" y="2.5" width="7" height="7" rx="1" />
              <path d="M2.5 2.5v-1a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-1" />
            </svg>
          ) : (
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              aria-hidden="true"
            >
              <rect x="0.5" y="0.5" width="9" height="9" rx="1" />
            </svg>
          )}
        </button>
        <button
          type="button"
          tabIndex="-1"
          id={`close-${props.id}`}
          aria-label="Close"
          className="win-caption-btn is-close"
          onClick={props.close}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <path
              d="M0.5 0.5l9 9M9.5 0.5l-9 9"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        </button>
      </div>
    );
  }

  if (props.os === "macos") {
    return (
      <div className="mac-lights select-none">
        <button
          type="button"
          tabIndex="-1"
          id={`close-${props.id}`}
          aria-label="Close"
          className="mac-light is-close"
          onClick={props.close}
        >
          <svg viewBox="0 0 8 8" aria-hidden="true">
            <path d="M1.5 1.5l5 5M6.5 1.5l-5 5" stroke="#000" strokeWidth="1.2" />
          </svg>
        </button>
        <button
          type="button"
          tabIndex="-1"
          aria-label="Minimize"
          className="mac-light is-minimize"
          onClick={props.minimize}
        >
          <svg viewBox="0 0 8 8" aria-hidden="true">
            <path d="M1 4h6" stroke="#000" strokeWidth="1.2" />
          </svg>
        </button>
        <button
          type="button"
          tabIndex="-1"
          aria-label={props.isMaximised ? "Restore" : "Maximize"}
          className="mac-light is-maximize"
          onClick={props.maximize}
        >
          <svg viewBox="0 0 8 8" aria-hidden="true">
            <path d="M4 1v6M1 4h6" stroke="#000" strokeWidth="1.2" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="absolute select-none right-0 top-0 mt-1 mr-1 flex justify-center items-center">
      <span
        className="mx-1.5 bg-white bg-opacity-0 hover:bg-opacity-10 rounded-full flex justify-center mt-1 h-5 w-5 items-center"
        onClick={props.minimize}
      >
        <img
          src="./themes/Yaru/window/window-minimize-symbolic.svg"
          alt="ubuntu window minimize"
          className="h-5 w-5 inline"
        />
      </span>
      {props.isMaximised ? (
        <span
          className="mx-2 bg-white bg-opacity-0 hover:bg-opacity-10 rounded-full flex justify-center mt-1 h-5 w-5 items-center"
          onClick={props.maximize}
        >
          <img
            src="./themes/Yaru/window/window-restore-symbolic.svg"
            alt="ubuntu window restore"
            className="h-5 w-5 inline"
          />
        </span>
      ) : (
        <span
          className="mx-2 bg-white bg-opacity-0 hover:bg-opacity-10 rounded-full flex justify-center mt-1 h-5 w-5 items-center"
          onClick={props.maximize}
        >
          <img
            src="./themes/Yaru/window/window-maximize-symbolic.svg"
            alt="ubuntu window maximize"
            className="h-5 w-5 inline"
          />
        </span>
      )}
      <button
        tabIndex="-1"
        id={`close-${props.id}`}
        className="mx-1.5 focus:outline-none cursor-default bg-ub-orange bg-opacity-90 hover:bg-opacity-100 rounded-full flex justify-center mt-1 h-5 w-5 items-center"
        onClick={props.close}
      >
        <img
          src="./themes/Yaru/window/window-close-symbolic.svg"
          alt="ubuntu window close"
          className="h-5 w-5 inline"
        />
      </button>
    </div>
  );
}

// Window's Main Screen
export class WindowMainScreen extends Component {
  constructor() {
    super();
    this.state = {
      setDarkBg: false,
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ setDarkBg: true });
    }, 3000);
  }
  render() {
    // Ubuntu's aubergine backdrop only belongs to Ubuntu windows
    const isUbuntu = !this.props.os || this.props.os === "ubuntu";
    return (
      <div
        className={
          "w-full flex-grow z-20 max-h-full overflow-y-auto windowMainScreen" +
          (!isUbuntu
            ? " os-window-body"
            : this.state.setDarkBg
            ? " bg-ub-drk-abrgn "
            : " bg-ub-cool-grey")
        }
      >
        {this.props.addFolder
          ? displayTerminal(this.props.addFolder, this.props.openApp)
          : this.props.screen()}
      </div>
    );
  }
}
