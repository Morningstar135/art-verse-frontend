import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getCourse, enrollInCourse, confirmCoursePayment } from '../services/courseService';
import { useAuth } from '../context/AuthContext';
import CurriculumList from '../components/courses/CurriculumList';
import { Loader, Button } from '../components/common';
import { formatPrice } from '../utils/formatters';

const pageStyle = {
  maxWidth: '1100px',
  margin: '0 auto',
  padding: 'var(--space-xl) var(--space-md)',
};

const layoutStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 380px',
  gap: 'var(--space-2xl)',
  alignItems: 'start',
};

const mobileLayoutStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-xl)',
};

const thumbnailStyle = {
  width: '100%',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-md)',
  marginBottom: 'var(--space-lg)',
};

const placeholderThumbStyle = {
  width: '100%',
  height: '300px',
  backgroundColor: 'var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--color-text-light)',
  marginBottom: 'var(--space-lg)',
};

const titleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '1.75rem',
  fontWeight: 700,
  color: 'var(--color-primary)',
  marginBottom: 'var(--space-md)',
  lineHeight: 1.3,
};

const descriptionStyle = {
  fontSize: '1rem',
  color: 'var(--color-text)',
  lineHeight: 1.7,
  whiteSpace: 'pre-line',
};

const sidebarStyle = {
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-md)',
  padding: 'var(--space-xl)',
  position: 'sticky',
  top: 'var(--space-xl)',
};

const priceStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '1.75rem',
  fontWeight: 700,
  color: 'var(--color-accent)',
  marginBottom: 'var(--space-lg)',
  textAlign: 'center',
};

const curriculumSectionStyle = {
  marginTop: 'var(--space-xl)',
};

const curriculumTitleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '1.25rem',
  fontWeight: 600,
  color: 'var(--color-primary)',
  marginBottom: 'var(--space-md)',
};

const curriculumBoxStyle = {
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-sm)',
  overflow: 'hidden',
};

const paymentModalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '16px',
};

const paymentModalStyle = {
  backgroundColor: 'var(--color-bg, #0f0f23)',
  borderRadius: '16px',
  padding: '28px',
  maxWidth: '480px',
  width: '100%',
  maxHeight: '90vh',
  overflowY: 'auto',
  border: '1px solid var(--color-border, rgba(255,255,255,0.1))',
};

const paymentTabsStyle = {
  display: 'flex',
  gap: '0',
  marginBottom: '20px',
  borderBottom: '1px solid var(--color-border, rgba(255,255,255,0.1))',
};

const paymentTabStyle = (active) => ({
  padding: '10px 16px',
  fontSize: '0.875rem',
  fontWeight: active ? 600 : 400,
  color: active ? 'var(--color-accent)' : 'var(--color-text-light)',
  background: 'transparent',
  border: 'none',
  borderBottom: active ? '2px solid var(--color-accent)' : '2px solid transparent',
  cursor: 'pointer',
  fontFamily: 'var(--font-primary)',
});

const paymentLabelStyle = {
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--color-text-light)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '6px',
};

const paymentValueStyle = {
  fontSize: '0.95rem',
  color: 'var(--color-text)',
  fontWeight: 500,
  padding: '8px 12px',
  backgroundColor: 'rgba(255,255,255,0.05)',
  borderRadius: '6px',
  fontFamily: 'monospace',
  wordBreak: 'break-all',
  marginBottom: '12px',
};

const paymentNoteStyle = {
  fontSize: '0.8rem',
  color: 'var(--color-text-light)',
  backgroundColor: 'rgba(233, 69, 96, 0.1)',
  border: '1px solid rgba(233, 69, 96, 0.2)',
  borderRadius: '8px',
  padding: '12px',
  lineHeight: 1.5,
  marginTop: '16px',
};

function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [paymentTab, setPaymentTab] = useState('upi');
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [txnLast4, setTxnLast4] = useState('');
  const [txnSubmitting, setTxnSubmitting] = useState(false);
  const [txnSubmitted, setTxnSubmitted] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchCourse = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCourse(id);
      setCourse(response.data);
    } catch (err) {
      setError('Failed to load course details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setEnrolling(true);

    try {
      const response = await enrollInCourse(id);
      const data = response.data;
      setEnrollmentData(data);
      toast.success('Enrollment created! Please complete payment.');
    } catch (err) {
      const message =
        err.response?.data?.error || 'Failed to initiate enrollment.';
      toast.error(message);
    } finally {
      setEnrolling(false);
    }
  };

  const handleTxnSubmit = async () => {
    if (txnLast4.length !== 4) return;
    setTxnSubmitting(true);
    try {
      await confirmCoursePayment(id, txnLast4);
      setTxnSubmitted(true);
      toast.success('Payment details submitted! We will verify and confirm your enrollment.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit payment details');
    } finally {
      setTxnSubmitting(false);
    }
  };

  if (loading) return <Loader fullPage />;

  if (error || !course) {
    return (
      <div style={pageStyle}>
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--space-xl)',
            color: '#c0392b',
          }}
        >
          {error || 'Course not found'}
        </div>
      </div>
    );
  }

  const sidebar = (
    <div style={sidebarStyle}>
      <div style={priceStyle}>
        {course.price === 0 ? 'Free' : formatPrice(course.price)}
      </div>

      {course.isEnrolled ? (
        <Button
          variant="primary"
          fullWidth
          onClick={() => {
            const firstLesson =
              course.lessons && course.lessons.length > 0
                ? course.lessons.sort((a, b) => a.sortOrder - b.sortOrder)[0]
                : null;
            if (firstLesson) {
              navigate(`/courses/${id}/lessons/${firstLesson._id}`);
            }
          }}
        >
          Continue Learning
        </Button>
      ) : (
        <Button
          variant="primary"
          fullWidth
          loading={enrolling}
          onClick={handleEnroll}
        >
          Enroll Now
        </Button>
      )}

      {(course.lessonCount || 0) > 0 && (
        <div
          style={{
            marginTop: 'var(--space-lg)',
            fontSize: '0.875rem',
            color: 'var(--color-text-light)',
            textAlign: 'center',
          }}
        >
          {course.lessonCount} lesson{course.lessonCount !== 1 ? 's' : ''} included
        </div>
      )}
    </div>
  );

  const mainContent = (
    <div>
      {course.thumbnailUrl ? (
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          style={thumbnailStyle}
        />
      ) : (
        <div style={placeholderThumbStyle}>No Thumbnail</div>
      )}
      <h1 style={titleStyle}>{course.title}</h1>
      <div style={descriptionStyle}>{course.description}</div>
    </div>
  );

  return (
    <div style={pageStyle}>
      <div style={isMobile ? mobileLayoutStyle : layoutStyle}>
        {mainContent}
        {sidebar}
      </div>

      <div style={curriculumSectionStyle}>
        <h2 style={curriculumTitleStyle}>Curriculum</h2>
        <div style={curriculumBoxStyle}>
          <CurriculumList
            lessons={course.lessons || []}
            isEnrolled={course.isEnrolled}
            courseId={id}
          />
        </div>
      </div>

      {enrollmentData && (
        <div style={paymentModalOverlayStyle} onClick={() => setEnrollmentData(null)}>
          <div style={paymentModalStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>
              Payment Details
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '16px' }}>
              Complete payment for <strong>{enrollmentData.courseTitle}</strong> &mdash; {formatPrice(enrollmentData.amount)}
            </p>

            <div style={paymentTabsStyle}>
              <button style={paymentTabStyle(paymentTab === 'upi')} onClick={() => setPaymentTab('upi')} type="button">UPI / QR</button>
              <button style={paymentTabStyle(paymentTab === 'bank')} onClick={() => setPaymentTab('bank')} type="button">Bank Transfer</button>
            </div>

            {paymentTab === 'upi' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
                  <img src="/upi-qr.jpeg" alt="UPI QR Code" style={{ width: '280px', height: '280px', borderRadius: '12px', backgroundColor: '#fff', padding: '8px' }} />
                </div>
                <div style={paymentLabelStyle}>GPay Number</div>
                <div style={paymentValueStyle}>+91 8667397995</div>
                <div style={paymentLabelStyle}>UPI ID</div>
                <div style={paymentValueStyle}>thina1999boss@okhdfcbank</div>
              </>
            )}

            {paymentTab === 'bank' && (
              <>
                <div style={paymentLabelStyle}>Account Holder Name</div>
                <div style={paymentValueStyle}>Thillainathan</div>
                <div style={paymentLabelStyle}>Bank Name</div>
                <div style={paymentValueStyle}>Tamilnadu Mercantile Bank</div>
                <div style={paymentLabelStyle}>Account Number</div>
                <div style={paymentValueStyle}>328100050310835</div>
                <div style={paymentLabelStyle}>IFSC Code</div>
                <div style={paymentValueStyle}>TMBL0000328</div>
              </>
            )}

            <div style={paymentNoteStyle}>
              <strong>Important:</strong> Your enrollment will be confirmed once payment is verified by our team. Please mention the course name in payment remarks.
            </div>

            <div style={{ marginTop: '20px', padding: '16px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--color-border, rgba(255,255,255,0.1))' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '8px' }}>
                Enter last 4 digits of your Transaction ID
              </div>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                placeholder="0000"
                value={txnLast4}
                onChange={(e) => setTxnLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
                disabled={txnSubmitted}
                style={{ width: '100%', padding: '12px 14px', fontSize: '1.1rem', fontFamily: 'monospace', letterSpacing: '8px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border, rgba(255,255,255,0.2))', borderRadius: '8px', color: 'var(--color-text)', outline: 'none', boxSizing: 'border-box' }}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: '6px' }}>
                You can find this in your UPI app or bank statement
              </div>
              <button
                onClick={handleTxnSubmit}
                disabled={txnLast4.length !== 4 || txnSubmitting || txnSubmitted}
                style={{ width: '100%', marginTop: '12px', padding: '12px', fontSize: '0.95rem', fontWeight: 600, backgroundColor: (txnLast4.length !== 4 || txnSubmitting || txnSubmitted) ? 'rgba(233, 69, 96, 0.4)' : 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: '8px', cursor: (txnLast4.length !== 4 || txnSubmitting || txnSubmitted) ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-primary)' }}
                type="button"
              >
                {txnSubmitted ? 'Submitted' : txnSubmitting ? 'Submitting...' : 'Submit & Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseDetailPage;
