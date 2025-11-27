import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('superadmin@app.com');
  const [password, setPassword] = useState('superadmin');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      localStorage.setItem('adminToken', access_token);
      localStorage.setItem('userRole', role); 
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
          
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px', 
                paddingRight: '45px', 
                border: '1px solid #ccc', 
                borderRadius: '6px', 
                boxSizing: 'border-box' 
              }}
              required
            />
            
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#888',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0
              }}
            >
              {showPassword ? (
                // Eye Off Icon (SVG)
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                // Eye Icon (SVG)
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
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