import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import './SystemLogs.css';

const SystemLogs = ({ isOpen, onClose, logs }) => {
    // Handle click outside to close
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if click is inside the logs panel
            const panel = document.querySelector('.system-logs-panel');
            // Check if click is on the notification button (to prevent immediate reopen)
            const btn = document.querySelector('.notification-btn');

            if (isOpen && panel && !panel.contains(event.target) && btn && !btn.contains(event.target)) {
                onClose(event);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getLogIcon = (type) => {
        if (type === 'anomaly' || type === 'critical') {
            return <AlertTriangle size={16} color="var(--alert-critical)" />;
        }
        return <div className="log-icon-dot"></div>;
    };

    const getLogClass = (type) => {
        if (type === 'anomaly' || type === 'critical') {
            return 'log-item-critical';
        }
        return 'log-item-normal';
    };

    return (
        /* Dropdown Panel - simplified structure */
        <div className="system-logs-panel" onClick={(e) => e.stopPropagation()}>
            <div className="system-logs-header">
                <h3>SYSTEM LOGS</h3>
                {/* Optional: Add clear all or mark read button here later */}
            </div>

            <div className="system-logs-content">
                {logs.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        No new notifications
                    </div>
                ) : (
                    logs.map((log, index) => (
                        <div key={index} className={`log-item ${getLogClass(log.type)}`}>
                            <div className="log-time">
                                [{log.time}]
                            </div>
                            <div className="log-message">{log.message}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SystemLogs;
