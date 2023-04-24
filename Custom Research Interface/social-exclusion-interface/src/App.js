import './App.css';
import {Route, Routes} from "react-router-dom";
import Instructions from "./routes/instructions";
import Captcha from "./routes/captcha";
import Experiment from "./routes/experiment/experiment";
import ExperimentProvider from "./context/ExperimentContext/ExperimentProvider";

function App() {
  return (
    <div className="App">
      <ExperimentProvider>
        <Routes>
          <Route path="/" element={<Instructions />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/captcha" element={<Captcha />} />
          <Route path="/experiment" element={<Experiment />} />
        </Routes>
      </ExperimentProvider>
    </div>
  );
}

export default App;
