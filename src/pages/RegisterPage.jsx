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

const otpInputStyle = {
  display: 'flex',
  gap: '8px',
  justifyContent: 'center',
  marginBottom: 'var(--space-md)',
};

const otpDigitStyle = {
  width: '48px',
  height: '56px',
  textAlign: 'center',
  fontSize: '1.5rem',
  fontWeight: 700,
  borderRadius: 'var(--radius-md)',
  border: '1.5px solid var(--color-border)',
  backgroundColor: 'var(--color-bg)',
  fontFamily: 'var(--font-primary)',
  color: 'var(--color-text)',
  outline: 'none',
};

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=form, 2=otp
  const [formData, setFormData] = useState({ name: '', phone: '', password: '', confirmPassword: '' });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    else if (formData.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone.trim())) errs.phone = 'Enter a valid 10-digit phone number';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  }

  async function handleSendOtp(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSendingOtp(true);
    try {
      const res = await sendOtp(formData.phone);
      if (res.data.devMode) {
        toast.success('Dev mode: OTP is 123456');
      } else {
        toast.success('OTP sent to your phone');
      }
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setSendingOtp(false);
    }
  }

  function handleOtpChange(index, value) {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  }

  function handleOtpKeyDown(index, e) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  }

  function handleOtpPaste(e) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      e.preventDefault();
    }
  }

  async function handleVerifyAndRegister(e) {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      // Verify OTP first
      await verifyOtp(formData.phone, code);

      // Then register
      await register(formData.name, formData.phone, formData.password);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Verification failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    setSendingOtp(true);
    try {
      const res = await sendOtp(formData.phone);
      if (res.data.devMode) {
        toast.success('Dev mode: OTP is 123456');
      } else {
        toast.success('OTP resent');
      }
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setSendingOtp(false);
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Create Account</h1>
        <p style={subtitleStyle}>
          {step === 1 ? 'Join Dheena Arts and explore amazing art' : `Enter the OTP sent to ${formData.phone}`}
        </p>

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
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
              disabled={sendingOtp}
              style={{ marginTop: 'var(--space-sm)' }}
            >
              {sendingOtp ? 'Sending OTP...' : 'Send OTP & Continue'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndRegister}>
            <div style={otpInputStyle} onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  style={otpDigitStyle}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify & Create Account'}
            </button>

            <div style={{ textAlign: 'center', marginTop: 'var(--space-md)' }}>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={sendingOtp}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-accent)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-primary)',
                }}
              >
                {sendingOtp ? 'Sending...' : 'Resend OTP'}
              </button>
              <span style={{ margin: '0 8px', color: 'var(--color-text-light)' }}>|</span>
              <button
                type="button"
                onClick={() => { setStep(1); setOtp(['', '', '', '', '', '']); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-light)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-primary)',
                }}
              >
                Change Number
              </button>
            </div>
          </form>
        )}

        <p style={footerStyle}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
