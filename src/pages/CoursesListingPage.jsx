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

const paginationStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 'var(--space-sm)',
  marginTop: 'var(--space-xl)',
};

const pageBtnStyle = (active) => ({
  padding: '8px 16px',
  borderRadius: 'var(--radius-md)',
  border: '1.5px solid',
  borderColor: active ? 'var(--color-accent)' : 'var(--color-border)',
  backgroundColor: active ? 'var(--color-accent)' : 'transparent',
  color: active ? 'var(--color-white)' : 'var(--color-text)',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 600,
  fontFamily: 'var(--font-primary)',
  transition: 'all var(--transition-fast)',
});

function CoursesListingPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      setError(null);
      try {
        const response = await getCourses({ page, limit: 12 });
        setCourses(response.data.courses || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } catch (err) {
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, [page]);

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
        <>
          <div style={gridStyle}>
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {totalPages > 1 && (
            <div style={paginationStyle}>
              <button
                style={pageBtnStyle(false)}
                onClick={() => setPage((p) => p - 1)}
                disabled={page <= 1}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  style={pageBtnStyle(p === page)}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                style={pageBtnStyle(false)}
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CoursesListingPage;
