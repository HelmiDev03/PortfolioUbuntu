import React, { useState } from "react";

export default function BackgroundImage(props) {
  const [videoError, setVideoError] = useState(false);
  const bg_images = {

    "wall-1": "./images/wallpapers/wall-1.webp",
    "wall-2": "./images/wallpapers/wall-2.webp",
    "wall-3": "./images/wallpapers/wall-3.webp",
    "wall-4": "./images/wallpapers/wall-4.webp",
    "wall-5": "./images/wallpapers/wall-5.webp",
    "wall-6": "./images/wallpapers/wall-6.webp",
    "wall-7": "./images/wallpapers/wall-7.webp",
    "wall-8": "./images/wallpapers/wall-8.webp",
    "wall-10": "./images/wallpapers/wall-10.webp",
    "wall-11": "./images/wallpapers/wall-11.webp",
    "wall-12": "./images/wallpapers/wall-12.webp",
    "wall-13": "./images/wallpapers/wall-13.webp",
    "wall-14": "./images/wallpapers/wall-14.webp",
    "wall-15": "./images/wallpapers/wall-15.webp",
    "wall-16": "./images/wallpapers/wall-16.webp",
    "wall-17": "./images/wallpapers/wall-17.webp",
    "wall-18": "./images/wallpapers/wall-18.webp",
    "wall-19": "./images/wallpapers/wall-19.webp",

  };
  const src = bg_images[props.img] || bg_images["wall-1"];
  const isVideo = typeof src === 'string' && src.endsWith('.mp4') && !videoError;
  return (
    <div className="bg-ubuntu-img absolute -z-10 top-0 right-0 overflow-hidden h-full w-full bg-black">
      {isVideo ? (
        <video
          src={src}
          className="w-full h-full object-cover"
          preload="auto"
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoError(true)}
        />
      ) : (
        <div
          style={{
            backgroundImage: `url(${src || bg_images["wall-1"]})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPositionX: "center",
            width: '100%',
            height: '100%'
          }}
        />
      )}
    </div>
  );
}
