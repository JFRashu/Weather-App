import React, { useState } from 'react'
import VideoHero from '../Components/VideoHero'

import  Forecast_data  from '../Components/Forecast_data'
import AirPollution from '../Components/AirPollution';
import WeatherMaps from '../Components/WeatherMaps';

const Home = () => {
  
  return (
    <div>
      <VideoHero/>
      {/* <CurrentInfo/> */}
     <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
      <Forecast_data/>
     <AirPollution/>
     <WeatherMaps/>
    </div>
    </div>
    
  )
}

export default Home
