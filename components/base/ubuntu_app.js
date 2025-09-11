import React, { Component } from "react";
import Draggable from "react-draggable";

export class UbuntuApp extends Component {
  constructor() {
    super();
    this.state = {
      dragging: false,
      dragStartTime: 0,
      isSmallScreen: false
    };
    this.defaultPosition = { x: 0, y: 0 };
  }

  componentDidMount() {
    // Load saved position from localStorage if available
    const savedPosition = localStorage.getItem(`app-position-${this.props.id}`);
    if (savedPosition) {
      try {
        this.defaultPosition = JSON.parse(savedPosition);
      } catch (e) {
        console.error("Error parsing saved position:", e);
      }
    }
    
    // Check screen size on mount
    this.checkScreenSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', this.checkScreenSize);
  }
  
  componentWillUnmount() {
    // Remove event listener when component unmounts
    window.removeEventListener('resize', this.checkScreenSize);
  }
  
  checkScreenSize = () => {
    this.setState({ isSmallScreen: window.innerWidth < 1000});
  }

  openApp = () => {
    // Only open the app if we're not dragging
    if (!this.state.dragging) {
      this.props.openApp(this.props.id);
    }
  };

  handleDragStart = () => {
    this.setState({ 
      dragging: true,
      dragStartTime: Date.now() 
    });
  };

  handleDragStop = (e, data) => {
    // Save the new position to localStorage
    const position = { x: data.x, y: data.y };
    localStorage.setItem(`app-position-${this.props.id}`, JSON.stringify(position));
    
    // Set dragging to false after a short delay to prevent accidental double-click
    setTimeout(() => {
      this.setState({ dragging: false });
    }, 100);
  };

  render() {
    // Create the app content element
    const appContent = (
      <div
        className={`p-1 m-px z-10 bg-white bg-opacity-0 hover:bg-opacity-20 focus:bg-ub-orange focus:bg-opacity-50 focus:border-yellow-700 focus:border-opacity-100 border border-transparent outline-none rounded select-none w-24 h-20 flex flex-col justify-start items-center text-center text-xs font-normal text-white ${this.state.isSmallScreen ? 'cursor-pointer' : 'cursor-move'}`}
        id={"app-" + this.props.id}
        onDoubleClick={this.openApp}
        tabIndex={0}
      >
        <img
          width="40px"
          height="40px"
          className="mb-1 w-10"
          src={this.props.icon}
          alt={"Ubuntu " + this.props.name}
          draggable="false"
        />
        {this.props.name}
      </div>
    );
    
    // If small screen, return the app content without Draggable wrapper
    if (this.state.isSmallScreen) {
      return appContent;
    }
    
    // Otherwise, wrap with Draggable
    return (
      <Draggable
        defaultPosition={this.defaultPosition}
        onStart={this.handleDragStart}
        onStop={this.handleDragStop}
        bounds="parent"
      >
        {appContent}
      </Draggable>
    );
  }
}

export default UbuntuApp;
