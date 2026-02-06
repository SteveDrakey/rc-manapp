import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SitesList from './pages/SitesList';
import SiteDetail from './pages/SiteDetail';
import AllTasks from './pages/AllTasks';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sites" element={<SitesList />} />
          <Route path="/sites/:siteId" element={<SiteDetail />} />
          <Route path="/tasks" element={<AllTasks />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
