import React from 'react';
import { clsx } from 'clsx';
import styles from './Button.module.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  loading = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className,
  ...props 
}) => {
  const buttonClasses = clsx(
    styles.button,
    styles[variant],
    styles[size],
    {
      [styles.disabled]: disabled,
      [styles.loading]: loading,
      [styles.withIcon]: icon,
    },
    className
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <div className={styles.spinner} />
      )}
      
      {icon && iconPosition === 'left' && (
        <span className={styles.iconLeft}>
          {icon}
        </span>
      )}
      
      {children && (
        <span className={styles.content}>
          {children}
        </span>
      )}
      
      {icon && iconPosition === 'right' && (
        <span className={styles.iconRight}>
          {icon}
        </span>
      )}
    </button>
  );
};

export default Button;
