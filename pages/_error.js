import React from "react";

function Error({ statusCode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-ub-cool-grey text-white font-sans">
      <h1 className="text-4xl font-bold mb-4">
        {statusCode ? `Error ${statusCode}` : "An error occurred on client"}
      </h1>
      <p className="text-gray-300 text-sm mb-6">
        Please refresh the page or return to the desktop.
      </p>
      <a
        href="/"
        className="px-4 py-2 bg-ub-orange text-white rounded font-bold hover:bg-opacity-90 transition-all"
      >
        Go to Desktop
      </a>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
