import React from 'react';

const BootstrapModal = ({ show, onClose, onConfirm, title, message }) => {
  return (
    <div className={`modal ${show ? 'show' : ''}`} tabindex="-1" style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={onConfirm}>Save changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BootstrapModal;
