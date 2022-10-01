import { Routes, Route } from "react-router-dom";
import {
  Home,
  PollingResult,
  Question,
  QuestionForm,
  StudentInfo,
} from "./pages";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/question" element={<Question />} />
        <Route path="/studentInfo" element={<StudentInfo />} />
        <Route path="/questionForm" element={<QuestionForm />} />
        <Route path="/pollingResult" element={<PollingResult />} />
      </Routes>
    </div>
  );
}

export default App;
