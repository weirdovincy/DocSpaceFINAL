import { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function Layout({ children, showNav = true }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showNav && <Navbar />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
