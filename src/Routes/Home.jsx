import React from 'react'
import VideoHero from '../Components/VideoHero'

import  Forecast  from '../Components/Forecast_data'

const Home = () => {
  return (
    <div >
      <VideoHero/>
      {/* <CurrentInfo/> */}
      <Forecast/>
    </div>
  )
}

export default Home
