import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatPrice, truncateText } from '../../utils/formatters';

const cardStyle = {
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  overflow: 'hidden',
  boxShadow: 'var(--shadow-sm)',
  textDecoration: 'none',
  color: 'inherit',
  display: 'block',
  height: '100%',
};

const thumbnailContainerStyle = {
  position: 'relative',
  overflow: 'hidden',
};

const thumbnailStyle = {
  width: '100%',
  height: '180px',
  objectFit: 'cover',
  display: 'block',
};

const placeholderStyle = {
  width: '100%',
  height: '180px',
  backgroundColor: 'var(--color-border)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--color-text-light)',
  fontSize: '0.875rem',
};

const lessonBadgeStyle = {
  position: 'absolute',
  top: 'var(--space-sm)',
  right: 'var(--space-sm)',
  backgroundColor: 'rgba(26, 26, 46, 0.8)',
  color: 'var(--color-white)',
  padding: '4px 10px',
  borderRadius: 'var(--radius-full)',
  fontSize: '0.6875rem',
  fontWeight: 600,
  backdropFilter: 'blur(4px)',
};

const bodyStyle = {
  padding: 'var(--space-md)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-xs)',
};

const titleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '1.05rem',
  fontWeight: 600,
  color: 'var(--color-primary)',
  lineHeight: 1.3,
};

const descriptionStyle = {
  fontSize: '0.875rem',
  color: 'var(--color-text-light)',
  lineHeight: 1.5,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

const footerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 var(--space-md) var(--space-md)',
};

const priceStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '1.1rem',
  fontWeight: 700,
  color: 'var(--color-accent)',
};

function CourseCard({ course }) {
  return (
    <Link to={`/courses/${course.id}`} style={{ textDecoration: 'none' }}>
      <motion.div
        style={cardStyle}
        whileHover={{ y: -6, boxShadow: 'var(--shadow-xl)' }}
        transition={{ duration: 0.2 }}
      >
        <div style={thumbnailContainerStyle}>
          {course.thumbnailUrl ? (
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              style={thumbnailStyle}
              loading="lazy"
            />
          ) : (
            <div style={placeholderStyle}>No Thumbnail</div>
          )}
          {course.lessonCount > 0 && (
            <span style={lessonBadgeStyle}>
              {course.lessonCount} lesson{course.lessonCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div style={bodyStyle}>
          <h3 style={titleStyle}>{course.title}</h3>
          {course.description && (
            <p style={descriptionStyle}>
              {truncateText(course.description, 120)}
            </p>
          )}
        </div>

        <div style={footerStyle}>
          <span style={priceStyle}>
            {course.price === 0 ? 'Free' : formatPrice(course.price)}
          </span>
        </div>
      </motion.div>
    </Link>
  );
}

export default CourseCard;
