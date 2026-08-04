import { BrainCircuit } from "lucide-react";

function Header() {
  return (
    <header className="fixed top-0 z-50 w-full bg-slate-950 p-4 text-white">
        
        {/* mx auto centrage horizontal / flex enfant sur meme ligne 
        / items-center centre les enfants / justify-betwenn place le premier a gauche et dernier a droite donc ici enroll now en dernier */}
        <div className="container mx-auto mx-auto flex items-center justify-between"> 
            <a
            href="#home-section"
            className="flex items-center gap-2"
            >
                <div className="rounded-lg bg-violet-500 p-2">
                <BrainCircuit size={32} />
                </div>
                <span className="text-slate-50 font-bold"> 
                    Agentic AI
                </span> 
            </a>
            <div className="ml-auto flex items-center gap-4"> {/* ml-auto pousse vers la droit margin left marge a gauche  */}
            <nav aria-label="Main navigation" className="hidden md:block">
                <ul className="flex gap-4">
                    <li>
                        <a
                            className="font-bold text-slate-500 hover:text-white"
                            href="#about-section"
                        >
                            About
                        </a>
                    </li>

                    <li>
                        <a
                            className="font-bold text-slate-500 hover:text-white"
                            href="#features-section"
                        >
                            Features
                        </a>
                    </li>

                    <li>
                        <a
                            className="font-bold text-slate-500 hover:text-white"
                            href="#insights-section"
                        >
                            Insights
                        </a>
                    </li>

                    <li>
                        <a
                            className="font-bold text-slate-500 hover:text-white"
                            href="#contact-section"
                        >
                            Contact
                        </a>
                    </li>
                </ul>
            </nav>
                <button
                    type="button"
                    className="px-4 py-2 font-semibold rounded-md bg-violet-500 hover:bg-violet-600 shadow-lg shadow-violet-500/40"
                >
                    Enroll now
                </button>
            </div>
        </div>
    </header>
  );
}

export default Header;