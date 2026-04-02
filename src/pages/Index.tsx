
import { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import DomainExpertsSection from "../components/DomainExpertsSection";
import NewsInsightsSection from "../components/NewsInsightsSection";
import FeedbackSection from "../components/FeedbackSection";
import Footer from "../components/Footer";
import Dashboard from "../components/Dashboard";

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  const handleGetStarted = () => {
    setShowDashboard(true);
    // Scroll to top when showing dashboard
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {showDashboard ? (
          <Dashboard />
        ) : (
          <>
            <Hero onGetStarted={handleGetStarted} />
            <DomainExpertsSection />
            <NewsInsightsSection />
            <FeedbackSection />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
