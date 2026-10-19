import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Mic, MicOff, Volume2, Send, Trash2, 
  Download, Sparkles, MessageSquare, HandMetal, 
  HelpCircle, CheckCircle2, RotateCcw
} from 'lucide-react';
import { speechService } from '../services/speechService';
import { storageService } from '../services/storageService';
import { ASL_ALPHABET_DATA } from '../data/aslAlphabet';

interface Message {
  id: string;
  sender: 'deaf_communicator' | 'hearing_partner';
  text: string;
  timestamp: string;
}

export const ConversationPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'deaf_communicator',
      text: 'HELLO, NICE TO MEET YOU',
      timestamp: '10:00 AM',
    },
    {
      id: 'm-2',
      sender: 'hearing_partner',
      text: 'Hello! Great to meet you too. How can I help today?',
      timestamp: '10:01 AM',
    },
  ]);

  const [deafInput, setDeafInput] = useState<string>('');
  const [hearingInput, setHearingInput] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [showFingerspelling, setShowFingerspelling] = useState<boolean>(true);
  const [quickPhrases, setQuickPhrases] = useState<string[]>([]);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const saved = storageService.getSavedPhrases().map((p) => p.phrase);
    setQuickPhrases(saved.slice(0, 6));
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendDeafMessage = (textToSend?: string) => {
    const final = (textToSend || deafInput).trim();
    if (!final) return;

    const newMsg: Message = {
      id: `m_${Date.now()}`,
      sender: 'deaf_communicator',
      text: final,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setDeafInput('');

    // Optional auto-speak for hearing partner
    const settings = storageService.getSettings();
    if (settings.autoSpeak) {
      speechService.speak(final);
    }
  };

  const sendHearingMessage = () => {
    if (!hearingInput.trim()) return;

    const newMsg: Message = {
      id: `m_${Date.now()}`,
      sender: 'hearing_partner',
      text: hearingInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setHearingInput('');
  };

  const toggleMicListening = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      const started = speechService.startListening(
        (transcript, isFinal) => {
          setHearingInput(transcript);
          if (isFinal) {
            setIsListening(false);
          }
        },
        (error) => {
          alert('Speech recognition: ' + error);
          setIsListening(false);
        }
      );
      if (started) setIsListening(true);
    }
  };

  const exportConversation = () => {
    const text = messages
      .map((m) => `[${m.timestamp}] ${m.sender === 'deaf_communicator' ? 'Deaf Communicator' : 'Hearing Partner'}: ${m.text}`)
      .join('\n\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `slb_ai_dialogue_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#DCE5F0]">
        <div>
          <h1 className="text-2xl font-black text-[#123B70] tracking-tight">Dual Conversation Mode</h1>
          <p className="text-xs text-gray-500">
            Real-time two-way communication between Deaf signers and hearing dialogue partners.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFingerspelling(!showFingerspelling)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              showFingerspelling
                ? 'bg-[#35C6D4]/15 border-[#35C6D4] text-[#123B70]'
                : 'bg-white border-[#DCE5F0] text-gray-500'
            }`}
          >
            Fingerspelling Visuals: {showFingerspelling ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={exportConversation}
            className="p-1.5 rounded-lg border border-[#DCE5F0] text-gray-600 hover:bg-[#F2F7FD]"
            title="Export dialogue transcript"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMessages([])}
            className="p-1.5 rounded-lg border border-[#DCE5F0] text-red-500 hover:bg-red-50"
            title="Clear conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Two-Way Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chat Stream (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#DCE5F0] shadow-xs flex flex-col h-[560px] overflow-hidden">
          {/* Messages Feed */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#F2F7FD]/30">
            {messages.length === 0 ? (
              <div className="text-center py-20 text-gray-400 space-y-2">
                <Users className="w-10 h-10 mx-auto text-gray-300" />
                <p className="text-sm font-semibold text-gray-500">Dialogue is ready.</p>
                <p className="text-xs">Start signing on the right or speak into the microphone.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isDeaf = msg.sender === 'deaf_communicator';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isDeaf ? 'items-start' : 'items-end'}`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 px-1">
                      {isDeaf ? 'Deaf Communicator (Signer)' : 'Hearing Partner (Speaker)'} • {msg.timestamp}
                    </span>

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 shadow-xs relative ${
                        isDeaf
                          ? 'bg-[#123B70] text-white rounded-tl-xs'
                          : 'bg-white border border-[#DCE5F0] text-[#172B45] rounded-tr-xs'
                      }`}
                    >
                      <p className="text-base font-medium leading-relaxed">{msg.text}</p>

                      {/* Optional letter tiles visualization */}
                      {showFingerspelling && (
                        <div className="mt-2.5 pt-2 border-t border-white/15 flex flex-wrap gap-1">
                          {msg.text
                            .toUpperCase()
                            .split('')
                            .filter((char) => char >= 'A' && char <= 'Z')
                            .slice(0, 16)
                            .map((char, cIdx) => (
                              <span
                                key={cIdx}
                                className={`w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-black ${
                                  isDeaf
                                    ? 'bg-white/20 text-white'
                                    : 'bg-[#123B70]/10 text-[#123B70]'
                                }`}
                              >
                                {char}
                              </span>
                            ))}
                        </div>
                      )}

                      {/* Text-to-speech for Deaf messages */}
                      {isDeaf && (
                        <button
                          onClick={() => speechService.speak(msg.text)}
                          className="mt-2 text-xs font-semibold text-[#35C6D4] hover:text-white flex items-center space-x-1"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Speak aloud</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Phrases Bar */}
          <div className="p-3 bg-white border-t border-[#DCE5F0] overflow-x-auto flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 shrink-0">
              Quick:
            </span>
            {quickPhrases.map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => sendDeafMessage(phrase)}
                className="px-2.5 py-1 rounded-lg bg-[#F2F7FD] hover:bg-[#2878E5] hover:text-white border border-[#DCE5F0] text-xs font-medium text-[#172B45] shrink-0 transition-colors"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>

        {/* Input Panels (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Deaf Communicator Input Section */}
          <div className="p-5 rounded-3xl bg-white border border-[#DCE5F0] shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-[#123B70]">
              <div className="w-7 h-7 rounded-lg bg-[#123B70]/10 flex items-center justify-center text-[#123B70]">
                <HandMetal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Deaf Communicator Turn</h3>
                <p className="text-[11px] text-gray-500">Sign alphabet or compose message</p>
              </div>
            </div>

            <textarea
              value={deafInput}
              onChange={(e) => setDeafInput(e.target.value)}
              placeholder="Type message or click alphabet buttons below..."
              rows={3}
              className="w-full p-3 rounded-xl border border-[#DCE5F0] focus:ring-2 focus:ring-[#2878E5] focus:outline-hidden text-sm font-medium resize-none"
            />

            {/* Quick ASL virtual alphabet keyboard */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Tap Sign Alphabet:
              </span>
              <div className="grid grid-cols-8 gap-1">
                {ASL_ALPHABET_DATA.map((sign) => (
                  <button
                    key={sign.letter}
                    onClick={() => setDeafInput((prev) => prev + sign.letter)}
                    className="h-8 rounded-lg bg-[#F2F7FD] hover:bg-[#123B70] hover:text-white border border-[#DCE5F0] text-xs font-black text-[#123B70] transition-colors"
                  >
                    {sign.letter}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="space-x-1">
                <button
                  onClick={() => setDeafInput((prev) => prev + ' ')}
                  className="px-2.5 py-1.5 text-xs font-semibold bg-gray-100 rounded-lg text-gray-700"
                >
                  Space
                </button>
                <button
                  onClick={() => setDeafInput((prev) => prev.slice(0, -1))}
                  className="px-2.5 py-1.5 text-xs font-semibold bg-gray-100 rounded-lg text-gray-700"
                >
                  ⌫
                </button>
              </div>
              <button
                onClick={() => sendDeafMessage()}
                disabled={!deafInput.trim()}
                className="px-4 py-2 rounded-xl bg-[#123B70] hover:bg-[#2878E5] disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs"
              >
                <span>Send Message</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Hearing Partner Input Section */}
          <div className="p-5 rounded-3xl bg-white border border-[#DCE5F0] shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-[#2878E5]">
              <div className="w-7 h-7 rounded-lg bg-[#2878E5]/10 flex items-center justify-center text-[#2878E5]">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#123B70]">Hearing Partner Turn</h3>
                <p className="text-[11px] text-gray-500">Speak into microphone or type</p>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                value={hearingInput}
                onChange={(e) => setHearingInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendHearingMessage()}
                placeholder={isListening ? 'Listening... speak clearly now' : 'Speak or type response...'}
                className="w-full p-3 pr-20 rounded-xl border border-[#DCE5F0] focus:ring-2 focus:ring-[#2878E5] focus:outline-hidden text-sm font-medium"
              />
              <button
                onClick={toggleMicListening}
                className={`absolute right-2 top-2 p-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1 ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-[#F2F7FD] text-gray-700 hover:bg-[#DCE5F0]'
                }`}
                title="Toggle microphone"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-gray-400">
                {isListening ? '🎤 Voice transcription active...' : 'Speech-to-Text ready'}
              </span>
              <button
                onClick={sendHearingMessage}
                disabled={!hearingInput.trim()}
                className="px-4 py-2 rounded-xl bg-[#2878E5] hover:bg-[#123B70] disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs"
              >
                <span>Send to Signer</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
