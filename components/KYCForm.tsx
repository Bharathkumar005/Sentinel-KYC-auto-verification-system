import React, { useState, useRef, useCallback } from 'react';
import { Upload, Camera, Check, AlertCircle, X } from 'lucide-react';
import { KYCSubmission, KYCStatus } from '../types';

interface KYCFormProps {
  onSubmit: (data: Partial<KYCSubmission>, docFile: File, selfieBase64: string) => void;
}

const KYCForm: React.FC<KYCFormProps> = ({ onSubmit }) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({ fullName: '', email: '', docType: 'aadhaar' });
  const [docFile, setDocFile] = useState<File | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocFile(e.target.files[0]);
    }
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Unable to access camera. Please allow permissions.");
      setIsCameraOpen(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 640, 480);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setSelfieImage(dataUrl);
        
        // Stop stream
        const stream = videoRef.current.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        setIsCameraOpen(false);
      }
    }
  };

  const handleSubmit = () => {
    if (docFile && selfieImage) {
      onSubmit(formData, docFile, selfieImage);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Identity Verification</h2>
          <div className="text-sm text-slate-500">Step {step} of 3</div>
        </div>
        <div className="w-full bg-slate-200 h-1.5 mt-4 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-300 ease-in-out" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-8">
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-medium text-slate-900 mb-4">Personal Details</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="john@example.com"
              />
            </div>
            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!formData.fullName || !formData.email}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-medium text-slate-900 mb-4">Upload Document</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Document Type</label>
              <select
                name="docType"
                value={formData.docType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="aadhaar">Aadhaar Card</option>
                <option value="pan">PAN Card</option>
                <option value="passport">Passport</option>
                <option value="license">Driving License</option>
              </select>
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors relative">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
                {docFile ? (
                  <>
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                      <Check className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-slate-900">{docFile.name}</span>
                    <span className="text-xs text-slate-500">{(docFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-slate-900">Click to upload or drag and drop</span>
                    <span className="text-xs text-slate-500">JPG, PNG or PDF (Max 5MB)</span>
                  </>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2 text-slate-600 hover:text-slate-900"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!docFile}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-medium text-slate-900 mb-4">Liveness Check</h3>
            <p className="text-slate-600 text-sm mb-4">
              We need to take a quick selfie to match with your document photo. Please ensure good lighting.
            </p>

            <div className="flex flex-col items-center">
              {selfieImage ? (
                <div className="relative">
                  <img src={selfieImage} alt="Selfie" className="w-64 h-48 object-cover rounded-lg shadow-md border border-slate-200" />
                  <button 
                    onClick={() => setSelfieImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : isCameraOpen ? (
                <div className="relative w-full max-w-md bg-black rounded-lg overflow-hidden aspect-video">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <canvas ref={canvasRef} width="640" height="480" className="hidden" />
                  <button 
                    onClick={capturePhoto}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-blue-600 rounded-full p-4 shadow-lg hover:scale-105 transition"
                  >
                    <Camera className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={startCamera}
                  className="w-full max-w-md aspect-video bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center hover:bg-slate-50 transition"
                >
                  <Camera className="w-10 h-10 text-slate-400 mb-2" />
                  <span className="text-slate-600 font-medium">Open Camera</span>
                </button>
              )}
            </div>

            <div className="pt-8 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2 text-slate-600 hover:text-slate-900"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selfieImage}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center"
              >
                Submit for Verification
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KYCForm;