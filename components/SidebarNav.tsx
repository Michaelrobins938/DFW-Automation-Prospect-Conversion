import React from 'react';
import Button from './Button';

interface SidebarNavProps {
  activeSection: string;
  onSelectSection: (section: string) => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ activeSection, onSelectSection }) => {
  const sections = [
    { id: 'dashboard', name: 'ROI Dashboard' },
    { id: 'outreach', name: 'Outreach Copy Blocks' },
    { id: 'intake', name: 'Smart Discovery Intake Form' },
    { id: 'proposal', name: 'Pilot Proposal Mini-Deck' },
    { id: 'assets', name: 'Asset Links Archive' },
    { id: 'exceptions', name: 'Exception Mockup' },
  ];

  return (
    <aside className="w-full sm:w-64 bg-gray-900 text-white p-4 h-auto sm:h-screen sticky top-0 sm:block flex-shrink-0 z-20 overflow-x-auto">
      <nav className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant={activeSection === section.id ? 'primary' : 'ghost'}
            className={`w-full justify-start text-left ${
              activeSection === section.id
                ? 'bg-blue-700 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
            onClick={() => onSelectSection(section.id)}
          >
            {section.name}
          </Button>
        ))}
      </nav>
    </aside>
  );
};

export default SidebarNav;
