import React, { Component } from "react";

export default class Tutorial extends Component {
  constructor() {
    super();
    this.state = {
      currentStep: 0,
    };
  }

  componentDidMount() {
    // Add keyboard event listeners
    document.addEventListener("keydown", this.handleKeyPress);
  }

  componentWillUnmount() {
    // Cleanup keyboard event listeners
    document.removeEventListener("keydown", this.handleKeyPress);
  }

  handleKeyPress = (e) => {
    if (!this.props.visible) return;

    switch (e.key) {
      case "Escape":
        this.handleClose();
        break;
      case "ArrowRight":
        if (this.state.currentStep < this.tutorialSteps.length - 1) {
          this.nextStep();
        }
        break;
      case "ArrowLeft":
        if (this.state.currentStep > 0) {
          this.prevStep();
        }
        break;
      default:
        break;
    }
  };

  tutorialSteps = [
    {
      title: "Welcome to Helmi's Ubuntu Portfolio! 🎉",
      description:
        "This is an interactive Ubuntu 20.04 themed portfolio website. Let me show you around and help you discover all the features!",
      image: "/tutorial/welcome.png",
      highlight: null,
    },
    {
      title: "The Top Navigation Bar",
      description:
        "At the top, you'll find the navbar with 'Activities' on the left, the current time in the center, and system status on the right. Click on the status icon to access settings, lock screen, and power options.",
      image: null,
      highlight: ".main-navbar-vp",
    },
    {
      title: "🤖 AI Assistant",
      description:
        "Your intelligent chat companion! The AI Assistant lets you have conversations, ask questions, and get instant help. It's powered by advanced AI to assist you with various tasks. Click the AI Assistant icon on the sidebar to start chatting!",
      image: "/tutorial/chat1.png",
      highlight: null,
    },
    {
      title: "💼 About Helmi",
      description:
        "Get to know me better! This app showcases my professional background, skills, experience, and projects. Learn about my journey as a developer and what drives my passion for technology.",
      image: "/tutorial/helmi1.png",
      highlight: null,
    },
    {
      title: "📁 File Manager (Cloud Explorer)",
      description:
        "Browse your cloud files with an Ubuntu Nautilus-style UI. Guest is read-only by default; login with the portfolio password to switch to editor (helmi) and enable create/upload/rename/delete. Previews for text/code, images, audio/video, PDFs, and Office docs. Deletions also remove storage objects. Mobile-friendly with quick nav for Documents/Computer.",
      image: null,
      highlight: null,
    },
    {
      title: "💻 Visual Studio Code",
      description:
        "A powerful code editor for developers! Browse through my code, see my coding style, and explore various projects. VS Code is where the magic happens - it's my primary development environment.",
      image: "/tutorial/vscode.png",
      highlight: null,
    },
    {
      title: "🎵 Spotify",
      description:
        "Enjoy some music while exploring! Spotify integration lets you listen to curated playlists and discover new tracks. Music keeps the creative energy flowing while you browse my portfolio.",
      image: "/tutorial/spotify.png",
      highlight: null,
    },
    {
      title: "⚙️ Settings",
      description:
        "Customize your experience! Adjust the desktop wallpaper, control brightness, manage volume, and personalize the interface to your liking. Access Settings from the status menu in the top-right corner.",
      image: "/tutorial/wal.png",
      highlight: null,
    },
    {
      title: "🎮 Face Gesture Control",
      description:
        "Control with your face! This innovative app uses your webcam to detect facial gestures and lets you interact with the interface hands-free. A fun demonstration of computer vision technology.",
      image: "/tutorial/face.png",
      highlight: null,
    },
    {
      title: "✉️ Contact Me",
      description:
        "Let's connect! Use this app to send me a message, share your thoughts, or discuss potential collaborations. I'm always excited to hear from fellow developers and tech enthusiasts.",
      image: "/tutorial/contact.png",
      highlight: null,
    },
    
    {
      title: "🏎️ Racing Game",
      description:
        "Take a break and have fun! This interactive racing game lets you drive and compete. Use keyboard controls to steer and accelerate. Perfect for a quick gaming session while exploring the portfolio.",
      image: "/tutorial/car.png",
      highlight: null,
    },

    {
      title: "⏰ Circle Clock",
      description:
        "Test your reflexes and timing! Circle Clock is a minimalist game where you must click when the two balls align on the circle. Score points by timing your clicks perfectly. The game speeds up as you progress, challenging your reaction time!",
      image: "/tutorial/clock.png",
      highlight: null,
    },

    {
      title: "🖥️ Terminal",
      description:
        "Command line power! The Terminal app gives you access to a functional bash-like interface. Execute commands, explore the file system, and experience a real Linux terminal environment right in your browser.",
      image: "/tutorial/terminal.png",
      highlight: null,
    },

    {
      title: "Ready to Explore!",
      description:
        "You're all set! Feel free to explore the portfolio. You can access this tutorial anytime by clicking the '?' button in the top navigation bar. Enjoy your experience!",
      
      highlight: null,
    },
  ];

  nextStep = () => {
    if (this.state.currentStep < this.tutorialSteps.length - 1) {
      this.setState({ currentStep: this.state.currentStep + 1 }, () => {
        this.updateHighlight();
      });
    }
  };

  prevStep = () => {
    if (this.state.currentStep > 0) {
      this.setState({ currentStep: this.state.currentStep - 1 }, () => {
        this.updateHighlight();
      });
    }
  };

  handleClose = () => {
    this.setState({ currentStep: 0 });
    this.removeHighlight();
    this.props.onClose();
  };

  updateHighlight = () => {
    // Remove previous highlight
    this.removeHighlight();

    // Add new highlight if exists
    setTimeout(() => {
      const currentStepData = this.tutorialSteps[this.state.currentStep];
      if (currentStepData.highlight) {
        const elements = document.querySelectorAll(currentStepData.highlight);
        if (elements && elements.length > 0) {
          elements.forEach((element) => {
            element.classList.add("tutorial-highlight");
          });
        }
      }
    }, 150);
  };

  removeHighlight = () => {
    const highlighted = document.querySelectorAll(".tutorial-highlight");
    highlighted.forEach((el) => {
      el.classList.remove("tutorial-highlight");
    });
  };

  componentDidUpdate(prevProps, prevState) {
    // Update highlight when step changes or tutorial becomes visible
    if (this.props.visible && !prevProps.visible) {
      this.updateHighlight();
    } else if (!this.props.visible && prevProps.visible) {
      this.removeHighlight();
    }
  }

  render() {
    if (!this.props.visible) return null;

    const currentStepData = this.tutorialSteps[this.state.currentStep];
    const progress =
      ((this.state.currentStep + 1) / this.tutorialSteps.length) * 100;

    return (
      <>
        {/* Overlay with animation */}
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-[100] transition-all duration-500"
          onClick={this.handleClose}
          aria-label="Tutorial overlay"
          style={{
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
          }}
        />

        {/* Tutorial Card */}
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101] w-11/12 max-w-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tutorial-title"
        >
          <div className="bg-ub-cool-grey rounded-lg shadow-2xl border border-gray-800 overflow-hidden">
            {/* Progress Bar */}
            <div className="h-1 bg-gray-700 relative">
              <div
                className="h-full bg-gradient-to-r from-ubb-orange to-yellow-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={this.state.currentStep + 1}
                aria-valuemin="1"
                aria-valuemax={this.tutorialSteps.length}
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2
                id="tutorial-title"
                className="text-xl font-semibold text-white"
              >
                {currentStepData.title}
              </h2>
              <button
                onClick={this.handleClose}
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-ubb-orange"
                aria-label="Close tutorial"
                tabIndex="0"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Image Display */}
            {currentStepData.image && (
              <div className="w-full bg-gray-900">
                <img
                  src={currentStepData.image}
                  alt={`Tutorial step ${this.state.currentStep + 1}: ${currentStepData.title}`}
                  className="w-full h-64 sm:h-80 object-cover"
                  style={{ objectPosition: 'center' }}
                  width={currentStepData.imagewidth ? currentStepData.imagewidth : "100%"}
                  height={currentStepData.imageheight ? currentStepData.imageheight : "auto"}
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6 sm:p-8">
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                {currentStepData.description}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 bg-ub-grey border-t border-gray-700">
              {/* Step Counter */}
              <div className="text-sm text-gray-400">
                Step {this.state.currentStep + 1} of{" "}
                {this.tutorialSteps.length}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={this.prevStep}
                  disabled={this.state.currentStep === 0}
                  className={`px-4 py-2 rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-ubb-orange ${
                    this.state.currentStep === 0
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                  aria-label="Previous step"
                  tabIndex="0"
                >
                  Previous
                </button>

                {this.state.currentStep < this.tutorialSteps.length - 1 ? (
                  <button
                    onClick={this.nextStep}
                    className="px-4 py-2 bg-ubb-orange hover:bg-orange-600 text-white rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-ubb-orange"
                    aria-label="Next step"
                    tabIndex="0"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={this.handleClose}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-green-500"
                    aria-label="Finish tutorial"
                    tabIndex="0"
                  >
                    Finish
                  </button>
                )}
              </div>
            </div>

            {/* Keyboard Hints */}
            <div className="px-4 py-2 bg-gray-800 text-xs text-gray-400 text-center">
              <span className="hidden sm:inline">
                💡 Use arrow keys to navigate • Press Esc to close
              </span>
              <span className="sm:hidden">
                💡 Tap to navigate • Tap X to close
              </span>
            </div>
          </div>
        </div>
      </>
    );
  }
}
