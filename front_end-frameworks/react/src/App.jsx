import { Camera, Moon, Sun, Baby } from "lucide-react"; // importe icone via lucide react
import Header from "./components/layout/Header.jsx"; // importe mon header 
import Hero from "./components/sections/Hero.jsx"; // importe ma section hero
import About from "./components/sections/About.jsx";
import Features from "./components/sections/Features.jsx";
import Insights from "./components/sections/Insights.jsx";
import Contact from "./components/sections/Contact.jsx";
import Footer from "./components/layout/Footer.jsx";

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

      <Footer />
      
    </main>
  </>
  );
}

export default App;