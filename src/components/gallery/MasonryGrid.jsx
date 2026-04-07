import React from 'react';
import Masonry from 'react-masonry-css';
import ArtworkCard from './ArtworkCard';

const masonryStyle = `
  .masonry-grid {
    display: flex;
    margin-left: calc(var(--space-md) * -1);
    width: auto;
  }
  .masonry-grid-column {
    padding-left: var(--space-md);
    background-clip: padding-box;
  }
`;

const breakpoints = {
  default: 4,
  1200: 3,
  900: 2,
  600: 1,
};

function MasonryGrid({ artworks = [] }) {
  return (
    <>
      <style>{masonryStyle}</style>
      <Masonry
        breakpointCols={breakpoints}
        className="masonry-grid"
        columnClassName="masonry-grid-column"
      >
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </Masonry>
    </>
  );
}

export default MasonryGrid;
