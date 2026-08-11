import Brand from "../ui/Brand.jsx";
import Button from "../ui/Button.jsx";

function Header() {
    return (
        <header className="fixed top-0 z-50 w-full border-b border-slate-900 bg-slate-950/80 text-slate-50 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
                <Brand />

                <div className="ml-auto flex items-center gap-4">
                    <nav aria-label="Main navigation" className="hidden md:block">
                        <ul className="flex gap-4">
                            <li>
                                <a className="text-sm text-slate-500 transition hover:text-slate-50" href="#about-section">
                                    About
                                </a>
                            </li>

                            <li>
                                <a className="text-sm text-slate-500 transition hover:text-slate-50" href="#features-section">
                                    Features
                                </a>
                            </li>

                            <li>
                                <a className="text-sm text-slate-500 transition hover:text-slate-50" href="#insights-section">
                                    Insights
                                </a>
                            </li>

                            <li>
                                <a className="text-sm text-slate-500 transition hover:text-slate-50" href="#contact-section">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <Button className="text-sm" href="https://www.holbertonschool.fr/rejoindre-lhippocamp" target="_blank" rel="noopener noreferrer">
                        Enroll now
                    </Button>
                </div>
            </div>
        </header>
    );
}

export default Header;