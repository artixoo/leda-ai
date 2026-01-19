
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AppReplicaPage from './pages/AppReplicaPage';

import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<AppReplicaPage />} />
      </Routes>
    </Router>
  );
}

export default App;
