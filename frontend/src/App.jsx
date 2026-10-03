import LenisScroll from "./components/lenis-scroll";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import FloatingChatbot from "./components/chatbot/FloatingChatbot";
import HeroSection from "./sections/hero-section";
import FaqSection from "./sections/faq-section";
import TrustedCompanies from "./sections/trusted-companies";
import Features from "./sections/features";
import WorkflowSteps from "./sections/workflow-steps";
import Testimonials from "./sections/testimonials";
import PricingPlans from "./sections/pricing-plans";
import CallToAction from "./sections/call-to-action";
import { useTheme } from "./context/theme-context";
import { useChristmas } from "./context/christmas-context";
import ChristmasWrapper from "./components/ChristmasWrapper";

export default function App() {
    const { theme } = useTheme();
    const { isChristmasMode } = useChristmas();
    
    return (
        <ChristmasWrapper>
            <LenisScroll />
            <Navbar />
            
            {/* Background Blobs */}
            <div className="fixed inset-0 overflow-hidden -z-20 pointer-events-none">
                <div className={`absolute rounded-full top-80 left-2/5 -translate-x-1/2 size-130 blur-[100px] opacity-50 ${
                    theme === 'dark' ? 'bg-[#4C1D95]' : 'bg-[#E91E63]'
                }`} />
                <div className={`absolute rounded-full top-80 right-0 -translate-x-1/2 size-130 blur-[100px] opacity-50 ${
                    theme === 'dark' ? 'bg-[#1E3A8A]' : 'bg-[#2E08CF]'
                }`} />
                <div className={`absolute rounded-full top-0 left-1/2 -translate-x-1/2 size-130 blur-[100px] opacity-50 ${
                    theme === 'dark' ? 'bg-[#7C3AED]' : 'bg-[#F26A06]'
                }`} />
            </div>

            <main className='px-4'>
                {/* ID pour le lien "Home" */}
                <div id="home"><HeroSection /></div>
                
                <TrustedCompanies />
                
                {/* ID pour le lien "Use Cases" */}
                <section id="use-cases"><Features /></section>
                
                {/* ID pour le lien "Agents" */}
                <section id="agents"><WorkflowSteps /></section>
                
                <Testimonials />
                <FaqSection />
                
                {/* ID pour le lien "Pricing" */}
                <section id="pricing"><PricingPlans /></section>
                
                <CallToAction />
            </main>
            
            <Footer />
            <FloatingChatbot />
        </ChristmasWrapper>
    );
}