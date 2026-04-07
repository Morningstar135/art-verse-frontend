import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Loader, EmptyState } from '../common';

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: 'var(--space-lg)',
  padding: 'var(--space-md) 0',
};

const cardStyle = {
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  overflow: 'hidden',
  boxShadow: 'var(--shadow-sm)',
  transition: 'transform var(--transition-base), box-shadow var(--transition-base)',
  textDecoration: 'none',
  color: 'inherit',
  display: 'block',
};

const thumbnailStyle = {
  width: '100%',
  height: '160px',
  objectFit: 'cover',
  display: 'block',
};

const placeholderThumbStyle = {
  width: '100%',
  height: '160px',
  backgroundColor: 'var(--color-border)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--color-text-light)',
  fontSize: '0.875rem',
};

const cardBodyStyle = {
  padding: 'var(--space-md)',
};

const titleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '1rem',
  fontWeight: 600,
  color: 'var(--color-primary)',
  marginBottom: 'var(--space-xs)',
};

const linkStyle = {
  fontSize: '0.875rem',
  color: 'var(--color-accent)',
  textDecoration: 'none',
  fontWeight: 500,
};

function EnrolledCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEnrollments() {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/enrollments');
        setEnrollments(response.data.enrollments || response.data || []);
      } catch (err) {
        // API may not exist yet - handle gracefully
        if (err.response?.status === 404) {
          setEnrollments([]);
        } else {
          setError('Unable to load enrolled courses.');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchEnrollments();
  }, []);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-xl)', color: '#c0392b' }}>
        {error}
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <EmptyState
        title="No courses enrolled yet"
        message="Start learning by exploring our available courses."
        action={{
          label: 'Browse Courses',
          onClick: () => (window.location.href = '/courses'),
        }}
      />
    );
  }

  return (
    <div style={gridStyle}>
      {enrollments.map((enrollment) => {
        const course = enrollment.courseId || enrollment.course || enrollment;
        const courseId = course._id || course.id;
        return (
          <Link
            key={enrollment._id || courseId}
            to={`/courses/${courseId}`}
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            {course.thumbnailUrl ? (
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                style={thumbnailStyle}
              />
            ) : (
              <div style={placeholderThumbStyle}>No Thumbnail</div>
            )}
            <div style={cardBodyStyle}>
              <h3 style={titleStyle}>{course.title || 'Untitled Course'}</h3>
              <span style={linkStyle}>Continue Learning</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default EnrolledCourses;
