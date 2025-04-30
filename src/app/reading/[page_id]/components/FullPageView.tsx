"use client";
import { useRef, useState } from "react";

const FullPageView = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error("Gagal masuk fullscreen:", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  return (
    <div ref={containerRef} className="relative bg-white p-4 min-h-screen">
      <buttonx
        onClick={toggleFullScreen}
        className="absolute top-4 right-4 z-10 bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700"
      >
        {isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
      </buttonx>
      <div>{children}</div>
    </div>
  );
};

export default FullPageView;
