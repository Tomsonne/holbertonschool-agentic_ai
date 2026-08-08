import Brand from "../ui/Brand";

function Footer() {
    return (
        <footer className="border-t border-slate-800 bg-slate-950 py-8 text-slate-500">


            <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 md:flex-row">

            <div className="ml-auto flex items-start items-center gap-16"> {/* ml-auto pousse vers la droit margin left marge a gauche  */}
                <ul className="flex flex-col gap-1">
                    <li>
                        <Brand />
                    </li>
                        <p className="text-slate-500 text-sm">
                            Explore the future of development with Agentic AI.
                        </p>
                    <li>
                        <a href="https://www.instagram.com/holbertonfrance/" target="_blank" rel="noopener noreferrer">
                            <i className="bi bi-instagram text-2xl"></i>
                        </a>

                        <a href="https://www.tiktok.com/@holbertonfrance" target="_blank" rel="noopener noreferrer">
                            <i className="bi bi-tiktok text-2xl"></i>
                        </a>

                        <a href="https://x.com/HolbertonFRA" target="_blank" rel="noopener noreferrer">
                            <i className="bi bi-twitter-x text-2xl"></i>
                        </a>
                        <a href="https://www.youtube.com/@HolbertonFrance" target="_blank" rel="noopener noreferrer">
                            <i className="bi bi-youtube text-2xl"></i>
                        </a>

                    </li>
                </ul>
            </div>
                
                
                <div className="ml-auto flex items-start items-center gap-16"> {/* ml-auto pousse vers la droit margin left marge a gauche  */}
                    <nav aria-label="Main navigation" className="hidden md:block">
                        <h3 className="mb-4 text-slate-50">
                            Navigation
                        </h3>

                        <ul className="flex flex-col gap-1">
                            <li>
                                <a className="text-slate-500 hover:text-slate-50 text-sm" href="#hero-section">
                                    Hero section
                                </a>
                            </li>

                            <li>
                                <a className="text-slate-500 hover:text-slate-50 text-sm" href="#about-section">
                                    About
                                </a>
                            </li>

                            <li>
                                <a className="text-slate-500 hover:text-slate-50 text-sm" href="#features-section">
                                    Features
                                </a>
                            </li>

                            <li>
                                <a className="text-slate-500 hover:text-white text-sm" href="#insights-section">
                                    Insights
                                </a>
                            </li>

                            <li>
                                <a className="text-slate-500 hover:text-white text-sm" href="#contact-section">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </nav>



                    <nav aria-label="Main navigation" className="hidden md:block">
                        <h3 className="mb-4 text-slate-50">
                            Holberton School
                        </h3>

                        <ul className="flex flex-col gap-1">

                            <li>
                                <a className="text-slate-500 hover:text-slate-50 text-sm" href="https://www.holbertonschool.fr" target="_blank">
                                    About
                                </a>
                            </li>

                            <li>
                                <a className="text-slate-500 hover:text-slate-50 text-sm" href="https://www.holbertonschool.fr/methodologie" target="_blank">
                                    Methodology
                                </a>
                            </li>

                            <li>
                                <a className="text-slate-500 hover:text-slate-50 text-sm" href="https://www.holbertonschool.fr/a-propos" target="_blank">
                                    Story
                                </a>
                            </li>

                            <li>
                                <a className="text-slate-500 hover:text-white text-sm" href="https://www.holbertonschool.fr" target="_blank">
                                    Agenda
                                </a>
                            </li>
                        </ul>
                    </nav>



                    <nav aria-label="Main navigation" className="hidden md:block">
                        <h3 className="mb-4 text-slate-50">
                            Curriculum
                        </h3>
                        <ul className="flex flex-col gap-1">
                            <li>
                                <a className="text-slate-500 hover:text-slate-50 text-sm" href="https://www.holbertonschool.fr/programme/bachelor-ai-augmented-software-engineering" target="_blank">
                                    Bachelor
                                </a>
                            </li>

                            <li>
                                <a className="text-slate-500 hover:text-slate-50 text-sm" href="https://www.holbertonschool.fr/programme/bachelor-ai-augmented-software-engineering#programme" target="_blank">
                                    Program
                                </a>
                            </li>

                        </ul>
                    </nav>



                </div>
            </div>
        </footer>
    );
}

export default Footer;