import SignupForm from '../components/SignupForm';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="signup-page">
      <div className="container">
        <div className="signup-container">
          <div className="signup-header">
            <h1>Create Your Account</h1>
            <p>Join our Crypto Portfolio Management System and start automated trading</p>
          </div>
          <div className="signup-content">
            <SignupForm />
            <div className="login-link">
              Already have an account? <Link to="/login">Log in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;