import { DribbbleIcon, GithubIcon, LinkedinIcon, TwitterIcon } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedFooter } from "./ui/animated-footer";

export default function Footer() {
    const links = [
        { name: 'Terms of Service', href: '#terms-of-service' },
        { name: 'Privacy Policy', href: '#privacy-policy' },
        { name: 'Security', href: '#security' },
        { name: 'Sitemap', href: '#sitemap' },
    ];
    return (
        <motion.footer
            className="relative mt-40 min-h-[620px] w-full overflow-hidden glass border-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <AnimatedFooter
                className="absolute inset-0 z-0"
                headingLines={["E-Boss"]}
                leftImage="/animated-footer/hand-left.jpg"
                rightImage="/animated-footer/hand-right.jpg"
                background="transparent"
            />

            <div className="relative z-10 flex min-h-[620px] flex-col items-center px-4 pt-12 md:px-16 lg:px-24">
                <div className="flex flex-wrap items-center justify-center gap-8 py-8">
                    {links.map((link, index) => (
                        <a
                            key={index}
                            href={link.href}
                            className="transition hover:text-gray-300 dark:text-white"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-6 pb-6">
                    <a href="#" className="text-gray-700 transition-all duration-300 hover:-translate-y-0.5 dark:text-gray-200">
                        <DribbbleIcon />
                    </a>
                    <a href="#" className="text-gray-700 transition-all duration-300 hover:-translate-y-0.5 dark:text-gray-200">
                        <LinkedinIcon />
                    </a>
                    <a href="#" className="text-gray-700 transition-all duration-300 hover:-translate-y-0.5 dark:text-gray-200">
                        <TwitterIcon />
                    </a>
                    <a href="#" className="text-gray-700 transition-all duration-300 hover:-translate-y-0.5 dark:text-gray-200">
                        <GithubIcon />
                    </a>
                </div>

                <div className="mt-auto w-full pb-10">
                    <hr className="w-full border-black/20 dark:border-white/20" />
                    <div className="flex flex-col items-center justify-between gap-4 pt-4 text-sm text-gray-700 md:flex-row dark:text-gray-200">
                        <p>Build Ai agents for free</p>
                        <p>Copyright © 2025 E-Boss. All rights reservered.</p>
                    </div>
                </div>
            </div>
        </motion.footer>
    );
};