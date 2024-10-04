import React from 'react';
import { Button } from '@/components/ui/button';

export const Header = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Creatives for Ukraine UK</h1>
        <nav>
          <ul className="flex space-x-4">
            {['home', 'upcoming', 'about', 'donate'].map((section) => (
              <li key={section}>
                <Button
                  variant="ghost"
                  onClick={() => scrollToSection(section)}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};