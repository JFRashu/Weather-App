
import { ArrowRight, CloudRain, Compass, Map } from 'lucide-react';
import { CurrentInfo } from './CurrentInfo';
import { useNavigate } from 'react-router-dom';

const VideoHero = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-[400px] md:min-h-[500px] lg:min-h-[600px] w-full overflow-hidden">
            {/* Video Background */}
            <div className="absolute inset-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="object-cover w-full h-full"
                >
                    <source
                        src="/public/Videos/Back_ground.mp4"
                        type="video/mp4"
                    />
                    Your browser does not support the video tag.
                </video>

                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full">
                <div className="container mx-auto px-4 py-8 md:py-16 lg:py-18 h-full">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 h-full items-center">
                        {/* Left Side: Weather Intro */}
                        <div
                            data-aos="fade-up"
                            className="w-full lg:w-7/12 xl:w-8/12 space-y-6"
                        >
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

                            {/* Weather Features */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                <div className="flex items-center gap-3 text-white">
                                    <Compass className="w-5 h-5" />
                                    <span>Hourly Forecasts</span>
                                </div>
                                <div className="flex items-center gap-3 text-white">
                                    <Map className="w-5 h-5" />
                                    <span>Interactive Weather Maps</span>
                                </div>
                            </div>

                            {/* Weather CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button  onClick={() => navigate('/forecast')} className="inline-flex items-center px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors duration-300">
                                    Check Forecast
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </button>
                                <button className="inline-flex items-center px-6 py-3 border border-white text-white rounded-lg hover:bg-white/10 transition-colors duration-300">
                                    Weather Alerts
                                </button>
                            </div>
                        </div>

                        {/* Right Side: Current Weather Info */}
                        <div className="w-full sm:w-3/4 lg:w-5/12 xl:w-4/12">
                            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/10 shadow-xl">
                                <CurrentInfo />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Wave Decoration */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg className="w-full text-white/5" viewBox="0 0 1440 64" fill="currentColor" preserveAspectRatio="none">
                    <path d="M0,32L120,37.3C240,43,480,53,720,53.3C960,53,1200,43,1320,37.3L1440,32L1440,64L1320,64C1200,64,960,64,720,64C480,64,240,64,120,64L0,64Z" />
                </svg>
            </div>
        </div>
    );
};

export default VideoHero;