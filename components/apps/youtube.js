import React from 'react';
import YouTube from "react-youtube";

const You_Tube = () => {
  
  const options = {
    height: '300',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 1,
    },
  };

  

  return (
    <div className="w-full flex-col flex-grow z-20 max-h-full overflow-y-auto windowMainScreen select-none bg-ub-cool-grey">
      <div className="grid grid-cols-2 gap-4 p-4 ">
        {[
          "jPVOio9fb1Y",
          "CeGp17Rvuy0",
          "CgKxdpeAg4U",
          "AayWIqfZrEA",
          "VACqxjSPLok",
          "aBMjHDGfrqE",
          "DMZCgEPEJFA",
          "n39xqWHTKl0",
          "vM27sbh4lPE",
          "rYerDuJIjXQ",
          "vh91x1r28Pc",
          "AUIGrrlJ6RE",
          "iykqaV6gzG8",
          "W0LxcKSITRA",
        ].map((videoId, index) => (
          <YouTube key={index} videoId={videoId} opts={options} id={`video${index}`} />
        ))}
      </div>
    </div>
  );
};

export default You_Tube;

export const displayYouTube = () => {
  return <You_Tube />;
}
