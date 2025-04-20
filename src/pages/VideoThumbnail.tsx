import React, { useRef, useEffect, useState } from 'react';

interface VideoThumbnailProps {
  videoUrl: string;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  useEffect(() => {
    const captureThumbnail = async () => {
      if (videoRef.current && canvasRef.current) {
        try {
          await new Promise((resolve) => {
            if (videoRef.current?.readyState >= 1) {
              resolve(null);
            } else {
              videoRef.current?.addEventListener('loadedmetadata', resolve);
            }
          });
          videoRef.current.currentTime = 0.1;
          await new Promise((resolve) => {
            if (videoRef.current?.seeking === false) {
              resolve(null);
            } else {
              videoRef.current?.addEventListener('seeked', resolve);
            }
          });
          canvasRef.current.width = 640;
          canvasRef.current.height = 480;
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            const thumbnailUrl = canvasRef.current.toDataURL();
            setThumbnailUrl(thumbnailUrl);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    captureThumbnail();
  }, [videoUrl]);

  return (
    <div>
      <video ref={videoRef} src={videoUrl} style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {thumbnailUrl && (
        <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
      )}
    </div>
  );
};

export default VideoThumbnail;