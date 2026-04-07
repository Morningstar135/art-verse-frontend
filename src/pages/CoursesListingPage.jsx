import React, { useState, useEffect } from 'react';
import { getCourses } from '../services/courseService';
import CourseCard from '../components/courses/CourseCard';
import { Loader, EmptyState } from '../components/common';

const pageStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: 'var(--space-xl) var(--space-md)',
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
  fontSize: '1rem',
  color: 'var(--color-text-light)',
  textAlign: 'center',
  marginBottom: 'var(--space-2xl)',
  maxWidth: '600px',
  margin: '0 auto var(--space-2xl)',
  lineHeight: 1.6,
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: 'var(--space-xl)',
};

function CoursesListingPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      setError(null);
      try {
        const response = await getCourses();
        setCourses(response.data.courses || []);
      } catch (err) {
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  if (loading) return <Loader fullPage />;

  if (error) {
    return (
      <div style={pageStyle}>
        <div style={{ textAlign: 'center', padding: 'var(--space-xl)', color: '#c0392b' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Art Courses</h1>
      <p style={subtitleStyle}>
        Discover and learn from our curated art courses taught by talented artists.
      </p>

      {courses.length === 0 ? (
        <EmptyState
          title="No courses available"
          message="We are working on new courses. Check back soon."
        />
      ) : (
        <div style={gridStyle}>
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CoursesListingPage;
