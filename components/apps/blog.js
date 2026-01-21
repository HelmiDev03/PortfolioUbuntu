import React, { Component } from "react";

export class Blog extends Component {

      constructor() {
    super();
    this.home_url = "https://my-blog-pi-mocha.vercel.app/";
    this.state = {
      url: "https://my-blog-pi-mocha.vercel.app/",
      display_url: "https://my-blog-pi-mocha.vercel.app/",
    };
  }


  storeVisitedUrl = (url, display_url) => {
    localStorage.setItem("chrome-url", url);
    localStorage.setItem("chrome-display-url", display_url);
  };

  refreshChrome = () => {
    document.getElementById("chrome-screen").src += "";
  };

  goToHome = () => {
    this.setState({
      url: this.home_url,
      display_url: "https://www.google.com",
    });
    this.refreshChrome();
  };

  checkKey = (e) => {
    if (e.key === "Enter") {
      let url = e.target.value;
      let display_url = "";

      url = url.trim();
      if (url.length === 0) return;

      if (url.indexOf("http://") !== 0 && url.indexOf("https://") !== 0) {
        url = "https://" + url;
      }

      url = encodeURI(url);
      display_url = url;
      if (url.includes("google.com")) {
        // 😅
        url = "https://www.google.com/webhp?igu=1";
        display_url = "https://www.google.com";
      }
      this.setState({ url, display_url: url });
      this.storeVisitedUrl(url, display_url);
      document.getElementById("chrome-url-bar").blur();
    }
  };

  handleDisplayUrl = (e) => {
    this.setState({ display_url: e.target.value });
  };
   displayUrlBar = () => {
    return (
      <div className="w-full pt-0.5 pb-1 flex justify-start items-center text-white text-sm border-b border-gray-900 sticky top-0 z-20 bg-ub-cool-grey">
        <div
          onClick={this.refreshChrome}
          className=" ml-2 mr-1 flex justify-center items-center rounded-full bg-gray-50 bg-opacity-0 hover:bg-opacity-10"
        >
          <img
            className="w-5"
            src="./themes/Yaru/status/chrome_refresh.svg"
            alt="Ubuntu Chrome Refresh"
          />
        </div>
        <div
          onClick={this.goToHome}
          className=" mr-2 ml-1 flex justify-center items-center rounded-full bg-gray-50 bg-opacity-0 hover:bg-opacity-10"
        >
          <img
            className="w-5"
            src="./themes/Yaru/status/chrome_home.svg"
            alt="Ubuntu Chrome Home"
          />
        </div>
        <input
          onKeyDown={this.checkKey}
          onChange={this.handleDisplayUrl}
          value={this.state.display_url}
          id="chrome-url-bar"
          className="outline-none bg-ub-grey rounded-full pl-3 py-0.5 mr-3 w-5/6 text-gray-300 focus:text-white"
          type="url"
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    );
  };

  render() {
    return (
   
       <div className="h-full w-full flex flex-col bg-ub-cool-grey min-h-0">
      
        <iframe
          src={this.state.url}
          title="Ubuntu Blog"
          className="flex-grow min-h-0 w-full bg-ub-cool-grey"
        ></iframe>
      </div>
    );
  }
}

export default Blog;

export const displayBlog = () => {
  return <Blog> </Blog>;
};
