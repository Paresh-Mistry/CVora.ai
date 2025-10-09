import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Navbar from "./components/common/NavigationBar"
import Home from "./routes/HomePage"
import Generate from "./routes/GenerateResume"
import About from "./routes/AboutPage"
import './App.css'
import { Error } from "./routes/ErrorPage"
import Editing from "./routes/ResumeEditor"
import ResumeResult from "./routes/ResumePreview"
import { FormProvider } from "./context/FormContext"

function App() {

  return (
    <>
      <Router>
        <Navbar />
        <FormProvider>
          <Routes>
            <Route path={"/"} element={<Home />} />
            <Route path={"/dashboard"} element={<Generate />} />
            <Route path={"/about"} element={<About />} />
            <Route path={"/template/:id/resume"} element={<Editing />} />
            <Route path="/resume/result" element={<ResumeResult />} />
            <Route path={"/*"} element={<Error />} />
          </Routes>
        </FormProvider>
      </Router>
    </>
  )
}

export default App
