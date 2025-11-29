
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Inventory1stGrade } from './components/Inventory1stGrade';
import { Inventory2ndGrade } from './components/Inventory2ndGrade';
import { Inventory3rdGrade } from './components/Inventory3rdGrade';
import { Inventory4thGrade } from './components/Inventory4thGrade';
import { Inventory5thGrade } from './components/Inventory5thGrade';
import { SalarySheet } from './components/SalarySheet'; // Grade 6
import { Inventory7thGrade } from './components/Inventory7thGrade';
import { Inventory8thGrade } from './components/Inventory8thGrade';
import { Inventory9thGrade } from './components/Inventory9thGrade';
import { Inventory10thGrade } from './components/Inventory10thGrade';
import { Inventory11thGrade } from './components/Inventory11thGrade';
import { InventoryComputerLab } from './components/InventoryComputerLab';
import { InventoryGenerator } from './components/InventoryGenerator';
import { InventoryGenerator7thGrade } from './components/InventoryGenerator7thGrade';
import { InventoryGenerator8thGrade } from './components/InventoryGenerator8thGrade';
import { InventoryGenerator9thGrade } from './components/InventoryGenerator9thGrade';
import { InventoryGenerator10thGrade } from './components/InventoryGenerator10thGrade';
import { InventoryGenerator11thGrade } from './components/InventoryGenerator11thGrade';
import { InventoryGeneratorComputerLab } from './components/InventoryGeneratorComputerLab';


type Tab =
  | 'grade1' | 'grade2' | 'grade3' | 'grade4' | 'grade5'
  | 'grade6' | 'grade7' | 'grade8' | 'grade9' | 'grade10' | 'grade11'
  | 'computerLab' | 'reports';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('grade1');

  const renderContent = () => {
    switch (activeTab) {
      case 'grade1': return <Inventory1stGrade />;
      case 'grade2': return <Inventory2ndGrade />;
      case 'grade3': return <Inventory3rdGrade />;
      case 'grade4': return <Inventory4thGrade />;
      case 'grade5': return <Inventory5thGrade />;
      case 'grade6': return <SalarySheet />;
      case 'grade7': return <Inventory7thGrade />;
      case 'grade8': return <Inventory8thGrade />;
      case 'grade9': return <Inventory9thGrade />;
      case 'grade10': return <Inventory10thGrade />;
      case 'grade11': return <Inventory11thGrade />;
      case 'computerLab': return <InventoryComputerLab />;
      case 'reports':
        return (
          <div className="space-y-8">
            <InventoryGenerator />
            <InventoryGenerator7thGrade />
            <InventoryGenerator8thGrade />
            <InventoryGenerator9thGrade />
            <InventoryGenerator10thGrade />
            <InventoryGenerator11thGrade />
            <InventoryGeneratorComputerLab />
          </div>
        );
      default: return <Inventory1stGrade />;
    }
  };

  const TabButton: React.FC<{ tabName: Tab; label: string; }> = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 whitespace-nowrap ${
        activeTab === tabName
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-slate-600 hover:bg-slate-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <Header />
      
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-8">
            <div className="flex items-center space-x-1 overflow-x-auto py-2">
                <TabButton tabName="grade1" label="Grade 1" />
                <TabButton tabName="grade2" label="Grade 2" />
                <TabButton tabName="grade3" label="Grade 3" />
                <TabButton tabName="grade4" label="Grade 4" />
                <TabButton tabName="grade5" label="Grade 5" />
                <TabButton tabName="grade6" label="Grade 6" />
                <TabButton tabName="grade7" label="Grade 7" />
                <TabButton tabName="grade8" label="Grade 8" />
                <TabButton tabName="grade9" label="Grade 9" />
                <TabButton tabName="grade10" label="Grade 10" />
                <TabButton tabName="grade11" label="Grade 11" />
                <TabButton tabName="computerLab" label="Computer Lab" />
                <TabButton tabName="reports" label="Summary Reports" />
            </div>
        </div>
      </nav>

      <main className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>

      <footer className="text-center p-4 text-slate-500 text-sm">
        <p>Classroom Inventory Management System</p>
        <p>Created by Sevidu Dahamsath Marasinghe</p>
      </footer>
    </div>
  );
};

export default App;
