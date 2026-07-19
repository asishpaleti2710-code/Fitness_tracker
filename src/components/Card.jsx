import React from 'react';

const Card = ({ title, children, className = '', ...props }) => {
    return (
        <div
            className={`card ${className}`}
            style={{
                backgroundColor: 'var(--bg-card)',
                padding: 'var(--space-md)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--space-md)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                ...props.style // Allow style override
            }}
            {...props}
        >
            {title && <h3 style={{ marginTop: 0, marginBottom: 'var(--space-sm)', fontSize: '1rem', color: 'var(--text-muted)' }}>{title}</h3>}
            <div>
                {children}
            </div>
        </div>
    );
};

export default Card;
