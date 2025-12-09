import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TrendSpotter from './components/TrendSpotter';
import ContentFactory from './components/ContentFactory';
import Campaigns from './components/Campaigns';
import { MOCK_CLIENTS } from './constants';
import { ClientProfile } from './types';

const App: React.FC = () => {
  const [clients, setClients] = useState<ClientProfile[]>(MOCK_CLIENTS);
  const [activeClient, setActiveClient] = useState<ClientProfile>(MOCK_CLIENTS[0]);

  const handleAddClient = (newClient: ClientProfile) => {
    setClients([...clients, newClient]);
    setActiveClient(newClient);
  };

  const handleEditClient = (updatedClient: ClientProfile) => {
    setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
    if (activeClient.id === updatedClient.id) {
      setActiveClient(updatedClient);
    }
  };

  return (
    <HashRouter>
      <Layout
        activeClient={activeClient}
        onClientChange={setActiveClient}
        clients={clients}
        onAddClient={handleAddClient}
        onEditClient={handleEditClient}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/trends" element={<TrendSpotter activeClient={activeClient} />} />
          <Route path="/create" element={<ContentFactory activeClient={activeClient} />} />
          <Route path="/campaigns" element={<Campaigns activeClient={activeClient} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
