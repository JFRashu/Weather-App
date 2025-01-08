import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';

const demoVideo = ({ 
  src, 
  poster, 
  title = "Project Demo", 
  description = "Explore the features of our application" 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = React.useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-100 rounded-lg overflow-hidden shadow-lg">
      <div className="relative aspect-video">
        <video 
          ref={videoRef}
          src={src}
          poster={poster}
          onClick={togglePlay}
          onEnded={handleVideoEnd}
          className="w-full h-full object-cover"
        >
          Your browser does not support the video tag.
        </video>

        {!isPlaying && (
          <div 
            className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center cursor-pointer"
            onClick={togglePlay}
          >
            <Play 
              size={64} 
              className="text-white bg-blue-600 rounded-full p-4 hover:bg-blue-700 transition" 
            />
          </div>
        )}

        {isPlaying && (
          <div 
            className="absolute top-4 right-4 z-10"
            onClick={togglePlay}
          >
            <Pause 
              size={32} 
              className="text-white bg-black bg-opacity-50 rounded-full p-2 cursor-pointer hover:bg-opacity-70 transition" 
            />
          </div>
        )}
      </div>

      <div className="p-4 text-center">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>
    </div>
  );
};

export default demoVideo;