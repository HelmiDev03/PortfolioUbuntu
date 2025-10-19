import React from "react";
import $ from "jquery";

export function Settings(props) {
  const wallpapers = {
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
    "wall-15": "./images/wallpapers/wall-15.webp",
    "wall-16": "./images/wallpapers/wall-16.webp",
    "wall-17": "./images/wallpapers/wall-17.webp",
    "wall-18": "./images/wallpapers/wall-18.webp",
    "wall-19": "./images/wallpapers/wall-19.webp",
   
  };
  const current = wallpapers[props.currBgImgName] || wallpapers["wall-1"];

  let changeBackgroundImage = (e) => {
    // Ensure we read the key from the thumbnail container
    const selectedKey = $(e.target).closest('[data-path]').data('path');
    if (!selectedKey) return;
    props.changeBackgroundImage(selectedKey);
  };

  return (
    <div
      className={
        "w-full flex-col flex-grow z-20 max-h-full overflow-y-auto windowMainScreen select-none bg-ub-cool-grey"
      }
    >
      <div className=" md:w-2/5 w-2/3 h-1/3 m-auto my-4 relative overflow-hidden rounded">
        {String(current || '').endsWith('.mp4') ? (
          <video
            src={current}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <div
            style={{
              backgroundImage: `url(${current})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
              width: '100%',
              height: '100%'
            }}
          />
        )}
      </div>
      <div className="flex flex-wrap justify-center items-center border-t border-gray-900">
        {Object.keys(wallpapers).map((name, index) => {
          return (
            <div
              key={index}
              tabIndex="1"
              onFocus={changeBackgroundImage}
              onClick={changeBackgroundImage}
              data-path={name}
              className={
                (name === props.currBgImgName
                  ? " border-yellow-700 "
                  : " border-transparent ") +
                " md:w-48 md:h-32 md:m-4 m-2 w-28 h-20 outline-none border-4 border-opacity-80 rounded overflow-hidden relative"
              }
            >
              {String(wallpapers[name]).endsWith('.mp4') ? (
                <video
                  src={wallpapers[name]}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <div
                  style={{
                    backgroundImage: `url(${wallpapers[name]})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center center",
                    width: '100%',
                    height: '100%'
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Settings;

export const displaySettings = () => {
  return <Settings> </Settings>;
};
