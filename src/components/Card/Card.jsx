import React from 'react';
import { clsx } from 'clsx';
import styles from './Card.module.css';

const Card = ({ 
  children, 
  variant = 'default',
  padding = 'medium',
  hover = false,
  className,
  onClick,
  ...props 
}) => {
  const cardClasses = clsx(
    styles.card,
    styles[variant],
    styles[`padding-${padding}`],
    {
      [styles.hover]: hover,
      [styles.clickable]: onClick,
    },
    className
  );

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className, ...props }) => (
  <div className={clsx(styles.header, className)} {...props}>
    {children}
  </div>
);

const CardBody = ({ children, className, ...props }) => (
  <div className={clsx(styles.body, className)} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className, ...props }) => (
  <div className={clsx(styles.footer, className)} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className, ...props }) => (
  <h3 className={clsx(styles.title, className)} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ children, className, ...props }) => (
  <p className={clsx(styles.description, className)} {...props}>
    {children}
  </p>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Description = CardDescription;

export default Card;
