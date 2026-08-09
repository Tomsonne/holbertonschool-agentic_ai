import Brand from "../ui/Brand";
import Button from "../ui/Button.jsx";

function Header() {
  return (

    <header className="fixed top-0 z-50 w-full bg-slate-950 text-slate-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
    
            <Brand />
            <div className="ml-auto flex items-center gap-4"> {/* ml-auto pousse vers la droit margin left marge a gauche  */}
            <nav aria-label="Main navigation" className="hidden md:block">
                <ul className="flex gap-4">
                    <li>
                        <a className=" text-slate-500 hover:text-slate-50 text-sm" href="#about-section">
                            About
                        </a>
                    </li>

                    <li>
                        <a className=" text-slate-500 hover:text-slate-50 text-sm" href="#features-section">
                            Features
                        </a>
                    </li>

                    <li>
                        <a className=" text-slate-500 hover:text-white text-sm" href="#insights-section">
                            Insights
                        </a>
                    </li>

                    <li>
                        <a className=" text-slate-500 hover:text-white text-sm" href="#contact-section">
                            Contact
                        </a>
                    </li>
                </ul>
            </nav>
                <Button className="text-sm" href="https://www.holbertonschool.fr/rejoindre-lhippocamp" target="_blank">
                    Enroll now
                </Button>
            </div>
        </div>
    </header>
  );
}

export default Header;