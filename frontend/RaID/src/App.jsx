import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import { APIContext } from "./components/Context";
import Login from "./components/Login";
import Home from "./components/Home";


function App() {
  const { } =
    useContext(APIContext);
  if (
    
  ) {
    return <h1>Loading</h1>;
  } else {
    return (
      <>
        <APIProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/Home" replace />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Login" element={<Login />} />
          </Routes>
        </APIProvider>
      </>
    );
  }
}

export default App;