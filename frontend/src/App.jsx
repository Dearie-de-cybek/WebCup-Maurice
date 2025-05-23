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
import PageViewer from './components/PageViewer'
import HallOfFame from "./pages/HallOfFame";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pagebuilder" element={<PageBuilder />} />
      <Route path="/view/:slug" element={<PageViewer />} />
      <Route path="/view/preview" element={<PageViewer />} />
      <Route path="/halloffame" element={<HallOfFame />} />
    </Routes>
  );
}

export default App;
