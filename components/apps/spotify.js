import React from "react";

export default function Spotify() {
  return (
    <iframe
      src="https://open.spotify.com/embed/playlist/0eDTiTEalJcs96uae8Neoj"
      width="100%"
      height="380"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      title="Spotify"
      className="h-full w-full bg-ub-cool-grey"
    ></iframe>
  );
}

export const displaySpotify = () => {
  return <Spotify />;
};
