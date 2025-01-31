import Navbar from "../components/Navbar";
import Homeinfo from "../components/HomeInfo";
// import login from "../services/authService" 

export default function Home() {
  return (
    <div className="" style={{ backgroundColor: "#012f33" }}>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <div className="h-max w-screen flex flex-col justify-center text-center pt-20">
        <div className="min-h-screen w-full bg-[#012f33] px-8 py-12 flex items-center">
            <Homeinfo />
        </div>
      </div>
      {/* <div className="min-h-screen flex justify-center items-center">
        
        <p className="text-5xl text-white">Home</p>
      </div> */}
    </div>
  );
}
