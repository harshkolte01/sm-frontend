import React, { useState } from 'react';

const Avatar = ({ src, name, size = 'md', className = '' }) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const baseClasses = `inline-flex items-center justify-center rounded-full bg-gray-500 text-white font-medium ${sizeClasses[size]} ${className}`;

  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={name || 'User avatar'}
        className={`${baseClasses} object-cover`}
        onError={handleImageError}
      />
    );
  }

  return (
    <div className={baseClasses} role="img" aria-label={name || 'User avatar'}>
      {getInitials(name)}
    </div>
  );
};

export default Avatar;