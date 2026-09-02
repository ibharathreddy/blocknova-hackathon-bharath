import React, { useState, useEffect } from 'react';
import { RegistrationProvider, useRegistration } from './context/RegistrationContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { AboutSection } from './components/home/AboutSection';
import { ProblemStatements } from './components/home/ProblemStatements';
import { ScheduleTimeline } from './components/home/ScheduleTimeline';
import { PrizesSection } from './components/home/PrizesSection';
import { FAQSection } from './components/home/FAQSection';
import { SponsorsSection } from './components/home/SponsorsSection';
import { RegistrationWizard } from './components/registration/RegistrationWizard';
import { LoginPage } from './components/auth/LoginPage';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AppView } from './types';

function MainApp() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const { isAdminAuthenticated, isPSReleased, setSelectedPSForRegistration } = useRegistration();

  // Sync route hashes (e.g. #register, #login, #admin, #about, #schedule, #faq)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'register') {
        setCurrentView('register');
      } else if (hash === 'login') {
        setCurrentView('login');
      } else if (hash === 'about') {
        setCurrentView('about');
      } else if (hash === 'schedule') {
        setCurrentView('schedule');
      } else if (hash === 'faq') {
        setCurrentView('faq');
      } else if (hash === 'problem-statements') {
        setCurrentView('home');
        setTimeout(() => {
          const el = document.getElementById('problem-statements');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (hash === 'admin') {
        setCurrentView(isAdminAuthenticated ? 'admin' : 'admin-login');
      } else if (hash === 'hero' || hash === 'home') {
        setCurrentView('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash) {
        setCurrentView('home');
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        setCurrentView('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [isAdminAuthenticated]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070814] text-slate-100 selection:bg-purple-600 selection:text-white relative">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onNavigateSection={scrollToSection}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <div>
            <HeroSection
              onRegisterClick={() => {
                setCurrentView('register');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExplorePSClick={() => {
                scrollToSection('problem-statements');
              }}
            />
            <ProblemStatements
              onRegisterClick={() => {
                setCurrentView('register');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onScheduleClick={() => {
                setCurrentView('schedule');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectPSForRegistration={(psId) => {
                setSelectedPSForRegistration(psId);
                setCurrentView('register');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <PrizesSection />
            <SponsorsSection />
          </div>
        )}

        {currentView === 'about' && (
          <div className="pt-24 pb-16">
            <AboutSection />
          </div>
        )}

        {currentView === 'schedule' && (
          <div className="pt-24 pb-16">
            <ScheduleTimeline />
          </div>
        )}

        {currentView === 'faq' && (
          <div className="pt-24 pb-16">
            <FAQSection />
          </div>
        )}

        {currentView === 'register' && (
          <div className="pt-24 pb-16">
            <RegistrationWizard
              onBackToHome={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {currentView === 'login' && (
          <div className="pt-24 pb-16">
            <LoginPage
              onBackToHome={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToRegister={() => {
                setCurrentView('register');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToAdmin={() => {
                setCurrentView('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {currentView === 'admin-login' && (
          <div className="pt-28 pb-16">
            <AdminLogin
              onLoginSuccess={() => {
                setCurrentView('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBackToHome={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {currentView === 'admin' && (
          <div className="pt-24 pb-16">
            <AdminDashboard
              onBackToHome={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </main>

      {/* Global Footer */}
      {currentView !== 'admin' && (
        <Footer
          onNavigateSection={scrollToSection}
          setCurrentView={setCurrentView}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <RegistrationProvider>
      <MainApp />
    </RegistrationProvider>
  );
}
