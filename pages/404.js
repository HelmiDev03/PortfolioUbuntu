import React from "react";

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-ub-cool-grey text-white font-sans">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <a
        href="/"
        className="px-4 py-2 bg-ub-orange text-white rounded font-bold hover:bg-opacity-90 transition-all"
      >
        Go to Desktop
      </a>
    </div>
  );
}
