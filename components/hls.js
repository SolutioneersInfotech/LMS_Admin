import React, { useRef, useEffect, useState } from "react";
import Hls from "hls.js";

const HLSVideoPlayer = ({ videoUrl }) => {
  console.log("videoUrlvideoUrlvideoUrl", videoUrl);
  const videoRef = useRef();
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    let hls;

    setIsVideoReady(false); // reset state on new video URL

    const video = videoRef.current;

    const handleCanPlay = () => setIsVideoReady(true);

    if (Hls.isSupported()) {
      hls = new Hls({
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        lowLatencyMode: true,
        enableWorker: true,
        autoStartLoad: true,
      });
      hls.loadSource(videoUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play(); // auto-play after parsing
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
    }

    video.addEventListener("canplay", handleCanPlay);

    return () => {
      if (hls) hls.destroy();
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [videoUrl]);

  return (
    <div className="relative w-full h-full">
      {!isVideoReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 rounded-lg">
          {/* <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white" /> */}
        </div>
      )}
      <video
        ref={videoRef}
        controls
        autoPlay
        playsInline
        muted
        preload="auto"
        width="100%"
        className="rounded-lg w-full h-full"
      />
    </div>
  );
};

export default HLSVideoPlayer;
