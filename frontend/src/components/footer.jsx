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
            <div />
        </AnimatedFooter>
    );
}
