/* eslint-disable no-unused-vars */
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import PageBuilder from "./pages/PageBuilder";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pagebuilder" element={<PageBuilder />} />
    </Routes>
  );
}

export default App;
