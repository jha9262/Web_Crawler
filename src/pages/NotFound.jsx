import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="not-found">
      <div className="not-found-code">404</div>
      <h2 className="not-found-title">Page Not Found</h2>
      <p className="not-found-desc">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="not-found-actions">
        <button className="neo-button primary" onClick={() => navigate('/')}>
          Back to Dashboard
        </button>
        <button className="neo-button ghost" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    </div>
  );
}

export default NotFound;
