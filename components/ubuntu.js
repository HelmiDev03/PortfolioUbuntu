import React, { Component } from "react";
import Head from "next/head";
import BootingScreen from "./screen/booting_screen";
import Desktop from "./screen/desktop";
import LockScreen from "./screen/lock_screen";
import Navbar from "./screen/navbar";
import Tutorial from "./util components/tutorial";
import ReactGA from "react-ga";
import {
  DEFAULT_OS,
  OS_DEFAULT_WALLPAPER,
  OS_FAVICON,
  OS_STORAGE_KEY,
  getOSName,
  isValidOS,
} from "../lib/os";

const DEFAULT_WALLPAPER = "wall-video-2"; // default to b.mp4 for first-time visitors

export default class Ubuntu extends Component {
  constructor() {
    super();
    this.switchingOS = false;
    this.state = {
      os: DEFAULT_OS,
      boot_os: DEFAULT_OS, // OS whose boot screen is on display
      screen_locked: false,
      bg_image_name: DEFAULT_WALLPAPER,
      booting_screen: true,
      shutDownScreen: false,
      showTutorial: false,
    };
  }

  componentDidMount() {
    this.getLocalData();
    this.checkTutorialStatus();
  }

  setTimeOutBootScreen = (duration = 2000) => {
    setTimeout(() => {
      this.setState({ booting_screen: false });
    }, duration);
  };

  // Wallpaper to show for an OS: the visitor's own pick if they made one,
  // otherwise the one that ships with that OS.
  getWallpaperFor = (os) => {
    let bg_image_name = localStorage.getItem("bg-image");
    if (bg_image_name !== null && bg_image_name !== undefined) {
      return bg_image_name;
    }
    return OS_DEFAULT_WALLPAPER[os] || DEFAULT_WALLPAPER;
  };

  getLocalData = () => {
    // Get previously selected operating system
    let os = localStorage.getItem(OS_STORAGE_KEY);
    if (!isValidOS(os)) os = DEFAULT_OS;
    // from here on the state decides what is shown, not the page-load hint
    document.documentElement.removeAttribute("data-os");

    // Get Previously selected Background Image
    this.setState({ os, boot_os: os, bg_image_name: this.getWallpaperFor(os) });

    let booting_screen = localStorage.getItem("booting_screen");
    if (booting_screen !== null && booting_screen !== undefined) {
      // user has visited site before
      this.setState({ booting_screen: false });
    } else {
      // user is visiting site for the first time
      localStorage.setItem("booting_screen", false);
      this.setTimeOutBootScreen();
    }

    // get shutdown state
    let shut_down = localStorage.getItem("shut-down");
    if (shut_down !== null && shut_down !== undefined && shut_down === "true")
      this.shutDown();
    else {
      // Get previous lock screen state
      let screen_locked = localStorage.getItem("screen-locked");
      if (screen_locked !== null && screen_locked !== undefined) {
        this.setState({
          screen_locked: screen_locked === "true" ? true : false,
        });
      }
    }
  };

  lockScreen = () => {
    // google analytics
    ReactGA.pageview("/lock-screen");
    ReactGA.event({
      category: `Screen Change`,
      action: `Set Screen to Locked`,
    });

    this.blurStatusBar();
    setTimeout(() => {
      this.setState({ screen_locked: true });
    }, 100); // waiting for all windows to close (transition-duration)
    localStorage.setItem("screen-locked", true);
  };

  unLockScreen = () => {
    ReactGA.pageview("/desktop");

    window.removeEventListener("click", this.unLockScreen);
    window.removeEventListener("keypress", this.unLockScreen);

    this.setState({ screen_locked: false });
    localStorage.setItem("screen-locked", false);
  };

  changeBackgroundImage = (img_name) => {
    this.setState({ bg_image_name: img_name });
    localStorage.setItem("bg-image", img_name);
  };

  // Every OS shell renders its own status bar, so it may be mid-swap.
  blurStatusBar = () => {
    const statusBar = document.getElementById("status-bar");
    if (statusBar) statusBar.blur();
  };

  // "Reboots" into another operating system: the new OS's boot screen covers
  // the display while the desktop underneath is swapped.
  changeOS = (os) => {
    if (!isValidOS(os) || os === this.state.os || this.switchingOS) return;
    this.switchingOS = true;

    ReactGA.event({
      category: `OS Change`,
      action: `Switched to ${getOSName(os)}`,
    });

    localStorage.setItem(OS_STORAGE_KEY, os);
    this.setState({ booting_screen: true, boot_os: os });
    setTimeout(() => {
      this.setState({ os, bg_image_name: this.getWallpaperFor(os) });
      this.setTimeOutBootScreen(1300);
      this.switchingOS = false;
    }, 500); // boot screen's fade-in (transition-duration)
  };

  shutDown = () => {
    ReactGA.pageview("/switch-off");
    ReactGA.event({
      category: `Screen Change`,
      action: `Switched off the ${getOSName(this.state.os)}`,
    });

    this.blurStatusBar();
    this.setState({ shutDownScreen: true });
    localStorage.setItem("shut-down", true);
  };

  turnOn = () => {
    ReactGA.pageview("/desktop");

    this.setState({ shutDownScreen: false, booting_screen: true });
    this.setTimeOutBootScreen();
    localStorage.setItem("shut-down", false);
  };

  checkTutorialStatus = () => {
    // Check if tutorial has been shown before
    const tutorialShown = localStorage.getItem("tutorialShown_v1");
    
    if (!tutorialShown) {
      // First time visitor - show tutorial after booting screen
      setTimeout(() => {
        if (!this.state.booting_screen && !this.state.screen_locked) {
          this.setState({ showTutorial: true });
        }
      }, 3000); // Show tutorial 3 seconds after boot screen
    }
  };

  openTutorial = () => {
    ReactGA.event({
      category: `Tutorial`,
      action: `Opened Tutorial Manually`,
    });
    this.setState({ showTutorial: true });
  };

  closeTutorial = () => {
    // Mark tutorial as shown
    localStorage.setItem("tutorialShown_v1", "true");
    
    ReactGA.event({
      category: `Tutorial`,
      action: `Closed Tutorial`,
    });
    
    this.setState({ showTutorial: false });
  };

  render() {
    const os = this.state.os;

    return (
      <div
        className={"w-screen h-screen overflow-hidden os-" + os}
        id="monitor-screen"
      >
        {/* The browser tab shows the logo of the running OS (same keys as in Meta) */}
        <Head>
          <link rel="icon" href={OS_FAVICON[os]} key="favicon" />
          <link
            rel="apple-touch-icon"
            href={OS_FAVICON[os]}
            key="apple-touch-icon"
          />
        </Head>
        <LockScreen
          isLocked={this.state.screen_locked}
          bgImgName={this.state.bg_image_name}
          unLockScreen={this.unLockScreen}
        />
        <BootingScreen
          os={this.state.boot_os}
          visible={this.state.booting_screen}
          isShutDown={this.state.shutDownScreen}
          turnOn={this.turnOn}
        />
        {/* Windows and macOS draw their own bars inside the Desktop */}
        {os === "ubuntu" ? (
          <Navbar
            os={os}
            changeOS={this.changeOS}
            lockScreen={this.lockScreen}
            shutDown={this.shutDown}
            openTutorial={this.openTutorial}
          />
        ) : null}
        {/* Keyed by OS so switching starts from a clean desktop */}
        <Desktop
          key={os}
          os={os}
          changeOS={this.changeOS}
          lockScreen={this.lockScreen}
          shutDown={this.shutDown}
          openTutorial={this.openTutorial}
          bg_image_name={this.state.bg_image_name}
          changeBackgroundImage={this.changeBackgroundImage}
        />
        <Tutorial
          os={os}
          visible={this.state.showTutorial}
          onClose={this.closeTutorial}
        />
      </div>
    );
  }
}
