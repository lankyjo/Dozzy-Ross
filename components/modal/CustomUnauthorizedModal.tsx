"use client";
import { useEffect } from "react";
import styles from "./CustomUnauthorizedModal.module.css";

type Props = {
  show: boolean;
  onClose: () => void;
};

export default function CustomUnauthorizedModal({ show }: Props) {
  // Handle escape key press
  useEffect(() => {
    if (!show) return;

    console.log("Custom modal is shown:", show);

    // Force body to not scroll when modal is open
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }

    // Cleanup
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, [show]);

  // Don't render anything if not showing
  if (!show) return null;

  const handleLogout = () => {
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();

    // Clear cookies
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Redirect to home page
    window.location.href = "/";
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>⚠️ UNAUTHORIZED ACCESS</h2>
        </div>
        <div className={styles.modalBody}>
          <p>
            You are not authorized to access this system. The user ID associated
            with your account doesn&apos;t match the expected ID for this site.
            Please contact the administrator.
          </p>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            LOG OUT NOW
          </button>
        </div>
      </div>
    </div>
  );
}
