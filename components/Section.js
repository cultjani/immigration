'use client';
import React from 'react';

// Section component can take in a unique layout type and custom content
const Section = ({ children, scrollSpeed, customClass }) => {
  return (
    <div 
      className={`section ${customClass}`} 
      data-scroll 
      data-scroll-speed={scrollSpeed}
    >
      {children}
    </div>
  );
};

export default Section;
