import React, { useState } from 'react';

const containerStyle = {
  position: 'relative',
  width: '100%',
  backgroundColor: '#000',
  borderRadius: 'var(--radius-lg)',
  overflow: 'hidden',
  boxShadow: 'var(--shadow-lg)',
};

const videoStyle = {
  width: '100%',
  display: 'block',
  maxHeight: '70vh',
};

const titleBarStyle = {
  padding: 'var(--space-md) var(--space-lg)',
  backgroundColor: 'rgba(26, 26, 46, 0.95)',
  color: 'var(--color-white)',
  fontFamily: 'var(--font-display)',
  fontSize: '1.1rem',
  fontWeight: 600,
};

const errorContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '300px',
  backgroundColor: '#1a1a2e',
  borderRadius: 'var(--radius-lg)',
  color: 'var(--color-white)',
  padding: 'var(--space-xl)',
  textAlign: 'center',
};

const errorIconStyle = {
  fontSize: '3rem',
  marginBottom: 'var(--space-md)',
  opacity: 0.6,
};

const errorMessageStyle = {
  fontSize: '1rem',
  opacity: 0.8,
  lineHeight: 1.5,
};

function LessonPlayer({ videoUrl, title }) {
  const [hasError, setHasError] = useState(false);

  if (!videoUrl || hasError) {
    return (
      <div style={errorContainerStyle}>
        <div style={errorIconStyle}>&#9888;</div>
        <p style={errorMessageStyle}>
          {!videoUrl
            ? 'Video is not available for this lesson.'
            : 'Failed to load the video. Please try again later.'}
        </p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {title && <div style={titleBarStyle}>{title}</div>}
      <video
        src={videoUrl}
        controls
        controlsList="nodownload"
        style={videoStyle}
        onError={() => setHasError(true)}
        preload="metadata"
      >
        Your browser does not support the video element.
      </video>
    </div>
  );
}

export default LessonPlayer;
