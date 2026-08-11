import Brand from "../ui/Brand.jsx";
import SocialLink from "../ui/SocialLink.jsx";

function Footer() {
    return (
        <footer className="border-t border-slate-800 bg-black py-24 text-slate-500">
            <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[2fr_1fr_1fr_1fr]">

                {/* Brand */}
                <div className="flex flex-col items-start">
                    <Brand />

                    <p className="mt-4 text-sm text-slate-500">
                        Explore the future of development with Agentic AI.
                    </p>

                    <div className="mt-4 flex gap-2">
                        <SocialLink href="https://www.instagram.com/holbertonfrance/" label="Instagram" icon="bi-instagram" />
                        <SocialLink href="https://www.tiktok.com/@holbertonfrance" label="TikTok" icon="bi-tiktok" />
                        <SocialLink href="https://x.com/HolbertonFRA" label="X" icon="bi-twitter-x" />
                        <SocialLink href="https://www.youtube.com/@HolbertonFrance" label="YouTube" icon="bi-youtube" />
                    </div>
                </div>

                {/* Navigation */}
                <nav aria-label="Footer navigation">
                    <h3 className="mb-4 text-slate-50">
                        Navigation
                    </h3>

                    <ul className="flex flex-col gap-1">
                        <li>
                            <a className="text-sm text-slate-500 transition hover:text-slate-50" href="#hero-section">
                                Hero section
                            </a>
                        </li>

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

                {/* Holberton */}
                <nav aria-label="Holberton School">
                    <h3 className="mb-4 text-slate-50">
                        Holberton School
                    </h3>

                    <ul className="flex flex-col gap-1">
                        <li>
                            <a className="text-sm text-slate-500 transition hover:text-slate-50" href="https://www.holbertonschool.fr" target="_blank" rel="noopener noreferrer">
                                About
                            </a>
                        </li>

                        <li>
                            <a className="text-sm text-slate-500 transition hover:text-slate-50" href="https://www.holbertonschool.fr/methodologie" target="_blank" rel="noopener noreferrer">
                                Methodology
                            </a>
                        </li>

                        <li>
                            <a className="text-sm text-slate-500 transition hover:text-slate-50" href="https://www.holbertonschool.fr/a-propos" target="_blank" rel="noopener noreferrer">
                                Story
                            </a>
                        </li>

                        <li>
                            <a className="text-sm text-slate-500 transition hover:text-slate-50" href="https://www.holbertonschool.fr" target="_blank" rel="noopener noreferrer">
                                Agenda
                            </a>
                        </li>
                    </ul>
                </nav>

                {/* Curriculum */}
                <nav aria-label="Curriculum">
                    <h3 className="mb-4 text-slate-50">
                        Curriculum
                    </h3>

                    <ul className="flex flex-col gap-1">
                        <li>
                            <a className="text-sm text-slate-500 transition hover:text-slate-50" href="https://www.holbertonschool.fr/programme/bachelor-ai-augmented-software-engineering" target="_blank" rel="noopener noreferrer">
                                Bachelor
                            </a>
                        </li>

                        <li>
                            <a className="text-sm text-slate-500 transition hover:text-slate-50" href="https://www.holbertonschool.fr/programme/bachelor-ai-augmented-software-engineering#programme" target="_blank" rel="noopener noreferrer">
                                Program
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Bottom footer */}
            <div className="mx-auto mt-12 max-w-6xl px-6">
                <div className="border-t border-slate-800 pt-6">
                    <div className="flex flex-col gap-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
                        <p>© 2026 Fabien Chavonet</p>

                        <p>
                            Built for the Holberton School Front-end Frameworks curriculum.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;