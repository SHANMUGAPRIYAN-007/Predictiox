import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

const VoiceAssistant = ({ alerts }) => {
    const lastAlertIdRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    // Text to Speech Logic for new Anomaly Alerts ONLY
    useEffect(() => {
        if (alerts.length > 0 && !isPaused) {
            const latest = alerts[0];
            // Only speak if it's a NEW alert, is an ANOMALY, and voice is not paused
            if (latest.isAnomaly && latest.id !== lastAlertIdRef.current) {
                const utterance = new SpeechSynthesisUtterance(`Alert: ${latest.msg}`);
                utterance.rate = 1.1;
                utterance.pitch = 0.9; // Lower pitch for "AI" feel
                window.speechSynthesis.speak(utterance);
                lastAlertIdRef.current = latest.id;
            }
        }
    }, [alerts, isPaused]);

    const togglePause = () => {
        const wasJustPaused = !isPaused;
        setIsPaused(!isPaused);

        if (wasJustPaused) {
            // Pausing - cancel any ongoing speech
            window.speechSynthesis.cancel();
        } else {
            // Resuming - speak the latest anomaly if there is one
            if (alerts.length > 0) {
                const latest = alerts[0];
                if (latest.isAnomaly) {
                    const utterance = new SpeechSynthesisUtterance(`Alert: ${latest.msg}`);
                    utterance.rate = 1.1;
                    utterance.pitch = 0.9;
                    window.speechSynthesis.speak(utterance);
                    lastAlertIdRef.current = latest.id;
                }
            }
        }
    };

    return (
        <div style={{
            position: 'fixed', bottom: '20px', right: '20px', zIndex: 100,
            display: 'flex', flexDirection: 'column', alignItems: 'end'
        }}>
            {/* Mic Icon with Pause/Resume */}
            <div
                className="glass-panel"
                onClick={togglePause}
                style={{
                    width: '50px', height: '50px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: isPaused ? '0 0 15px rgba(255, 42, 42, 0.3)' : '0 0 15px rgba(0, 243, 255, 0.2)',
                    background: isPaused ? 'rgba(255, 42, 42, 0.1)' : 'var(--glass-bg)'
                }}
            >
                {isPaused ? (
                    <VolumeX size={24} color="var(--alert-critical)" />
                ) : (
                    <Volume2 size={24} color="var(--primary-neon)" />
                )}
            </div>
        </div>
    );
};

export default VoiceAssistant;
