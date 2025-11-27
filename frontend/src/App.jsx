import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import FlightDetails from './pages/FlightDetails';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/flight/:id" element={<FlightDetails />} />
      </Routes>
    </Layout>
  );
}

export default App;
