import { Camera, Moon, Sun, Baby } from "lucide-react"; // importe icone via lucide react
import Header from "./components/Header.jsx"; // importe mon header 
import Hero from "./sections/Hero.jsx"; // importe ma section hero

function App() {
  return (
  <>
    <Header />
    <Hero />

    <label className="swap swap-rotate"> {/* ajoute label pour dark mode */}

  < input className="theme-controller" type="checkbox" value="dark" />

    {/* Sun icon */}
    <Sun className="swap-on text-red-500" />

    {/* Moon icon */}
    <Moon className="swap-off text-red-500" />
    </label>

  </>
  );
}

export default App;