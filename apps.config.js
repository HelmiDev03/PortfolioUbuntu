import displaySpotify from './components/apps/spotify';
import displayVsCode from './components/apps/vscode';
import { displayTerminal } from './components/apps/terminal';
import { displaySettings } from './components/apps/settings';
import { displayChrome } from './components/apps/chrome';
import { displayTrash } from './components/apps/trash';
import { displayGedit } from './components/apps/gedit';
import { displayAboutHelmi } from './components/apps/helmi';
import { displayTerminalCalc } from './components/apps/calc';
import {displayYouTube} from './components/apps/youtube';
import {displayAIAssistant} from './components/apps/aiassistant';
import {displayCarGame} from './components/apps/cargame';
//import {displayBot} from './components/apps/chatbot';



const apps = [
    {
        id: "ai-assistant",
        title: "AI Assistant",
        icon: './themes/Yaru/apps/helmigpt.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: true,
        screen: displayAIAssistant,
    },
    {
        id: "chrome",
        title: "Google Chrome",
        icon: './themes/Yaru/apps/chrome.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: true,
        screen: displayChrome,
    },
    {
        id: "calc",
        title: "Calc",
        icon: './themes/Yaru/apps/calc.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: false,
        screen: displayTerminalCalc,
    },
    {
        id: "about-helmi",
        title: "About Helmi",
        icon: './themes/Yaru/system/mala.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: true,
        screen: displayAboutHelmi,
    },
    {
        id: "vscode",
        title: "Visual Studio Code",
        icon: './themes/Yaru/apps/vscode.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: false,
        screen: displayVsCode,
    },
    {
        id: "terminal",
        title: "Terminal",
        icon: './themes/Yaru/apps/bash.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: false,
        screen: displayTerminal,
    },
    {
        id: "spotify",
        title: "Spotify",
        icon: './themes/Yaru/apps/spotify.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: false,
        screen: displaySpotify, // India Top 50 Playlist 😅
    },
    {
        id: "settings",
        title: "Settings",
        icon: './themes/Yaru/apps/gnome-control-center.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: false,
        screen: displaySettings,
    },
    {
        id: "trash",
        title: "Trash",
        icon: './themes/Yaru/system/user-trash-full.png',
        disabled: false,
        favourite: false,
        desktop_shortcut: true,
        screen: displayTrash,
    },
    {
        id: "gedit",
        title: "Contact Me",
        icon: './themes/Yaru/apps/gedit.png',
        disabled: false,
        favourite: false,
        desktop_shortcut: true,
        screen: displayGedit,
    },
    {
        id: "youtube",
        title: "CS1994",
        icon: './themes/Yaru/apps/cs.jpg',
        disabled: false,
        favourite: false,
        desktop_shortcut: true,
        screen: displayYouTube,
    },
    /*
    {
        id: "chatwithhelmi",
        title: "HelmiGPT",
        icon: './themes/Yaru/apps/helmigpt.png',
        disabled: false,
        favourite: false,
        desktop_shortcut: true,
        screen: displayBot,
    },
    */
    {
        id: "cargame",
        title: "Racing Game",
        icon: './themes/Yaru/apps/car.png', // Temporary icon placeholder
        disabled: false,
        favourite: true,
        desktop_shortcut: true,
        screen: displayCarGame,
    },
    
]

export default apps;