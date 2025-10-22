import React from 'react';
import { createPortal } from 'react-dom';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    console.log('ConfirmModal render:', { isOpen, title });

    if (!isOpen) return null;

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">{title}</h3>
                </div>
                <div className="modal-body">
                    <p className="modal-message">{message}</p>
                </div>
                <div className="modal-footer">
                    <button
                        className="modal-btn modal-btn-cancel"
                        onClick={onClose}
                    >
                        Hủy
                    </button>
                    <button
                        className="modal-btn modal-btn-confirm"
                        onClick={() => {
                            console.log('Confirm clicked');
                            onConfirm();
                            onClose();
                        }}
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmModal;
