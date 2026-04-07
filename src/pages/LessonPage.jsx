import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLesson } from '../services/courseService';
import LessonPlayer from '../components/courses/LessonPlayer';
import { Loader } from '../components/common';

const pageStyle = {
  maxWidth: '960px',
  margin: '0 auto',
  padding: 'var(--space-xl) var(--space-md)',
};

const breadcrumbStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-xs)',
  marginBottom: 'var(--space-lg)',
  fontSize: '0.875rem',
};

const breadcrumbLinkStyle = {
  color: 'var(--color-accent)',
  textDecoration: 'none',
  fontWeight: 500,
};

const breadcrumbSeparator = {
  color: 'var(--color-text-light)',
};

const breadcrumbCurrent = {
  color: 'var(--color-text-light)',
};

const lessonTitleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '1.5rem',
  fontWeight: 700,
  color: 'var(--color-primary)',
  marginTop: 'var(--space-lg)',
  marginBottom: 'var(--space-md)',
};

const descriptionStyle = {
  fontSize: '1rem',
  color: 'var(--color-text)',
  lineHeight: 1.7,
  whiteSpace: 'pre-line',
  marginBottom: 'var(--space-xl)',
};

const navContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 'var(--space-xl)',
  paddingTop: 'var(--space-lg)',
  borderTop: '1px solid var(--color-border)',
};

const navButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--space-xs)',
  padding: 'var(--space-sm) var(--space-lg)',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  textDecoration: 'none',
  color: 'var(--color-primary)',
  fontSize: '0.875rem',
  fontWeight: 500,
  transition: 'background-color var(--transition-fast), border-color var(--transition-fast)',
};

const navLabelStyle = {
  fontSize: '0.6875rem',
  color: 'var(--color-text-light)',
  marginBottom: '2px',
};

function LessonPage() {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [courseTitle, setCourseTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLesson() {
      setLoading(true);
      setError(null);
      try {
        const response = await getLesson(courseId, lessonId);
        setLesson(response.data.lesson);
        setAllLessons(response.data.allLessons || []);
        setCourseTitle(response.data.courseTitle || '');
      } catch (err) {
        setError(
          err.response?.data?.error || 'Failed to load lesson. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    }
    fetchLesson();
  }, [courseId, lessonId]);

  if (loading) return <Loader fullPage />;

  if (error) {
    return (
      <div style={pageStyle}>
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--space-xl)',
            color: '#c0392b',
          }}
        >
          {error}
        </div>
        <div style={{ textAlign: 'center' }}>
          <Link
            to={`/courses/${courseId}`}
            style={{
              color: 'var(--color-accent)',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            &larr; Back to Course
          </Link>
        </div>
      </div>
    );
  }

  if (!lesson) return null;

  // Find prev/next lessons
  const currentIndex = allLessons.findIndex(
    (l) => l._id === lessonId
  );
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;

  return (
    <div style={pageStyle}>
      {/* Breadcrumb */}
      <div style={breadcrumbStyle}>
        <Link to="/courses" style={breadcrumbLinkStyle}>
          Courses
        </Link>
        <span style={breadcrumbSeparator}>/</span>
        <Link to={`/courses/${courseId}`} style={breadcrumbLinkStyle}>
          {courseTitle || 'Course'}
        </Link>
        <span style={breadcrumbSeparator}>/</span>
        <span style={breadcrumbCurrent}>{lesson.title}</span>
      </div>

      {/* Video Player */}
      <LessonPlayer videoUrl={lesson.videoUrl} title={lesson.title} />

      {/* Lesson Info */}
      <h1 style={lessonTitleStyle}>{lesson.title}</h1>
      {lesson.description && (
        <div style={descriptionStyle}>{lesson.description}</div>
      )}

      {/* Prev / Next Navigation */}
      <div style={navContainerStyle}>
        <div>
          {prevLesson && (
            <Link
              to={`/courses/${courseId}/lessons/${prevLesson._id}`}
              style={navButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            >
              <span>&larr;</span>
              <div>
                <div style={navLabelStyle}>Previous</div>
                <div>{prevLesson.title}</div>
              </div>
            </Link>
          )}
        </div>
        <div>
          {nextLesson && (
            <Link
              to={`/courses/${courseId}/lessons/${nextLesson._id}`}
              style={{
                ...navButtonStyle,
                textAlign: 'right',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            >
              <div>
                <div style={navLabelStyle}>Next</div>
                <div>{nextLesson.title}</div>
              </div>
              <span>&rarr;</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default LessonPage;
