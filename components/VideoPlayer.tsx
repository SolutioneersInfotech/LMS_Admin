import { useEffect } from "react";

type VideoPlayerProps = {
  otp: string;
  playbackInfo: string;
}; 

function VideoPlayer({ otp, playbackInfo }:VideoPlayerProps) {
  useEffect(() => {
    const container = document.getElementById("vdo-player");
    if (container) {
      container.innerHTML = `
        <iframe 
          id="vdo-iframe" 
          style="width:100%; height:360px;" 
          src="https://player.vdocipher.com/v2/?otp=${otp}&playbackInfo=${playbackInfo}" 
          allowFullScreen="true" 
          allow="encrypted-media">
        </iframe>`;
    }
  }, [otp, playbackInfo]);

  return <div id="vdo-player" />;
}

export default VideoPlayer;