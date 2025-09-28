import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * CameraMonitor
 * - Auto-starts camera and recording on mount
 * - Auto-stops and uploads on user stop, component unmount, or page leave
 * - Saves to server via Next API: /api/monitor/upload
 */
export default function CameraMonitor() {
  // Debug check for browser environment
  console.log('[CameraMonitor] INIT - Browser check:', {
    hasWindow: typeof window !== 'undefined',
    hasNavigator: typeof navigator !== 'undefined',
    hasMediaDevices: typeof navigator !== 'undefined' && !!navigator.mediaDevices,
    hasGetUserMedia: typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia,
    hasMediaRecorder: typeof window !== 'undefined' && !!window.MediaRecorder,
  });
  
  // Try to reuse existing camera stream if possible (from Face Gesture component)
  const tryGetExistingStream = () => {
    try {
      // Look for video elements that might have a stream
      const videos = document.querySelectorAll('video');
      for (const video of videos) {
        if (video.srcObject && video.srcObject.active && 
            video.srcObject.getVideoTracks().some(t => t.enabled && t.readyState === 'live')) {
          console.log('[CameraMonitor] Found existing camera stream to reuse');
          return video.srcObject.clone();
        }
      }
    } catch (e) {
      console.log('[CameraMonitor] Error finding existing stream:', e);
    }
    return null;
  };
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const stoppingRef = useRef(false);

  const [status, setStatus] = useState('idle'); // idle | recording | stopping | uploading | done | error
  const [message, setMessage] = useState('');

  const pickMimeType = () => {
    console.log('[CameraMonitor] Selecting mime type for MediaRecorder');
    const candidates = [
      'video/mp4',
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
    ];
    for (const t of candidates) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) {
        console.log('[CameraMonitor] Using mime type:', t);
        return t;
      }
    }
    console.warn('[CameraMonitor] No preferred mime type supported, letting browser choose default');
    return '';
  };

  const stopAllTracks = (stream) => {
    if (!stream) return;
    stream.getTracks().forEach((t) => {
      try { t.stop(); } catch (_) {}
    });
  };

  const uploadBlob = async (blob) => {
    try {
      console.log('[CameraMonitor] Preparing upload. Blob size:', blob.size, 'type:', blob.type);
      setStatus('uploading');
      setMessage('Uploading recording...');
      const form = new FormData();
      const ext = blob.type.includes('mp4') ? 'mp4' : (blob.type.includes('webm') ? 'webm' : 'mp4');
      const file = new File([blob], `recording.${ext}`, { type: blob.type || 'video/mp4' });
      form.append('file', file);
      console.log('[CameraMonitor] Sending POST /api/monitor/upload ...');
      const res = await fetch('/api/monitor/upload', { method: 'POST', body: form });
      console.log('[CameraMonitor] Upload response status:', res.status);
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      const data = await res.json();
      console.log('[CameraMonitor] Upload success. Response:', data);
      setStatus('done');
      setMessage(`Saved: ${data.url || data.path || data.filename || 'OK'}`);
    } catch (e) {
      console.error(e);
      setStatus('error');
      setMessage('Upload failed.');
    }
  };

  const finalizeRecording = useCallback(async () => {
    console.log('[CameraMonitor] finalizeRecording called. stoppingRef=', stoppingRef.current, 'state=', mediaRecorderRef.current?.state);
    if (stoppingRef.current) return;
    stoppingRef.current = true;
    
    // Set flag to disable camera auto-start on next page load
    if (typeof window !== 'undefined') {
      localStorage.setItem('facegesture_camera_disabled', 'true');
      console.log('[CameraMonitor] Set camera disabled flag in localStorage');
    }
    
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        console.log('[CameraMonitor] Stopping MediaRecorder...');
        mediaRecorderRef.current.stop();
      }
    } catch (_) {}
  }, []);

  const handleDataAvailable = useCallback((ev) => {
    console.log('[CameraMonitor] ondataavailable size=', ev?.data?.size);
    if (ev.data && ev.data.size > 0) {
      chunksRef.current.push(ev.data);
    }
  }, []);

  const handleStop = useCallback(async () => {
    console.log('[CameraMonitor] MediaRecorder onstop fired. Chunks:', chunksRef.current.length);
    try {
      const blob = new Blob(chunksRef.current, { type: chunksRef.current[0]?.type || 'video/mp4' });
      console.log('[CameraMonitor] Built blob. size=', blob.size, 'type=', blob.type);
      chunksRef.current = [];
      // Stop preview stream
      stopAllTracks(streamRef.current);
      console.log('[CameraMonitor] Tracks stopped. Uploading blob...');
      await uploadBlob(blob);
    } finally {
      mediaRecorderRef.current = null;
      streamRef.current = null;
    }
  }, []);

  const start = useCallback(async () => {
    try {
      console.log('[CameraMonitor] start() called. Checking for existing stream or requesting getUserMedia...');
      setStatus('recording');
      setMessage('Recording...');
      
      // First try to reuse existing stream (from Face Gesture component)
      let stream = tryGetExistingStream();
      
      // If no existing stream, request a new one
      if (!stream) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        } catch (audioErr) {
          console.warn('[CameraMonitor] Failed with audio, trying video only:', audioErr);
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        }
      }
      
      console.log('[CameraMonitor] Stream acquired. Tracks:', stream.getTracks().map(t=>t.kind));
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        await videoRef.current.play().catch((e) => { console.warn('[CameraMonitor] video.play() warning', e); });
      }

      const mimeType = pickMimeType();
      console.log('[CameraMonitor] Creating MediaRecorder with mimeType=', mimeType || '(default)');
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      stoppingRef.current = false;

      mr.ondataavailable = handleDataAvailable;
      mr.onstop = handleStop;
      mr.onerror = (e) => {
        console.error('MediaRecorder error', e);
        setStatus('error');
        setMessage('Recorder error.');
      };

      console.log('[CameraMonitor] Starting MediaRecorder...');
      // Force ondataavailable to fire frequently
      mr.start(500); // Get data every 500ms
      
      // Safety: ensure we get at least one chunk
      setTimeout(() => {
        if (mr.state === 'recording' && chunksRef.current.length === 0) {
          console.log('[CameraMonitor] Requesting data chunk manually');
          mr.requestData();
        }
      }, 1000);
    } catch (e) {
      console.error('Failed to start camera/recorder', e);
      setStatus('error');
      setMessage('Failed to start camera/recorder');
    }
  }, [handleDataAvailable, handleStop]);

  const stop = useCallback(() => {
    console.log('[CameraMonitor] Stop button clicked');
    setStatus('stopping');
    setMessage('Stopping...');
    finalizeRecording();
  }, [finalizeRecording]);

  useEffect(() => {
    // Auto-start on mount
    console.log('[CameraMonitor] mount: auto-start');
    start();

    const beforeUnload = () => { console.log('[CameraMonitor] beforeunload'); finalizeRecording(); };
    const pageHide = () => { console.log('[CameraMonitor] pagehide'); finalizeRecording(); };
    const faceGestureStopped = () => { console.log('[CameraMonitor] facegesture:stopped event'); finalizeRecording(); };

    window.addEventListener('beforeunload', beforeUnload);
    window.addEventListener('pagehide', pageHide);
    window.addEventListener('facegesture:stopped', faceGestureStopped);

    return () => {
      console.log('[CameraMonitor] unmount: finalize');
      window.removeEventListener('beforeunload', beforeUnload);
      window.removeEventListener('pagehide', pageHide);
      window.removeEventListener('facegesture:stopped', faceGestureStopped);
      finalizeRecording();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add auto-stop after 30 seconds as safety
  useEffect(() => {
    if (status === 'recording') {
      const timer = setTimeout(() => {
        console.log('[CameraMonitor] Auto-stopping after 30 seconds');
        stop();
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [status, stop]);
  
  // Hidden UI - just a video element for the stream
  return (
    <div style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}>
      <video ref={videoRef} autoPlay playsInline muted />
    </div>
  );
}
