import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendOtp, verifyOtp } from '../services/authService';
import toast from 'react-hot-toast';

const pageStyle = {
  minHeight: 'calc(100vh - 64px - 80px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 'var(--space-xl)',
};

const cardStyle = {
  width: '100%',
  maxWidth: '440px',
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-xl)',
  boxShadow: 'var(--shadow-xl)',
  padding: 'var(--space-2xl)',
  animation: 'slideUp 0.4s ease forwards',
};

const titleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '2rem',
  fontWeight: 700,
  color: 'var(--color-primary)',
  marginBottom: 'var(--space-xs)',
  textAlign: 'center',
};

const subtitleStyle = {
  fontSize: '0.9375rem',
  color: 'var(--color-text-light)',
  textAlign: 'center',
  marginBottom: 'var(--space-xl)',
};

const footerStyle = {
  textAlign: 'center',
  marginTop: 'var(--space-lg)',
  fontSize: '0.875rem',
  color: 'var(--color-text-light)',
};

const otpRowStyle = {
  display: 'flex',
  gap: '8px',
  alignItems: 'flex-start',
};

const otpInputStyle = {
  letterSpacing: '6px',
  textAlign: 'center',
  fontSize: '1.1rem',
  fontFamily: 'monospace',
};

const verifiedBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#27ae60',
  marginTop: '4px',
};

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));

    // Reset OTP state if email changes
    if (name === 'email') {
      setOtpSent(false);
      setOtpCode('');
      setOtpVerified(false);
    }
  }

  async function handleSendOtp() {
    const email = formData.email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors((prev) => ({ ...prev, email: 'Enter a valid email address' }));
      return;
    }

    setSendingOtp(true);
    try {
      await sendOtp(email);
      setOtpSent(true);
      toast.success('OTP sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setSendingOtp(false);
    }
  }

  async function handleVerifyOtp() {
    if (!otpCode || otpCode.length < 4) {
      toast.error('Please enter the OTP');
      return;
    }

    setVerifyingOtp(true);
    try {
      await verifyOtp(formData.email.trim(), otpCode);
      setOtpVerified(true);
      toast.success('Email verified!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setVerifyingOtp(false);
    }
  }

  function validate() {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    else if (formData.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) errs.email = 'Enter a valid email address';
    if (!otpVerified) errs.email = 'Please verify your email with OTP';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone.trim())) errs.phone = 'Enter a valid 10-digit phone number';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.phone, formData.password, otpCode);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Create Account</h1>
        <p style={subtitleStyle}>Join Dheena Arts and explore amazing art</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="register-name">Full Name</label>
            <input
              id="register-name"
              name="name"
              type="text"
              className={`form-input${errors.name ? ' error' : ''}`}
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-email">Email</label>
            <div style={otpRowStyle}>
              <input
                id="register-email"
                name="email"
                type="email"
                className={`form-input${errors.email ? ' error' : ''}`}
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                disabled={otpVerified}
                style={{ flex: 1 }}
              />
              {!otpVerified && (
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ whiteSpace: 'nowrap', padding: '10px 16px', fontSize: '0.85rem' }}
                  onClick={handleSendOtp}
                  disabled={sendingOtp || !formData.email.trim()}
                >
                  {sendingOtp ? 'Sending...' : otpSent ? 'Resend OTP' : 'Send OTP'}
                </button>
              )}
            </div>
            {otpVerified && (
              <div style={verifiedBadgeStyle}>
                &#10003; Email verified
              </div>
            )}
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          {otpSent && !otpVerified && (
            <div className="form-group">
              <label className="form-label" htmlFor="register-otp">Enter OTP</label>
              <div style={otpRowStyle}>
                <input
                  id="register-otp"
                  type="text"
                  inputMode="numeric"
                  className="form-input"
                  placeholder="Enter 6-digit OTP"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  style={{ ...otpInputStyle, flex: 1 }}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ whiteSpace: 'nowrap', padding: '10px 16px', fontSize: '0.85rem' }}
                  onClick={handleVerifyOtp}
                  disabled={verifyingOtp || otpCode.length < 4}
                >
                  {verifyingOtp ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="register-phone">Phone Number</label>
            <input
              id="register-phone"
              name="phone"
              type="tel"
              className={`form-input${errors.phone ? ' error' : ''}`}
              placeholder="10-digit mobile number"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
              maxLength={10}
            />
            {errors.phone && <span className="form-error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-password">Password</label>
            <input
              id="register-password"
              name="password"
              type="password"
              className={`form-input${errors.password ? ' error' : ''}`}
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-confirm">Confirm Password</label>
            <input
              id="register-confirm"
              name="confirmPassword"
              type="password"
              className={`form-input${errors.confirmPassword ? ' error' : ''}`}
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading || !otpVerified}
            style={{ marginTop: 'var(--space-sm)' }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={footerStyle}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
