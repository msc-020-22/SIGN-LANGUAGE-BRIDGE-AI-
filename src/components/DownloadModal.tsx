import React, { useState } from 'react';
import { 
  Download, X, Check, Copy, AlertCircle, 
  FileCode, Database, Sparkles, RefreshCw, Terminal, ExternalLink
} from 'lucide-react';
import { downloadPackage } from '../utils/downloadHelper';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const currentOrigin = window.location.origin;
  const curlCmd = `curl -O "${currentOrigin}/SLB-AI-code-and-models.zip"`;

  const handleDownload = async (url: string, filename: string) => {
    setDownloadingFile(filename);
    setStatusMessage('Connecting to server...');

    await downloadPackage(url, filename, (status, msg) => {
      if (msg) setStatusMessage(msg);
      if (status === 'success' || status === 'error') {
        setTimeout(() => {
          setDownloadingFile(null);
          setStatusMessage('');
        }, 4000);
      }
    });
  };

  const handleCopyCurl = async () => {
    await navigator.clipboard.writeText(curlCmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#DCE5F0] shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-[#F2F7FD] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3.5 border-b border-[#DCE5F0] pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#123B70] via-[#2878E5] to-[#35C6D4] text-white flex items-center justify-center shadow-md">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#123B70] tracking-tight">Download Project Package</h2>
            <p className="text-xs text-gray-500">NYLP × AI Hackathon 2026 Submission Archive</p>
          </div>
        </div>

        {/* Status Toast Banner if downloading */}
        {downloadingFile && (
          <div className="p-3.5 rounded-2xl bg-[#F2F7FD] border border-[#2878E5] text-xs text-[#123B70] flex items-center space-x-2.5 animate-in slide-in-from-top-2">
            <RefreshCw className="w-4 h-4 text-[#2878E5] animate-spin shrink-0" />
            <span className="font-semibold">{statusMessage || 'Preparing download...'}</span>
          </div>
        )}

        {/* Option 1: Recommended Code + Models Package */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-white to-[#F2F7FD] border-2 border-[#2878E5] shadow-xs space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#2878E5] text-white">
                  RECOMMENDED
                </span>
                <span className="text-xs font-bold text-[#123B70]">Instant Download</span>
              </div>
              <h3 className="text-base font-bold text-[#123B70]">Code, Models & Documentation ZIP</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Includes all 14 React interfaces, trained TensorFlow.js neural weights, test suites, Supabase SQL schema, and complete documentation.
              </p>
              <div className="text-[11px] text-gray-500 font-mono">
                File: <b>SLB-AI-code-and-models.zip</b> • Size: <b>9.19 MB</b>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleDownload('/SLB-AI-code-and-models.zip', 'SLB-AI-code-and-models.zip')}
              disabled={downloadingFile !== null}
              className="px-5 py-2.5 rounded-xl bg-[#123B70] hover:bg-[#2878E5] text-white text-xs font-bold shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{downloadingFile === 'SLB-AI-code-and-models.zip' ? 'Starting...' : 'Download ZIP (9.2 MB)'}</span>
            </button>

            <a
              href="/SLB-AI-code-and-models.zip"
              target="_blank"
              rel="noopener noreferrer"
              download="SLB-AI-code-and-models.zip"
              className="px-4 py-2.5 rounded-xl border border-[#DCE5F0] hover:bg-white text-[#172B45] text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <span>Direct Link</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </a>
          </div>
        </div>

        {/* Option 2: Full Package with Raw CSVs */}
        <div className="p-5 rounded-2xl bg-white border border-[#DCE5F0] shadow-xs space-y-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 uppercase">
                COMPLETE WITH DATASETS
              </span>
              <span className="text-xs text-gray-400">Large File</span>
            </div>
            <h3 className="text-sm font-bold text-[#123B70]">Full Package with Raw CSV Datasets</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Includes everything above plus the full raw 105MB Sign Language MNIST CSV datasets (`sign_mnist_train.csv` and `sign_mnist_test.csv`).
            </p>
            <div className="text-[11px] text-gray-400 font-mono">
              File: <b>SLB-AI-submission.zip</b> • Size: <b>38.60 MB</b>
            </div>
          </div>

          <div className="pt-1 flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleDownload('/SLB-AI-submission.zip', 'SLB-AI-submission.zip')}
              disabled={downloadingFile !== null}
              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-black text-white text-xs font-bold transition-all flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadingFile === 'SLB-AI-submission.zip' ? 'Starting...' : 'Download Full (38.6 MB)'}</span>
            </button>

            <a
              href="/SLB-AI-submission.zip"
              target="_blank"
              rel="noopener noreferrer"
              download="SLB-AI-submission.zip"
              className="px-3 py-2 rounded-xl border border-[#DCE5F0] hover:bg-gray-50 text-gray-700 text-xs font-medium flex items-center space-x-1 transition-colors"
            >
              <span>Direct Link</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>
          </div>
        </div>

        {/* Terminal / cURL Alternative */}
        <div className="p-4 rounded-2xl bg-gray-900 text-white space-y-2 text-xs">
          <div className="flex items-center justify-between text-gray-400">
            <span className="flex items-center space-x-1.5 font-bold">
              <Terminal className="w-3.5 h-3.5 text-[#35C6D4]" />
              <span>Terminal Download (cURL)</span>
            </span>
            <button
              onClick={handleCopyCurl}
              className="text-[11px] text-[#35C6D4] hover:text-white flex items-center space-x-1 font-semibold"
            >
              {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCmd ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <p className="font-mono bg-black/60 p-2.5 rounded-lg text-emerald-400 break-all select-all text-[11px]">
            {curlCmd}
          </p>
        </div>
      </div>
    </div>
  );
};
