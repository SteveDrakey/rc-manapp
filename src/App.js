import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import Dashboard from './pages/Dashboard';
import SitesList from './pages/SitesList';
import SiteDetail from './pages/SiteDetail';
import AllTasks from './pages/AllTasks';

function App() {
  const [loading, setLoading] = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <>
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
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
    </>
  );
}

export default App;
