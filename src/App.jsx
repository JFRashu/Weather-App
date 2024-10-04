

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Routes/Layout'
import Home from './Routes/Home'
import Forecast from './Routes/Forecast'
import Help from './Routes/Help'
import { About } from './Routes/About'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <div className="dark">
<BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Use 'index' for the home page route */}
          <Route index element={<Home />} />  {/* Home route */}
          <Route path="forecast" element={<Forecast />} />
          <Route path="help" element={<Help />} />
          <Route path="about" element={<About />} />
          {/* Fallback route (for non-existing paths), redirecting to Home */}
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  )

}

export default App
