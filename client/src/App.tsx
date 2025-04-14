import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./routes/Home"
import Generate from "./routes/Generate"
import About from "./routes/About"
import { Error } from "./routes/Error"
import Editing from "./routes/Editing"

function App() {

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/dashboard"} element={<Generate />} />
          <Route path={"/about"} element={<About />} />
          <Route path={"/template/:id/resume"} element={<Editing />} />
          <Route path={"/*"} element={<Error />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
