import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanEye, Upload, User, MapPin, Calendar, FileText, AlertCircle, CheckCircle2, Ban, HelpCircle } from 'lucide-react';
import { Layout } from './Layout';
import { PageHeader } from './PageHeader';
import { addLog } from '../utils/mockStorage';
import { ApiHealthResponse, ApiRootResponse, irisApi, PredictResponse } from '../utils/irisApi';

export function TravelerVerification() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [scanDuration, setScanDuration] = useState<string>('0.0s');
  const [scanError, setScanError] = useState<string | null>(null);
  const [apiRoot, setApiRoot] = useState<ApiRootResponse | null>(null);
  const [apiHealth, setApiHealth] = useState<ApiHealthResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const confidencePercent = result ? Math.min(100, Math.max(0, result.confidence * 100)) : 0;
  const backendStatus = apiError
    ? { label: 'Backend: Unavailable', tone: 'text-red-600 dark:text-red-400', sub: 'Health check failed' }
    : apiHealth
      ? apiHealth.status === 'ok'
        ? { label: 'Backend: Online', tone: 'text-emerald-700 dark:text-emerald-400', sub: 'Health check OK' }
        : { label: `Backend: ${apiHealth.status}`, tone: 'text-amber-600 dark:text-amber-400', sub: 'Health check not OK' }
      : apiRoot
        ? { label: 'Backend: Online', tone: 'text-emerald-700 dark:text-emerald-400', sub: 'Root reachable' }
        : { label: 'Checking backend...', tone: 'text-slate-600 dark:text-slate-400', sub: 'Waiting for response' };

  useEffect(() => {
    const loadApiStatus = async () => {
      setApiError(null);

      const [rootResult, healthResult] = await Promise.allSettled([
        irisApi.getRoot(),
        irisApi.getHealth(),
      ]);

      if (rootResult.status === 'fulfilled') {
        setApiRoot(rootResult.value);
      }

      if (healthResult.status === 'fulfilled') {
        setApiHealth(healthResult.value);
      }

      if (rootResult.status === 'rejected' || healthResult.status === 'rejected') {
        setApiError('Unable to reach backend endpoints. Please check API availability.');
      }
    };

    void loadApiStatus();
  }, []);

  const verificationTheme = useMemo(() => {
    if (!result) {
      return null;
    }

    if (result.status === 'Allowed') {
      return {
        panel: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700/40',
        text: 'text-green-900',
        badge: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700/40',
        summary: 'Traveler is allowed to continue travel procedures.',
        icon: <CheckCircle2 className="w-4 h-4" />,
      };
    }

    if (result.status === 'Banned') {
      return {
        panel: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700/40',
        text: 'text-red-900',
        badge: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700/40',
        summary: 'Traveler is banned. Security intervention is required.',
        icon: <Ban className="w-4 h-4" />,
      };
    }

    return {
      panel: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700/40',
      text: 'text-yellow-900',
      badge: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-700/40',
      summary: 'Traveler identity predicted but not found in CSV records.',
      icon: <HelpCircle className="w-4 h-4" />,
    };
  }, [result]);

  const processSelectedFile = (selectedFile: File) => {
    const isImage = selectedFile.type.startsWith('image/');
    if (!isImage) {
      setScanError('Please upload a valid image file (JPEG or PNG).');
      return;
    }

    setScanError(null);
    setResult(null);
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processSelectedFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processSelectedFile(droppedFile);
    }
  };

  const handleScan = async () => {
    if (!file) return;

    setScanning(true);
    setResult(null);
    setScanError(null);

    const startedAt = performance.now();

    try {
      const prediction = await irisApi.predict(file);
      const durationMs = performance.now() - startedAt;
      const duration = `${(durationMs / 1000).toFixed(2)}s`;

      setResult(prediction);
      setScanDuration(duration);

      addLog({
        travelerName: `Person ${prediction.person_id}`,
        passportNumber: prediction.predicted_label,
        nationality: 'N/A',
        status: prediction.status,
        timestamp: new Date().toISOString(),
        duration,
        operator: 'Admin',
        terminal: 'Terminal 1',
        confidence: prediction.confidence * 100,
        personId: prediction.person_id,
        predictedLabel: prediction.predicted_label,
        message: prediction.message,
        isBanned: prediction.is_banned,
      });

    } catch (error) {
      setScanError(error instanceof Error ? error.message : 'Scanning failed. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
    setScanError(null);
    setScanning(false);
    setFile(null);
  };

  return (
    <Layout>
      <div className="py-8 px-4 bg-linear-to-br from-slate-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-[calc(100vh-(--spacing(16))-(--spacing(64)))]">
        <div className="max-w-7xl mx-auto">
          <PageHeader
            title="Traveler Verification"
            subtitle="Scan iris to verify traveler identity"
            icon={<ScanEye className="w-7 h-7 text-white" />}
            iconContainerClassName="bg-linear-to-br from-blue-600 to-blue-500"
          />

          <div className="mb-6">
            <div className="bg-white/90 dark:bg-slate-900/90 rounded-xl border border-gray-200 dark:border-slate-700 p-4 shadow-sm">
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Backend Status</p>
                <p className={`text-sm font-semibold ${backendStatus.tone}`}>{backendStatus.label}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">{backendStatus.sub}</p>
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 p-3">
                  <p className="text-[11px] text-gray-500 dark:text-slate-400 mb-1">Health</p>
                  <p className="text-gray-800 dark:text-slate-200">
                    {apiHealth?.status ?? (apiError ? 'unreachable' : 'unknown')}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 p-3">
                  <p className="text-[11px] text-gray-500 dark:text-slate-400 mb-1">Model</p>
                  <p className="text-gray-800 dark:text-slate-200">
                    {apiHealth ? (apiHealth.model_loaded ? 'loaded' : 'not loaded') : 'unknown'}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 p-3">
                  <p className="text-[11px] text-gray-500 dark:text-slate-400 mb-1">CSV</p>
                  <p className="text-gray-800 dark:text-slate-200">
                    {apiHealth ? (apiHealth.csv_loaded ? 'loaded' : 'not loaded') : 'unknown'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Scan Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-slate-700">
              <h2 className="text-xl text-gray-900 dark:text-slate-100 mb-6">Iris Scan Upload</h2>

              {!selectedImage ? (
                <div className="space-y-4">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition ${isDragging
                      ? 'border-blue-500 bg-blue-50 dark:bg-slate-800'
                      : 'border-gray-300 dark:border-slate-600 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-slate-800'
                      }`}
                  >
                    <input
                      type="file"
                      id="iris-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="iris-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                        <Upload className="w-10 h-10 text-blue-600" />
                      </div>
                      <p className="text-lg text-gray-900 dark:text-slate-100 mb-2">Upload Iris Scan</p>
                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        {isDragging ? 'Drop the image here' : 'Click to browse or drag and drop'}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">Supported: JPG, PNG</p>
                    </label>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-700/40 rounded-xl p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-300 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200 mb-1">Scanning Instructions</p>
                        <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                          <li>• Ensure good lighting conditions</li>
                          <li>• Position the eye centered in frame</li>
                          <li>• Remove glasses or contact lenses</li>
                          <li>• Keep the eye open and steady</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative aspect-square bg-gray-100 dark:bg-slate-800 rounded-2xl overflow-hidden">
                    <img
                      src={selectedImage}
                      alt="Iris scan"
                      className="w-full h-full object-cover"
                    />
                    {scanning && (
                      <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center backdrop-blur-sm">
                        <div className="text-center">
                          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-white text-lg animate-pulse">Scanning...</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {!scanning && !result && (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleScan}
                        className="flex-1 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-4 rounded-xl transition shadow-lg hover:scale-[1.01]"
                      >
                        Start Verification
                      </button>
                      <button
                        onClick={handleReset}
                        className="px-6 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 py-4 rounded-xl transition"
                      >
                        Reset
                      </button>
                    </div>
                  )}

                  {result && (
                    <button
                      onClick={handleReset}
                      className="w-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 py-4 rounded-xl transition"
                    >
                      New Scan
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-slate-700">
              <h2 className="text-xl text-gray-900 dark:text-slate-100 mb-6">Verification Results</h2>

              {!result && !scanError ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                    <ScanEye className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-slate-400">Waiting for scan...</p>
                  <p className="text-sm text-gray-400 dark:text-slate-500 mt-2">Upload an iris scan to begin verification</p>
                </div>
              ) : scanError ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-800">{scanError}</p>
                </div>
              ) : result && verificationTheme ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                      <User className="w-5 h-5 text-gray-600 dark:text-slate-300 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Person ID</p>
                        <p className="text-sm text-gray-900 dark:text-slate-100">{result.person_id}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                      <FileText className="w-5 h-5 text-gray-600 dark:text-slate-300 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Predicted Label</p>
                        <p className="text-sm text-gray-900 dark:text-slate-100">{result.predicted_label}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                      <MapPin className="w-5 h-5 text-gray-600 dark:text-slate-300 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Confidence</p>
                        <p className="text-sm text-gray-900 dark:text-slate-100">{confidencePercent.toFixed(2)}%</p>
                        <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${confidencePercent.toFixed(2)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                      <Calendar className="w-5 h-5 text-gray-600 dark:text-slate-300 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Scan Duration</p>
                        <p className="text-sm text-gray-900 dark:text-slate-100">{scanDuration}</p>
                      </div>
                    </div>

                    <div className={`p-4 border rounded-xl ${verificationTheme.panel}`}>
                      <p className="text-xs mb-1 dark:text-slate-300">Travel Status</p>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs border ${verificationTheme.badge}`}>
                        {verificationTheme.icon}
                        {result.status}
                      </span>
                      <p className={`text-sm mt-3 ${verificationTheme.text} dark:text-slate-200`}>{verificationTheme.summary}</p>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-700/40 rounded-xl">
                      <p className="text-xs text-blue-700 mb-2">Backend Message</p>
                      <p className="text-sm text-blue-900 dark:text-blue-200">{result.message}</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-4">
            <button
              onClick={() => navigate('/admin/logs')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 rounded-xl transition shadow-sm"
            >
              <FileText className="w-5 h-5" />
              <span>View Logs</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}