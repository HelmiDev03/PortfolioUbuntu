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
        <YouTube videoId="jPVOio9fb1Y" opts={options} id="video0" />
        <YouTube videoId="CeGp17Rvuy0" opts={options} id="video1" />
        <YouTube videoId="CgKxdpeAg4U" opts={options} id="video2" />
        <YouTube videoId="VACqxjSPLok" opts={options} id="video3" />
        <YouTube videoId="aBMjHDGfrqE" opts={options} id="video4" />
        <YouTube videoId="DMZCgEPEJFA" opts={options} id="video5" />
        <YouTube videoId="n39xqWHTKl0" opts={options} id="video6" />
        <YouTube videoId="vM27sbh4lPE" opts={options} id="video7" />
        <YouTube videoId="rYerDuJIjXQ" opts={options} id="video8" />
        <YouTube videoId="vh91x1r28Pc" opts={options} id="video9" />
        <YouTube videoId="AUIGrrlJ6RE" opts={options} id="video10" />
        <YouTube videoId="iykqaV6gzG8" opts={options} id="video11" />
        <YouTube videoId="W0LxcKSITRA" opts={options} id="video12" />
      </div>
    </div>
  );
};

export default You_Tube;

export const displayYouTube = () => {
  return <You_Tube />;
}
