// The operating-system "skins" the desktop can run as.

export const OS_STORAGE_KEY = "os-theme";
export const DEFAULT_OS = "ubuntu";

export const OS_LIST = [
  { id: "ubuntu", name: "Ubuntu" },
  { id: "windows", name: "Windows 11" },
  { id: "macos", name: "macOS" },
];

export const isValidOS = (os) => OS_LIST.some((item) => item.id === os);

export const getOSName = (os) =>
  (OS_LIST.find((item) => item.id === os) || OS_LIST[0]).name;

// The OS the visitor last chose. For apps, which are not handed the OS as a prop.
export const getStoredOS = () => {
  if (typeof window === "undefined") return DEFAULT_OS;
  const os = window.localStorage.getItem(OS_STORAGE_KEY);
  return isValidOS(os) ? os : DEFAULT_OS;
};

// Browser tab icon for each OS.
export const OS_FAVICON = {
  ubuntu: "images/logos/ubuntu_icon.png",
  windows: "images/logos/os-windows.svg",
  macos: "images/logos/os-macos.svg",
};

// What the File Manager's "Computer" page reports as the installed system.
export const OS_SYSTEM_INFO = {
  ubuntu: {
    name: "Ubuntu 20.04.3 LTS (Focal Fossa)",
    kernel: "Linux 5.11.0-40-generic x86_64",
    desktop: "GNOME 3.36.8",
  },
  windows: {
    name: "Windows 11 Pro",
    kernel: "Windows NT 10.0 x86_64",
    desktop: "Windows Shell",
  },
  macos: {
    name: "macOS Sonoma",
    kernel: "Darwin (XNU) x86_64",
    desktop: "Aqua",
  },
};

// Pixels each shell reserves above and below the area that windows live in:
// Ubuntu and macOS have a top bar, Windows has a bottom taskbar.
const OS_LAYOUT = {
  ubuntu: { top: 32, bottom: 0 },
  windows: { top: 0, bottom: 48 },
  macos: { top: 28, bottom: 0 },
};

export const getOSLayout = (os) => OS_LAYOUT[os] || OS_LAYOUT[DEFAULT_OS];

// Height of the strip at the bottom of the screen that the macOS dock floats in.
// A window reaching into it makes the dock slide away, like Ubuntu's side bar.
export const MAC_DOCK_ZONE = 76;

// Wallpapers that ship with the Windows and macOS skins.
export const OS_WALLPAPERS = {
  "os-windows": "./images/wallpapers/os-windows.svg",
  "os-macos": "./images/wallpapers/os-macos.svg",
};

// Wallpaper each skin starts with until the visitor picks one in Settings.
export const OS_DEFAULT_WALLPAPER = {
  windows: "os-windows",
  macos: "os-macos",
};
