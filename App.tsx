import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import SidebarNav from './components/SidebarNav';
import ROICalculator from './components/ROICalculator';
import OutreachTemplates from './components/OutreachTemplates';
import IntakeForm from './components/IntakeForm';
import ProposalGenerator from './components/ProposalGenerator';
import AssetArchive from './components/AssetArchive';
import ExceptionMockup from './components/ExceptionMockup';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('dashboard');

  const renderSection = useCallback(() => {
    switch (activeSection) {
      case 'dashboard':
        return <ROICalculator />;
      case 'outreach':
        return <OutreachTemplates />;
      case 'intake':
        return <IntakeForm />;
      case 'proposal':
        return <ProposalGenerator />;
      case 'assets':
        return <AssetArchive />;
      case 'exceptions':
        return <ExceptionMockup />;
      default:
        return <ROICalculator />;
    }
  }, [activeSection]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="DFW Automation Prospect Conversion" />
      <div className="flex flex-1 flex-col sm:flex-row">
        <SidebarNav activeSection={activeSection} onSelectSection={setActiveSection} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default App;
