import React from "react";
import image from "../assets/utils/Learning.png";
import PreviewFile from "../components/PreviewFile";
const Home = () => {
  return (
    <div className="h-screen bg-white dark:bg-cyan-900">
      <img src={image} className="w-auto h-auto " />
      <button onClick={"_blank"}>Click</button>
      <PreviewFile />
    </div>
  );
};

export default Home;
