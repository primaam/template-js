import React from "react";
import styles from "./InvoiceFormModal.module.css";

const InvoiceFormModal = ({ isOpen, onClose, children }) => {
    if (isOpen === false) return null;

    return (
        <div onClick={onClose} className={styles.container}>
            <div className={styles.mainContainer}>{children}</div>
        </div>
    );
};

export default InvoiceFormModal;
