import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Home from "./routes/HomePage"
import Generate from "./routes/TemplateView"
import './App.css'
import { Error } from "./routes/ErrorPage"
import Editing from "./routes/ResumeEditor"
import { FormProvider } from "./context/FormContext"
import PricingPage from "./routes/PricingPage"
import AuthPage from "./routes/LoginPage"
import HistoryPage from "./routes/HistoryPage"
import { Toaster } from "sonner"

function App() {

  return (
    <>
      <Router>
        <FormProvider>
          <Toaster />
          <Routes>
            <Route path={"/login"} element={<AuthPage />} />
            <Route path={"/"} element={<Home />} />
            <Route path={"/dashboard"} element={<Generate />} />
            <Route path={"/pricing"} element={<PricingPage />} />
            <Route path={"/history"} element={<HistoryPage />} />
            <Route path={"/template/:id/resume"} element={<Editing />} />
            <Route path={"/*"} element={<Error />} />
          </Routes>
        </FormProvider>
      </Router>
    </>
  )
}

export default App
