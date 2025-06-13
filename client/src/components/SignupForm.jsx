import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    password: '',
    bitgetApiKey: '',
    bitgetSecretKey: '',
    bitgetPassphrase: '',
    acceptTerms: false
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^[0-9]{10}$/;


  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Submit to backend
    if (!formData.email || !emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!formData.mobile || !mobileRegex.test(formData.mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!formData.bitgetApiKey || !formData.bitgetSecretKey || !formData.bitgetPassphrase) {
      setError('Please fill in all Bitget API fields');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Please accept the Terms and Conditions');
      return;
    }
    console.log('Form submitted:', formData);

    try {

      const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://crypto-pms.onrender.com': '';

      await axios.post(`${BASE_URL}/api/auth/register`, formData);
      console.log(formData);

      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login', { state: { successMsg: 'Account created successfully! Please log in.' }}) , 2000); // Redirect after 2s

    } catch (err) {

      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);

    }

  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      {/* Show messages */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

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
        <label>Mobile Number</label>
        <input 
          type="tel"
          name="mobile"
          value={formData.mobile}
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

      <div className="form-control">
        <label>Bitget API Key</label>
        <input 
          type="text"
          name="bitgetApiKey"
          value={formData.bitgetApiKey}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-control">
        <label>Bitget Secret Key</label>
        <input 
          type="password"
          name="bitgetSecretKey"
          value={formData.bitgetSecretKey}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-control">
        <label>Bitget Passphrase</label>
        <input 
          type="password"
          name="bitgetPassphrase"
          value={formData.bitgetPassphrase}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-footer">
        <label className="terms-checkbox">
          <input 
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            required
          />
          I agree to the Terms of Service and Privacy Policy
        </label>
        <button type="submit" className="btn-primary">
          Create Account
        </button>
      </div>
    </form>
  );
};

export default SignupForm;