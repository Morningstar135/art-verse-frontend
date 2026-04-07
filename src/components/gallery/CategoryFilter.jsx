import React from 'react';

const filterContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--space-sm)',
  marginBottom: 'var(--space-xl)',
  padding: '0 var(--space-md)',
};

const chipStyle = {
  padding: '0.5rem 1.25rem',
  borderRadius: 'var(--radius-full)',
  border: '1.5px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text)',
  fontSize: '0.875rem',
  fontWeight: 500,
  fontFamily: 'var(--font-primary)',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)',
  whiteSpace: 'nowrap',
};

const activeChipStyle = {
  ...chipStyle,
  backgroundColor: 'var(--color-accent)',
  borderColor: 'var(--color-accent)',
  color: 'var(--color-white)',
};

function CategoryFilter({ categories = [], activeCategory, onCategoryChange }) {
  return (
    <div style={filterContainerStyle}>
      <button
        style={activeCategory === null ? activeChipStyle : chipStyle}
        onClick={() => onCategoryChange(null)}
        onMouseEnter={(e) => {
          if (activeCategory !== null) {
            e.target.style.borderColor = 'var(--color-accent)';
          }
        }}
        onMouseLeave={(e) => {
          if (activeCategory !== null) {
            e.target.style.borderColor = 'var(--color-border)';
          }
        }}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          style={activeCategory === cat.slug ? activeChipStyle : chipStyle}
          onClick={() => onCategoryChange(cat.slug)}
          onMouseEnter={(e) => {
            if (activeCategory !== cat.slug) {
              e.target.style.borderColor = 'var(--color-accent)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeCategory !== cat.slug) {
              e.target.style.borderColor = 'var(--color-border)';
            }
          }}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
