import React from 'react';
import styles from '../HeaderTab/HeaderTab.module.css';
import { useNavigate } from 'react-router-dom';

const HeaderTab = ({ title,subtitle }) => {
    const navigate = useNavigate();
    return (
        <div className={styles.headerMain}>
            <div className={styles.titleDiv}>
                <div onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
                    <img src='Svg/back-arrow.svg' alt='Back' />
                </div>
                <div>
                    <h2>{title}</h2>
                    <p>{subtitle}</p>
                </div>
            </div>

            <div className={styles.IconBoth}>
                <div className={styles.iconSearch}>
                    <img src='Svg/searchSvg.svg' alt='Search' />
                </div>
                <div className={styles.iconFillter}>
                    <img src='Svg/filterSvg.svg' alt='Filter' />
                </div>
            </div>
        </div>
    );
};

export default HeaderTab;
