import { ArrowRight, CloudRain, Compass, Map } from 'lucide-react';
import { CurrentInfo } from './CurrentInfo';
import { useNavigate } from 'react-router-dom';

const VideoHero = () => {
    const navigate = useNavigate();

    return (
        <div className="pt-0"> {/* Add padding top for navbar */}
            <div className="relative w-full h-screen">
                {/* Video Background */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="object-cover w-full h-full"
                    >
                        <source
                            src="/Videos/Back_ground.mp4"
                            type="video/mp4"
                        />
                        Your browser does not support the video tag.
                    </video>
                    <div className="absolute inset-0 bg-black/50" /> {/* Darker overlay */}
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
                            {/* Left Side */}
                            <div className="w-full lg:w-7/12 xl:w-8/12 space-y-6">
                                <div className="flex items-center gap-2 text-white/90">
                                    <CloudRain className="w-5 h-5" />
                                    <span className="text-sm font-medium">Real-Time Weather Updates</span>
                                </div>

                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                                    Your Accurate Weather Companion
                                </h1>

                                <p className="text-lg sm:text-xl text-white/90 max-w-2xl">
                                    Stay ahead of the weather with our precise forecasts and real-time updates.
                                    From daily temperatures to severe weather alerts, get all the weather insights
                                    you need for confident planning, anywhere, anytime.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 text-white">
                                        <Compass className="w-5 h-5" />
                                        <span>Hourly Forecasts</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white">
                                        <Map className="w-5 h-5" />
                                        <span>Interactive Weather Maps</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button 
                                        onClick={() => navigate('/forecast')} 
                                        className="inline-flex items-center px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors duration-300"
                                    >
                                        Check Forecast
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </button>
                                    <button className="inline-flex items-center px-6 py-3 border border-white text-white rounded-lg hover:bg-white/10 transition-colors duration-300">
                                        Weather Alerts
                                    </button>
                                </div>
                            </div>

                            {/* Right Side */}
                            <div className="w-full sm:w-3/4 lg:w-5/12 xl:w-4/12">
                                <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/10 shadow-xl">
                                    <CurrentInfo />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoHero;