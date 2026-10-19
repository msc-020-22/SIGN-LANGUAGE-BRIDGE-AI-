import React from 'react';
import { 
  HelpCircle, Sun, Camera, HandMetal, AlertTriangle, 
  CheckCircle2, ShieldCheck, MessageSquare, ChevronDown
} from 'lucide-react';

export const HelpPage: React.FC = () => {
  const faqs = [
    {
      q: 'Which sign language is currently supported by the recognition model?',
      a: 'The current trained model recognizes the 24 static alphabet letters of American Sign Language (ASL) based on the Sign Language MNIST benchmark. Letters J and Z require motion and are not part of single-frame static models. Malawian Sign Language (MSL) support is in active development with a community data collection framework.',
    },
    {
      q: 'Why does the model sometimes mark a prediction as uncertain?',
      a: 'The model calculates normalized Shannon entropy and compares output probabilities against your configured confidence threshold. If lighting is uneven, the hand is partially outside the detection bracket, or the gesture resembles multiple letters (like M and N, or U and V), the system flags the prediction as uncertain to ensure you are not given false confidence.',
    },
    {
      q: 'How should I position my hand for the best recognition accuracy?',
      a: 'Position your signing hand squarely inside the dashed guide bracket on the webcam feed. Keep fingers spread clearly where required (e.g. W vs B), avoid extreme angles, and maintain uniform front-facing lighting.',
    },
    {
      q: 'Is my webcam video sent to an external cloud server?',
      a: 'No. Model inference runs client-side directly in your browser using TensorFlow.js. Your webcam frames are processed locally in temporary memory and never stored or uploaded.',
    },
    {
      q: 'How can I fix camera permission issues?',
      a: 'Click the camera/lock icon in your browser address bar and select "Allow" for camera access. If you have multiple webcams connected, you can select standard or high-definition capture in Settings.',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#DCE5F0]">
        <div>
          <h1 className="text-2xl font-black text-[#123B70] tracking-tight">Help & Recognition Guide</h1>
          <p className="text-xs text-gray-500">
            Practical tips for optimal hand detection, camera lighting, and gesture clarity.
          </p>
        </div>
      </div>

      {/* 3 Visual Practice Rules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-[#DCE5F0] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Sun className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#123B70]">1. Front-Facing Lighting</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Ensure soft, balanced light shines on your hand. Avoid bright backlights or windows directly behind you which turn the hand into a dark silhouette.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#DCE5F0] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#2878E5]/10 text-[#2878E5] flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#123B70]">2. Center in Guide Bracket</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Keep your hand inside the dashed bounding box on screen. The neural model crops this region directly for 28×28 grayscale classification.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#DCE5F0] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <HandMetal className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#123B70]">3. Steady Sign Hold</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Hold the hand shape steady for approximately 0.5–1 second. The temporal smoothing filter votes across consecutive frames to verify stability.
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DCE5F0] shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#123B70] flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-[#2878E5]" />
          <span>Frequently Asked Questions</span>
        </h3>

        <div className="divide-y divide-gray-100">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-4 space-y-1.5">
              <h4 className="text-xs font-bold text-[#172B45]">{faq.q}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
