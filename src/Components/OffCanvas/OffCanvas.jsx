import React, { useEffect } from 'react'
import styles from '../OffCanvas/Offcanvas.module.css'

const OffCanvas = ({ isOpen, onClose, children, direction = 'right', width = '80%', height = '100%', overlay = true }) => {
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    return (
        <div>
            {overlay && isOpen && <div className={styles.overlay} onClick={onClose} />}
            <div
                className={`${styles.offCanvas} ${isOpen ? styles.open : ''} ${styles[direction]}`}
                style={{
                    width: direction === 'left' || direction === 'right' ? width : '100%',
                    height: direction === 'top' || direction === 'bottom' ? height : '100%',
                }}
            >
                {children}
            </div>
        </div>
    )
}

export default OffCanvas
