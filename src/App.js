/*
 * @Author: weiyayun
 * @Date: 2023-02-07 20:35:33
 * @Interface:
 * @Description:
 */
import React, { useRef } from "react";
import "./App.css";
import Mark from "./components/mark";
function App() {
  const canvasRef = useRef(null);
  return (
    <div className="App">
      <Mark
        ref={canvasRef}
        width={300}
        height={300}
        brushRadius={1}
        color={"red"}
        imgSrc="./mark/two.jpeg"
        type="square"
        fileName="方形"
      />
    </div>
  );
}

export default App;
