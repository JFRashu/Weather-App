import React from 'react';
import { ArrowRight } from 'lucide-react';

const VideoHero = () => {
  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          className="object-cover w-full h-full"
          style={{ filter: 'brightness(0.7)' }} // Darkens the video slightly
        >
          <source 
            src="/public/Videos/Back_ground.mp4" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
        
        {/* Optional overlay to make text more readable */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full">
        <div className="container mx-auto px-4 h-full">
          <div className="flex flex-col justify-center h-full max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Welcome to Our Website
            </h1>
            
            <p className="text-xl text-white/90 mb-8">
              Discover amazing features and services that will transform your experience.
              Join us on this exciting journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3 bg-white text-black rounded-lg 
                               hover:bg-white/90 transition-colors 
                               flex items-center justify-center gap-2">
                Get Started
                <ArrowRight size={20} />
              </button>
              
              <button className="px-8 py-3 bg-transparent border-2 
                               border-white text-white rounded-lg
                               hover:bg-white/10 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoHero;