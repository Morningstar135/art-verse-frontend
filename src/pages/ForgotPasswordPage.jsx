import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../services/authService';
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

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=phone, 2=otp+password
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  async function handleSendOtp(e) {
    e.preventDefault();
    if (!phone.trim() || !/^\d{10}$/.test(phone.trim())) {
      setErrors({ phone: 'Enter a valid 10-digit phone number' });
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const res = await forgotPassword(phone);
      if (res.data.devMode) {
        toast.success('Dev mode: OTP is 123456');
      } else {
        toast.success('OTP sent to your phone');
      }
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(index, value) {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`fp-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  }

  function handleOtpKeyDown(index, e) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`fp-otp-${index - 1}`);
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

  async function handleResetPassword(e) {
    e.preventDefault();
    const code = otp.join('');
    const errs = {};

    if (code.length !== 6) errs.otp = 'Enter the 6-digit OTP';
    if (!newPassword || newPassword.length < 8) errs.password = 'Password must be at least 8 characters';
    if (newPassword !== confirmPassword) errs.confirm = 'Passwords do not match';

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      await resetPassword(phone, code, newPassword);
      toast.success('Password reset successfully! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Reset Password</h1>
        <p style={subtitleStyle}>
          {step === 1
            ? 'Enter your phone number to receive an OTP'
            : `Enter OTP sent to ${phone} and set a new password`}
        </p>

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label className="form-label" htmlFor="fp-phone">Phone Number</label>
              <input
                id="fp-phone"
                type="tel"
                className={`form-input${errors.phone ? ' error' : ''}`}
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setErrors({}); }}
                autoComplete="tel"
                maxLength={10}
              />
              {errors.phone && <span className="form-error">{errors.phone}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
              style={{ marginTop: 'var(--space-sm)' }}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div style={otpInputStyle} onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`fp-otp-${i}`}
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
            {errors.otp && <div className="form-error" style={{ textAlign: 'center', marginBottom: 'var(--space-sm)' }}>{errors.otp}</div>}

            <div className="form-group">
              <label className="form-label" htmlFor="fp-password">New Password</label>
              <input
                id="fp-password"
                type="password"
                className={`form-input${errors.password ? ' error' : ''}`}
                placeholder="Min. 8 characters"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setErrors({}); }}
                autoComplete="new-password"
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="fp-confirm">Confirm New Password</label>
              <input
                id="fp-confirm"
                type="password"
                className={`form-input${errors.confirm ? ' error' : ''}`}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setErrors({}); }}
                autoComplete="new-password"
              />
              {errors.confirm && <span className="form-error">{errors.confirm}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            <div style={{ textAlign: 'center', marginTop: 'var(--space-md)' }}>
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
          Remember your password?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
