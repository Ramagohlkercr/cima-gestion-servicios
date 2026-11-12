import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { NotificationToast } from './components/NotificationToast';
import { DashboardView } from './components/DashboardView';
import { ClientsView } from './components/ClientsView';
import { VisitsView } from './components/VisitsView';
import { SupervisionsView } from './components/SupervisionsView';
import { SupplyOrdersView } from './components/SupplyOrdersView';
import { RemitosView } from './components/RemitosView';
import { AdditionalJobsView } from './components/AdditionalJobsView';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      <Header />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'clients' && <ClientsView />}
          {activeTab === 'visits' && <VisitsView />}
          {activeTab === 'supervisions' && <SupervisionsView />}
          {activeTab === 'orders' && <SupplyOrdersView />}
          {activeTab === 'remitos' && <RemitosView />}
          {activeTab === 'jobs' && <AdditionalJobsView />}
        </main>
      </div>

      <MobileNav />
      <NotificationToast />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
