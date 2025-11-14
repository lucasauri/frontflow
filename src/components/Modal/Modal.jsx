import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ title, open, onClose, footer, children }) => {
  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label={title}>
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
        </div>
        <div className={styles.body}>{children}</div>
        <div className={styles.footer}>
          {footer}
        </div>
      </div>
    </div>
  );
};

export default Modal;
