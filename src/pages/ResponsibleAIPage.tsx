import React from 'react';
import { 
  ShieldCheck, AlertTriangle, BookOpen, Layers, 
  HeartHandshake, CheckCircle2, Info, Activity, Globe
} from 'lucide-react';
import { ModelEvaluationCharts } from '../components/ModelEvaluationCharts';
import { MALAWIAN_SIGN_LANGUAGE_STATUS, DYNAMIC_LETTERS_NOTE } from '../data/aslAlphabet';

export const ResponsibleAIPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="pb-2 border-b border-[#DCE5F0]">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#35C6D4]/15 text-[#123B70]">
            Ethics & Transparency
          </span>
          <span className="text-xs text-gray-500">NYLP × AI Hackathon 2026</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#123B70] tracking-tight mt-1.5">
          Model Card, Dataset Card & Responsible AI
        </h1>
        <p className="text-xs text-gray-600 mt-1 max-w-2xl leading-relaxed">
          Open documentation on model architecture, training provenance, evaluated test metrics,
          uncertainty handling, and community integrity for sign language communication.
        </p>
      </div>

      {/* Embedded Live Benchmark & Charts */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[#123B70] uppercase tracking-wider">
          1. Verified Neural Model Benchmark
        </h2>
        <ModelEvaluationCharts />
      </div>

      {/* Model Card Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DCE5F0] shadow-xs space-y-5">
        <h2 className="text-base font-bold text-[#123B70] flex items-center space-x-2">
          <Layers className="w-5 h-5 text-[#2878E5]" />
          <span>Model Card: SignLanguageBridge-DeepMLP-v2</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#F2F7FD] border border-[#DCE5F0] space-y-2">
            <span className="font-bold text-[#123B70] block">Intended Purpose</span>
            <p className="text-gray-600 leading-relaxed">
              Provides accessible client-side translation of individual static American Sign Language alphabet gestures
              to assist communication between Deaf/Hard-of-Hearing individuals and hearing dialogue partners.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F2F7FD] border border-[#DCE5F0] space-y-2">
            <span className="font-bold text-[#123B70] block">Scope & Language Support</span>
            <p className="text-gray-600 leading-relaxed">
              Trained specifically on 24 static ASL alphabet classes (A–Y excluding dynamic letters J and Z).
              Does not perform full continuous sign language discourse or facial grammar translation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F2F7FD] border border-[#DCE5F0] space-y-2">
            <span className="font-bold text-[#123B70] block">Known Limitations</span>
            <ul className="text-gray-600 space-y-1">
              <li>• Sensitive to background clutter and extreme backlighting.</li>
              <li>• Similar hand formations (e.g., M vs N, U vs V) may exhibit overlapping logits.</li>
              <li>• Cannot detect dynamic letters J or Z from static single-frame crops.</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-[#F2F7FD] border border-[#DCE5F0] space-y-2">
            <span className="font-bold text-[#123B70] block">Safety & Uncertainty Mitigation</span>
            <p className="text-gray-600 leading-relaxed">
              Outputs normalized Shannon entropy alongside raw softmax probabilities. If confidence falls below 65%
              or entropy exceeds 0.50, an explicit uncertainty warning is displayed to prevent misleading translations.
            </p>
          </div>
        </div>
      </div>

      {/* Dataset Card Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DCE5F0] shadow-xs space-y-5">
        <h2 className="text-base font-bold text-[#123B70] flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-[#35C6D4]" />
          <span>Dataset Card: Sign Language MNIST</span>
        </h2>

        <div className="text-xs text-gray-700 leading-relaxed space-y-3">
          <p>
            <b>Provenance:</b> Sign Language MNIST was constructed by modifying raw pixel data from original hands-in-gesture
            recordings. Each sample consists of a 28×28 grayscale bounding box with pixel intensities scaled from 0 to 255.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
              <span className="text-gray-400 block">Total Samples</span>
              <span className="text-base font-black text-[#123B70]">34,627</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
              <span className="text-gray-400 block">Training Split</span>
              <span className="text-base font-black text-[#2878E5]">27,455</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
              <span className="text-gray-400 block">Held-out Test</span>
              <span className="text-base font-black text-emerald-700">7,172</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
              <span className="text-gray-400 block">Alphabet Classes</span>
              <span className="text-base font-black text-[#35C6D4]">24 Static</span>
            </div>
          </div>

          <p>
            <b>Data Integrity Check:</b> We verified that no overlapping samples leak between the 27,455 training rows
            and the 7,172 official held-out test rows.
          </p>
        </div>
      </div>

      {/* Malawian Sign Language (MSL) Commitment & Roadmap */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#123B70] to-[#1b4b8a] text-white shadow-lg space-y-4">
        <div className="flex items-center space-x-2 text-[#35C6D4]">
          <HeartHandshake className="w-6 h-6" />
          <h2 className="text-lg font-bold">Malawian Sign Language (MSL) Community Commitment</h2>
        </div>

        <div className="text-xs text-white/90 leading-relaxed space-y-3">
          <p>
            In alignment with the competition directive, <b>we explicitly do not relabel American Sign Language (ASL) models as Malawian Sign Language (MSL)</b>.
            Malawian Sign Language is a distinct linguistic system with its own grammar, natural syntax, and localized regional expressions across Malawi.
          </p>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 space-y-2">
            <span className="font-bold text-[#35C6D4] block">MSL Community Integration Protocol:</span>
            <ul className="space-y-1 text-white/80 list-disc list-inside">
              <li>Partnership with local deaf associations (e.g. Malawi National Association of the Deaf - MANAD).</li>
              <li>Free, Prior, and Informed Consent (FPIC) before any gesture video recordings are contributed.</li>
              <li>Documented annotation schema with bilingual Chichewa and English glossing.</li>
              <li>Independent validation by certified Malawian Sign Language interpreters.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
