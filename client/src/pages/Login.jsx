import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const location = useLocation();
  const [successMsg, setSuccessMsg] = useState(location.state?.successMsg || '');
  const navigate = useNavigate();

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg('');
      }, 3000); // clear after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Login submitted:', formData);
    // authentication logic here
    // On successful login:
    // navigate('/dashboard');
    
    try {
      const res = await axios.post('/api/auth/login', formData);
      const token = res.data?.data?.token;

      if (token) {
        localStorage.setItem('pms_token', token);
        navigate('/dashboard');
      } else {
        setError('Login failed. Please try again.');
      }

    } catch (err) {
      
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-container">
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Sign in to access your Crypto PMS account</p>
            
          </div>
          <form onSubmit={handleSubmit} className="login-form">
            {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="form-control">
              <label>Email Address</label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control">
              <label>Password</label>
              <input 
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-primary">
              Sign In
            </button>
            
            <div className="login-footer">
              <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
              <p><Link to="/forgot-password">Forgot password?</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;