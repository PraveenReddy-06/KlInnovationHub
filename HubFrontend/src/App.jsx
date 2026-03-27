import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./Pages/SignUpLogin/SignUp"
import Login from "./Pages/SignUpLogin/Login";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp/>}/>
        <Route path="/Signup" element={<SignUp/>}/>
        <Route path="/login" element={<Login/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
