import { Camera, Moon, Sun, Baby } from "lucide-react";
function App() {
  return (
    <>
     <h1 className="text-4xl text-red-500">Mon super projet React !!!</h1>
     <h2 className="text-4xl text-black-300">gh_page meilleur que vercel !!!</h2>
     <Camera color="red" size={48} />
     <label className="swap swap-rotate">
  {/* this hidden checkbox controls the state */}

      <Baby className="swap-on text-green-500" />

  <input className="theme-controller" type="checkbox" value="dark" />

    {/* Sun icon */}
    <Sun className="swap-on text-red-500" />
    
    {/* Moon icon */}
    <Moon className="swap-off text-red-500" />
    </label>
    </>
  );
}

export default App;