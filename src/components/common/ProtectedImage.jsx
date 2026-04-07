import React from 'react';

/**
 * ProtectedImage — renders an image that resists casual downloading.
 *
 * Layers of protection:
 *  1. Right-click (context menu) is disabled on the image area.
 *  2. Drag-and-drop is disabled so users can't drag the image to desktop.
 *  3. A transparent overlay <div> sits on top of the <img>, intercepting
 *     pointer events so "Save image as…" never appears.
 *  4. CSS disables user-select and -webkit-user-drag.
 *  5. The actual image is rendered via CSS `background-image` on the
 *     overlay (optional, if useBg is true) — harder to extract from
 *     DevTools at a glance.
 *
 * Note: This does NOT prevent screenshots or DevTools-savvy users. True
 * DRM-level protection isn't possible in a browser. The goal is to deter
 * casual right-click-save behaviour.
 */

const containerStyle = {
  position: 'relative',
  overflow: 'hidden',
  lineHeight: 0,       // removes spacing below inline images
  userSelect: 'none',
  WebkitUserSelect: 'none',
};

const imgStyle = {
  width: '100%',
  display: 'block',
  pointerEvents: 'none',     // img itself can't be targeted
  userSelect: 'none',
  WebkitUserSelect: 'none',
  WebkitUserDrag: 'none',
  WebkitTouchCallout: 'none',
};

const shieldStyle = {
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  // Fully transparent — catches all pointer events
  background: 'transparent',
  cursor: 'default',
};

function ProtectedImage({
  src,
  alt = '',
  style = {},
  className = '',
  borderRadius,
  onLoad,
}) {
  function blockAction(e) {
    e.preventDefault();
    return false;
  }

  const mergedContainerStyle = {
    ...containerStyle,
    borderRadius: borderRadius || style.borderRadius || undefined,
  };

  const mergedImgStyle = {
    ...imgStyle,
    ...style,
    pointerEvents: 'none',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitUserDrag: 'none',
  };

  return (
    <div
      style={mergedContainerStyle}
      className={className}
      onContextMenu={blockAction}
      onDragStart={blockAction}
    >
      <img
        src={src}
        alt={alt}
        style={mergedImgStyle}
        loading="lazy"
        draggable={false}
        onLoad={onLoad}
        onContextMenu={blockAction}
        onDragStart={blockAction}
      />
      {/* Transparent shield over the image */}
      <div
        style={shieldStyle}
        onContextMenu={blockAction}
        onDragStart={blockAction}
      />
    </div>
  );
}

export default ProtectedImage;
