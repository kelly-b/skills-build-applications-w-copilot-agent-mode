import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import smallLogo from './assets/octofitapp-small.svg';
import Activities from './components/Activities';
import Workouts from './components/Workouts';
import Users from './components/Users';
import Teams from './components/Teams';
import Leaderboard from './components/Leaderboard';

function Home() {
  return (
    <div className="container mt-4">
      <h1>OctoFit Tracker</h1>
      <p className="lead">Dashboard frontend — data is loaded from the Django REST API.</p>
    </div>
  );
}

function App() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <NavLink className="navbar-brand d-flex align-items-center" to="/">
            <img src={smallLogo} alt="OctoFit" className="brand-logo me-2" />
            <span className="brand-text">OctoFit</span>
          </NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample" aria-controls="navbarsExample" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarsExample">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><NavLink className="nav-link" to="/activities">Activities</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/workouts">Workouts</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/users">Users</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/teams">Teams</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/leaderboard">Leaderboard</NavLink></li>
            </ul>
          </div>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
