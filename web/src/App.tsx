import './index.css'
import {BrowserRouter, Route, Routes} from "react-router";
import Home from "@/pages/home.tsx";
import Redirect from "@/pages/redirect.tsx";
import NotFound from "@/pages/404.tsx";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/:shortUrl" element={<Redirect />}></Route>
              <Route path="*" element={<NotFound />}></Route>
          </Routes>
      </BrowserRouter>
  )
}

export default App
