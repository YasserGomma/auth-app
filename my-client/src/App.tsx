import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInForm';
import Profile from './components/Profile';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={
          <div className="auth-container">
            <SignUpForm />
            <p className="auth-link">
              Already have an account? <a href="/signin">Sign in</a>
            </p>
          </div>
        } />
        <Route path="/signin" element={
          <div className="auth-container">
            <SignInForm />
            <p className="auth-link">
              Don't have an account? <a href="/signup">Sign up</a>
            </p>
          </div>
        } />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
}

export default App;