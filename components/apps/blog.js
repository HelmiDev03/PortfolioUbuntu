import React, { Component } from "react";

export class Blog extends Component {
  render() {
    return (
      <iframe
        src="https://my-blog-pi-mocha.vercel.app/"
        frameBorder="0"
        title="Ubuntu Blog"
        className="h-full w-full bg-ub-cool-grey"
      ></iframe>
    );
  }
}

export default Blog;

export const displayBlog = () => {
  return <Blog> </Blog>;
};
