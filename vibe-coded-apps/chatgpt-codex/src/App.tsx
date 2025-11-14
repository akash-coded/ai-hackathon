import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BusinessDashboard from './components/BusinessDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BusinessDashboard />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
