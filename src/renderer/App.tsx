import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import { GlobalProvider } from './Context/GlobalContext';

export default function App() {
  return (
    <GlobalProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router>
    </GlobalProvider>
  );
}
