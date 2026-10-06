import { DribbbleIcon, GithubIcon, LinkedinIcon, TwitterIcon } from "lucide-react";
import { AnimatedFooter } from "./ui/animated-footer";

export default function Footer() {
    const links = [
        { name: 'Terms of Service', href: '#terms-of-service' },
        { name: 'Privacy Policy', href: '#privacy-policy' },
        { name: 'Security', href: '#security' },
        { name: 'Sitemap', href: '#sitemap' },
    ];

    return (
        <AnimatedFooter
            className="mt-40 min-h-[620px] w-full"
            headingLines={["E-Boss"]}
            leftImage="/animated-footer/hand-left.jpg"
            rightImage="/animated-footer/hand-right.jpg"
            background="transparent"
        >
            <div className="pointer-events-none flex min-h-[620px] flex-col items-center px-4 pt-12 md:px-16 lg:px-24">
                <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-8 py-8">
                    {links.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-sm transition hover:text-purple-500 dark:text-white"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                <div className="pointer-events-auto flex items-center gap-6 pb-6">
                    <a href="#" aria-label="Dribbble" className="text-gray-700 transition hover:-translate-y-0.5 dark:text-gray-200">
                        <DribbbleIcon />
                    </a>
                    <a href="#" aria-label="LinkedIn" className="text-gray-700 transition hover:-translate-y-0.5 dark:text-gray-200">
                        <LinkedinIcon />
                    </a>
                    <a href="#" aria-label="Twitter" className="text-gray-700 transition hover:-translate-y-0.5 dark:text-gray-200">
                        <TwitterIcon />
                    </a>
                    <a href="#" aria-label="GitHub" className="text-gray-700 transition hover:-translate-y-0.5 dark:text-gray-200">
                        <GithubIcon />
                    </a>
                </div>

                <div className="mt-auto w-full pb-10">
                    <hr className="border-black/20 dark:border-white/20" />
                    <div className="flex flex-col items-center justify-between gap-4 pt-4 text-sm text-gray-700 md:flex-row dark:text-gray-200">
                        <p>Build Ai agents for free</p>
                        <p>Copyright © 2025 E-Boss. All rights reservered.</p>
                    </div>
                </div>
            </div>
        </AnimatedFooter>
    );
}
