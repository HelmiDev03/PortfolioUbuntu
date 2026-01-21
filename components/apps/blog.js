import React, { Component } from "react";

export class Blog extends Component {
  constructor() {
    super();
    this.blog_url = "https://my-blog-pi-mocha.vercel.app/";
    this.state = {
      url: "https://my-blog-pi-mocha.vercel.app/",
      display_url: "https://my-blog-pi-mocha.vercel.app/",
    };
  }

  componentDidMount() {
    let lastVisitedUrl = localStorage.getItem("blog-url");
    let lastDisplayedUrl = localStorage.getItem("blog-display-url");
    if (lastVisitedUrl !== null && lastVisitedUrl !== undefined) {
      this.setState(
        { url: lastVisitedUrl, display_url: lastDisplayedUrl },
        this.refreshBlog
      );
    }
  }

  storeVisitedUrl = (url, display_url) => {
    localStorage.setItem("blog-url", url);
    localStorage.setItem("blog-display-url", display_url);
  };

  refreshBlog = () => {
    document.getElementById("blog-screen").src += "";
  };

  goToHome = () => {
    this.setState({
      url: this.blog_url,
      display_url: "https://my-blog-pi-mocha.vercel.app/",
    });
    this.refreshBlog();
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
      this.setState({ url, display_url: url });
      this.storeVisitedUrl(url, display_url);
      document.getElementById("blog-url-bar").blur();
    }
  };

  handleDisplayUrl = (e) => {
    this.setState({ display_url: e.target.value });
  };

  displayUrlBar = () => {
    return (
      <div className="w-full pt-0.5 pb-1 flex justify-start items-center text-white text-sm border-b border-gray-900">
        <div
          onClick={this.refreshBlog}
          className=" ml-2 mr-1 flex justify-center items-center rounded-full bg-gray-50 bg-opacity-0 hover:bg-opacity-10"
        >
          <img
            className="w-5"
            src="./themes/Yaru/status/chrome_refresh.svg"
            alt="Ubuntu Blog Refresh"
          />
        </div>
        <div
          onClick={this.goToHome}
          className=" mr-2 ml-1 flex justify-center items-center rounded-full bg-gray-50 bg-opacity-0 hover:bg-opacity-10"
        >
          <img
            className="w-5"
            src="./themes/Yaru/status/chrome_home.svg"
            alt="Ubuntu Blog Home"
          />
        </div>
        <input
          onKeyDown={this.checkKey}
          onChange={this.handleDisplayUrl}
          value={this.state.display_url}
          id="blog-url-bar"
          className="outline-none bg-ub-grey rounded-full pl-3 py-0.5 mr-3 w-5/6 text-gray-300 focus:text-white"
          type="url"
          spellCheck={false}
          autoComplete={false}
        />
      </div>
    );
  };

  render() {
    return (
      <div className="h-full w-full bg-ub-cool-grey overflow-hidden">
        <iframe
          src={this.blog_url}
          className="h-full w-full block"
          id="blog-screen"
          frameBorder="0"
          title="Ubuntu Blog"
          style={{ border: 'none', margin: 0, padding: 0, display: 'block' }}
        ></iframe>
      </div>
    );
  }
}

export default Blog;

export const displayBlog = () => {
  return <Blog> </Blog>;
};
