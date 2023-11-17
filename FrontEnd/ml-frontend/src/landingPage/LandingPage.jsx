import './LandingPage.css';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate(); // Hook for navigation

  const navigateTo= () => {
    navigate('/cvd-table');
  }

  const navigateToTable = () => {
    navigate('/patients');
  }

  return (
    <header className="app-header">
      <div className="logo">Hospital</div>
      <nav>
        <button className="header-btn" onClick={navigateTo}>Add Patient</button>
        <button className="header-btn" onClick={navigateToTable}>View Patients List</button>
      </nav>
    </header>
  );
}

export default Header;