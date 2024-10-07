import React, { useState } from 'react'
import VideoHero from '../Components/VideoHero'

import  Forecast  from '../Components/Forecast_data'

const Home = () => {
  const [lat,setLat] = useState(22.3475);
  const [lon,setLon] = useState(91.8123)
  return (
    <div >
      <VideoHero/>
      {/* <CurrentInfo/> */}
      <Forecast/>
      <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Air Quality Monitor</h1>
      <AirPollution lat={defaultCoordinates.lat} lon={defaultCoordinates.lon} />
    </div>
    </div>
  )
}

export default Home
