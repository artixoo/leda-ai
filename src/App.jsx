
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AppReplicaPage from './pages/AppReplicaPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<AppReplicaPage />} />
      </Routes>
    </Router>
  );
}

export default App;
