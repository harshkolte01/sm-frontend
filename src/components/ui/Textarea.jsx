import React from 'react';

const Textarea = ({
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
  error,
  className = '',
  id,
  name,
  disabled,
  showCounter = false,
  ...props
}) => {
  const baseClasses = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-vertical';
  const errorClasses = error 
    ? 'border-red-500 focus:ring-red-500' 
    : 'border-gray-300 focus:border-blue-500';
  const disabledClasses = disabled 
    ? 'bg-gray-100 cursor-not-allowed opacity-60' 
    : 'bg-white';

  const textareaClasses = `${baseClasses} ${errorClasses} ${disabledClasses} ${className}`;

  const currentLength = value ? value.length : 0;
  const shouldShowCounter = showCounter || maxLength;

  return (
    <div className="w-full">
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={textareaClasses}
        disabled={disabled}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      
      <div className="flex justify-between items-center mt-1">
        <div>
          {error && (
            <p 
              id={`${id}-error`}
              className="text-sm text-red-600"
              role="alert"
            >
              {error}
            </p>
          )}
        </div>
        
        {shouldShowCounter && (
          <div className="text-sm text-gray-500">
            {maxLength ? (
              <span className={currentLength > maxLength * 0.9 ? 'text-orange-500' : ''}>
                {currentLength}/{maxLength}
              </span>
            ) : (
              <span>{currentLength} characters</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Textarea;