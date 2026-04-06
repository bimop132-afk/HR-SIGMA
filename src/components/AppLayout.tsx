"use client";
import { useState, useEffect } from "react";
import TopAppBar from "./TopAppBar";
import BottomNavigation from "./BottomNavigation";
import Sidebar from "./Sidebar";
import TransactionalAppBar from "./TransactionalAppBar";

interface AppLayoutProps {
  children: React.ReactNode;
  isTransactional?: boolean;
  showBottomNav?: boolean;
}

export default function AppLayout({ children, isTransactional = false, showBottomNav = true }: AppLayoutProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Hide sidebar strictly on mobile load
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Fallback before hydration to avoid flash of weird UI
  if (!isClient) return null;

  return (
    <>
      {isTransactional ? (
        <TransactionalAppBar onToggle={toggleSidebar} />
      ) : (
        <TopAppBar onToggle={toggleSidebar} />
      )}
      
      <div className="flex min-h-screen pt-16">
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
        
        {/* Dynamic expansion logic. lg:ml-72 only applies if isOpen is true */}
        <main className={`flex-1 transition-all duration-300 ease-in-out ${isOpen ? "lg:ml-72" : "lg:ml-0"} w-full overflow-x-hidden`} style={{ minHeight: "calc(100vh - 64px)" }}>
          {children}
        </main>
      </div>
      
      {showBottomNav && <BottomNavigation />}
    </>
  );
}
