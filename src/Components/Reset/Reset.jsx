import React, { useState } from 'react';
import styles from '../Reset/Reset.module.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import URL from '../../config/api';

const Reset = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const customer = JSON.parse(localStorage.getItem('customerInfo'));
  const customerId = customer?.id;

  const handlePasswordReset = async () => {
    setError('');

    if (!newPassword || !confirmPassword) {
      return setError("Please fill both fields.");
    }

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      const response = await axios.put(`${URL}/customer/set-new-password/${customerId}`, {
        newPassword,
        confirmPassword,
      });

      console.log("✅ Password reset success:", response.data);
      navigate('/onboarding');

    } catch (err) {
      console.error("❌ Reset error:", err);
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className={styles.resetMain}>
      <div className={styles.detailsDiv}>
        <div className={styles.blackLogo}>
          <img src='Svg/b-houseBlack.svg' alt='' />
        </div>
        <div className={styles.resetLockDiv}>
          <img src='Svg/resetLock.svg' alt='' />
        </div>
        <div className={styles.Title}>
          <h1>Reset Password to Access</h1>
          <p>Please enter your new password to reset your account.</p>
        </div>
        <div className={styles.confirmDivMian}>
          <div className={styles.confirmDiv}>
            <div className={styles.Input1}>
              <input
                type="password"
                placeholder="Enter your new password"
                className={styles.inputField}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div><img src='Svg/eye.svg' alt='' /></div>
            </div>
            <div className={styles.Input2}>
              <input
                type="password"
                placeholder="Confirm new password"
                className={styles.inputField}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div><img src='Svg/eye.svg' alt='' /></div>
            </div>
          </div>

          {error && <p className={styles.errorText}>{error}</p>}

          <div className={styles.BtnDiv}>
            <div className={styles.CancelBtn} onClick={() => navigate("/")}><p>Cancel</p></div>
            <div className={styles.ContinueBtn} onClick={handlePasswordReset}>
              <p>Continue</p>
            </div>
          </div>
        </div>
      </div>

      <div></div>
    </div>
  );
};

export default Reset;
