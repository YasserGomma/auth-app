import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css'; 
type User = {
  email: string;
  userId: string;
  name: string;
};

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        localStorage.removeItem('token');
        navigate('/signin');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!user) return <p>No user data available</p>;

  return (
    <div className="profile-container">
      <img
        src="https://mhrglobal.com/sites/default/files/styles/meta_open_graph/public/2023-09/Easy%20generate%20blog%20header%20two.png?itok=whgOYdXi"
        alt="Profile banner"
        className="profile-banner"
      />
      <div className="profile-card">
        <h1>Welcome, {user.name}!</h1>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user.userId}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
