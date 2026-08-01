import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Home from "./page/HomePage"
import Generate from "./page/TemplateView"
import './App.css'
import { Error } from "./page/ErrorPage"
import Editing from "./page/ResumeEditor"
import { FormProvider } from "./context/FormContext"
import AuthPage from "./page/LoginPage"
import HistoryPage from "./page/HistoryPage"
import { Toaster } from "sonner"
import { ResumeAnalytics } from "./page/AnalyticsPage"
import PublicRoute from "./routes/PublicRoute"
import PrivateRoute from "./routes/PrivateRoute"

function App() {

  return (
    <>
      <Router>
        <FormProvider>
          <Toaster />
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path={"/login"} element={<AuthPage />} />
              <Route path={"/"} element={<Home />} />
              <Route path={"/*"} element={<Error />} />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path={"/dashboard"} element={<Generate />} />
              <Route path={"/history"} element={<HistoryPage />} />
              <Route path={"/analytics"} element={<ResumeAnalytics />} />
              <Route path={"/template/:id/resume"} element={<Editing />} />
            </Route>
          </Routes>
        </FormProvider>
      </Router>
    </>
  )
}

export default App
