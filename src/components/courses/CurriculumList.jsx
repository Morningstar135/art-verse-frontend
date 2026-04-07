import React from 'react';
import { Link } from 'react-router-dom';

const listStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
};

const itemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-md)',
  padding: 'var(--space-md)',
  borderBottom: '1px solid var(--color-border)',
  transition: 'background-color var(--transition-fast)',
};

const numberStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.8125rem',
  fontWeight: 600,
  flexShrink: 0,
};

const lessonInfoStyle = {
  flex: 1,
  minWidth: 0,
};

const lessonTitleStyle = {
  fontSize: '0.9375rem',
  fontWeight: 500,
  color: 'var(--color-primary)',
  marginBottom: '2px',
};

const lessonDurationStyle = {
  fontSize: '0.75rem',
  color: 'var(--color-text-light)',
};

const lockIconStyle = {
  fontSize: '1rem',
  color: 'var(--color-text-light)',
  flexShrink: 0,
};

const unlockIconStyle = {
  fontSize: '1rem',
  color: 'var(--color-accent)',
  flexShrink: 0,
};

function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return '';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function CurriculumList({ lessons = [], isEnrolled = false, courseId }) {
  const sorted = [...lessons].sort((a, b) => a.sortOrder - b.sortOrder);

  if (sorted.length === 0) {
    return (
      <div
        style={{
          padding: 'var(--space-lg)',
          textAlign: 'center',
          color: 'var(--color-text-light)',
          fontSize: '0.9375rem',
        }}
      >
        No lessons available yet.
      </div>
    );
  }

  return (
    <ul style={listStyle}>
      {sorted.map((lesson, index) => {
        const duration = formatDuration(lesson.duration);
        const content = (
          <li
            key={lesson._id}
            style={{
              ...itemStyle,
              borderBottom:
                index === sorted.length - 1
                  ? 'none'
                  : '1px solid var(--color-border)',
              cursor: isEnrolled ? 'pointer' : 'default',
            }}
            onMouseEnter={(e) => {
              if (isEnrolled) {
                e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div
              style={{
                ...numberStyle,
                backgroundColor: isEnrolled
                  ? 'var(--color-accent)'
                  : 'var(--color-border)',
                color: isEnrolled
                  ? 'var(--color-white)'
                  : 'var(--color-text-light)',
              }}
            >
              {lesson.sortOrder || index + 1}
            </div>
            <div style={lessonInfoStyle}>
              <div style={lessonTitleStyle}>{lesson.title}</div>
              {duration && <div style={lessonDurationStyle}>{duration}</div>}
            </div>
            {isEnrolled ? (
              <span style={unlockIconStyle} title="Unlocked">
                &#9654;
              </span>
            ) : (
              <span style={lockIconStyle} title="Locked">
                &#128274;
              </span>
            )}
          </li>
        );

        if (isEnrolled) {
          return (
            <Link
              key={lesson._id}
              to={`/courses/${courseId}/lessons/${lesson._id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {content}
            </Link>
          );
        }

        return content;
      })}
    </ul>
  );
}

export default CurriculumList;
