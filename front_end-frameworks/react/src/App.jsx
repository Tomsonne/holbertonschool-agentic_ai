import { Camera, Moon, Sun, Baby } from "lucide-react"; // importe icone via lucide react
import Header from "./components/Header.jsx"; // importe mon header 
import Hero from "./sections/Hero.jsx"; // importe ma section hero
import About from "./sections/About.jsx";
import Features from "./sections/Features.jsx";
import Insights from "./sections/Insights.jsx";
import Contact from "./sections/Contact.jsx";

function App() {
  return (
  <>
    <Header />
    <main>

      <Hero />

      <About />

      <Features />

      <Insights />

      <Contact />
      
      <label className="swap swap-rotate"> {/* ajoute label pour dark mode */}

        < input className="theme-controller" type="checkbox" value="dark" />

        {/* Sun icon */}
        <Sun className="swap-on text-red-500" />

        {/* Moon icon */}
        <Moon className="swap-off text-red-500" />
      </label>
    </main>
  </>
  );
}

export default App;