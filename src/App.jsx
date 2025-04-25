import React from 'react';
import './App.css';

function App() {
  return (
    <div className="all bg-[#0B1223] h-screen">
      <div className="container mx-auto">
        {/* Section 1: Title */}
        <div className="head  pt-37 text-center" >
          <h1 className="lg:text-5xl text-3xl ">EYE OF VERITAS</h1>
        </div>

        {/* Section 2: Video Player */}
        <div className="video flex md:gap-13 gap-5 justify-center items-center mt-10">
          <video className="md:w-96 w-46 rounded-lg shadow-lg" controls>
            <source src="/videos/video1.mp4" type="video/mp4" />

          </video>

          <video className="md:w-96 w-46 rounded-lg shadow-lg" controls>
            <source src="/videos/video2.mp4" type="video/mp4" />

          </video>



        </div>


        <div className="btn flex justify-evenly items-center  pt-10">
          <button
            type="button"
            className={`text-white font-medium rounded-lg text-sm md:px-12 px-5 md:py-2 py-1 md:ms-4 mb-2 
      focus:ring-2 focus:ring-blue-300 
        
      startGlassB`}
          >
            video 1 is lair
          </button>

          <button
            type="button"
            className={`text-white font-medium rounded-lg text-sm md:px-12 px-5 md:py-2 py-1 md:me-5 mb-2 
      focus:ring-2 focus:ring-blue-300 
    
      submitGlassB`}
          >
            video 2 is lair
          </button>
        </div>


        {/* <div classname="w-full  mb-10 mx-auto ">
          <a href="#" className="block max-w-sm p-6 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 bg-gray-500 ">
            <h5 className="mb-2 text-xl text-white"> To find out the result, just look for the "Eye of Veritas" team.   </h5>
          </a>
        </div> */}
      </div >



    </div >
  );
}

export default App;
