import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getCourse, enrollInCourse, verifyEnrollmentPayment } from '../services/courseService';
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

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
      // Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Payment gateway failed to load. Please try again.');
        setEnrolling(false);
        return;
      }

      // Create enrollment order
      const response = await enrollInCourse(id);
      const { razorpayOrderId, amount, key } = response.data;

      // Open Razorpay payment modal
      const options = {
        key,
        amount,
        currency: 'INR',
        name: 'Dheena Arts',
        description: `Enrollment: ${course.title}`,
        order_id: razorpayOrderId,
        handler: async (paymentResponse) => {
          try {
            await verifyEnrollmentPayment(id, {
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpaySignature: paymentResponse.razorpay_signature,
            });
            toast.success('Enrolled successfully!');
            fetchCourse(); // Reload to update enrollment status
          } catch (err) {
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            setEnrolling(false);
          },
        },
        theme: {
          color: '#1a1a2e',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      const message =
        err.response?.data?.error || 'Failed to initiate enrollment.';
      toast.error(message);
    } finally {
      setEnrolling(false);
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

      <div
        style={{
          marginTop: 'var(--space-lg)',
          fontSize: '0.875rem',
          color: 'var(--color-text-light)',
          textAlign: 'center',
        }}
      >
        {course.lessonCount || 0} lesson{(course.lessonCount || 0) !== 1 ? 's' : ''} included
      </div>
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
    </div>
  );
}

export default CourseDetailPage;
