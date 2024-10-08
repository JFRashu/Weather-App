

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Routes/Layout'
import Home from './Routes/Home'
import Forecast from './Routes/Forecast'
// import Help from './Routes/Help'
// import { About } from './Routes/About'
import AirQuality from './Routes/AirQuality'
import CityComparison from './Routes/City_Comparison'
import { useEffect } from 'react'
import { AOS } from 'aos'
function App() {
  // const [count, setCount] = useState(0)
//   useEffect(() => {
//     AOS.init({
//         duration: 1000, // Duration of animations (in milliseconds)
//         easing: 'ease-in-out', // Easing function for animations
//         once: true, // Whether animation should happen only once or every time you scroll
//     });
// }, []);
  return (
    <div className="dark">
<BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Use 'index' for the home page route */}
          <Route index element={<Home />} />  {/* Home route */}
          <Route path="forecast" element={<Forecast />} />
          {/* <Route path="help" element={<Help />} />
          <Route path="about" element={<About />} /> */}
          <Route path="airquality" element={<AirQuality/>}/>
          <Route path="/citycomparison" element={<CityComparison/>}/>
          {/* Fallback route (for non-existing paths), redirecting to Home */}
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  )

}

export default App
