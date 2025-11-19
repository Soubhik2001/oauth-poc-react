import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('superadmin@app.com');
  const [password, setPassword] = useState('superadmin');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); 

    try {
      // 1. Auth Request
      const authRes = await axios.post('http://localhost:3000/oauth/authorize', {
        email,
        password,
        client_id: 'my-client-id',
        redirect_uri: 'http://localhost/callback'
      });

      // 2. Token Exchange
      const tokenRes = await axios.post('http://localhost:3000/oauth/token', {
        grant_type: 'authorization_code',
        code: authRes.data.code,
        client_id: 'my-client-id',
        client_secret: 'my-client-secret',
        redirect_uri: 'http://localhost/callback'
      });

      const { access_token, role } = tokenRes.data;

      // --- SECURITY CHECK REMOVED --- 
      // Any user can now login.
      
      localStorage.setItem('adminToken', access_token);
      localStorage.setItem('userRole', role); // Save role to control Dashboard view
      navigate('/dashboard');

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#f4f6f9' 
    }}>
      <form onSubmit={handleLogin} style={{ 
        padding: '40px', 
        backgroundColor: 'white',
        border: '1px solid #ddd', 
        borderRadius: '12px', 
        width: '100%', 
        maxWidth: '400px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>System Login</h2>
        
        {error && (
          <div style={{ 
            backgroundColor: '#ffebee', 
            color: '#c62828', 
            padding: '10px', 
            borderRadius: '4px', 
            marginBottom: '20px', 
            textAlign: 'center' 
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Email</label>
          <input 
            type="email" 
            placeholder="user@app.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px', boxSizing: 'border-box' }}
            required
          />
        </div>
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px', boxSizing: 'border-box' }}
            required
          />
        </div>
        <button type="submit" style={{ 
          width: '100%', 
          padding: '14px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '6px', 
          cursor: 'pointer', 
          fontSize: '16px', 
          fontWeight: 'bold',
          transition: 'background 0.3s'
        }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;