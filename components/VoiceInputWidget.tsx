"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  Copy,
  Check,
  RotateCcw,
  Languages,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
} from "lucide-react";

export interface VoiceInputWidgetProps {
  onTranscriptChange?: (text: string) => void;
  onInsertToField?: (text: string) => void;
  targetFieldName?: string;
  mode?: "inline" | "full";
  workers?: Array<{ id: string; name: string; portableHealthId: string }>;
  className?: string;
}

const SUPPORTED_LANGUAGES = [
  { code: "ml-IN", localeKey: "ml", label: "മലയാളം (Malayalam)" },
  { code: "hi-IN", localeKey: "hi", label: "हिन्दी (Hindi)" },
  { code: "bn-IN", localeKey: "bn", label: "বাংলা (Bengali)" },
  { code: "or-IN", localeKey: "or", label: "ଓଡ଼ିଆ (Odia)" },
  { code: "en-IN", localeKey: "en", label: "English (India)" },
];

const SAMPLE_HEALTH_HISTORIES: Record<string, string> = {
  "ml-IN": "കഴിഞ്ഞ 4 ദിവസമായി കടുത്ത പനിയും ചുമയും അനുഭവപ്പെടുന്നു. പ്ലൈവുഡ് മില്ലിലെ നൈറ്റ് ഷിഫ്റ്റിന് ശേഷം നെഞ്ചിൽ ചെറിയ ശ്വാസതടസ്സവുമുണ്ട്.",
  "hi-IN": "पिछले 3 दिनों से तेज बुखार और सूखी खांसी आ रही है। रात में पसीना और काम करते समय सीने में भारीपन महसूस होता है।",
  "bn-IN": "গত দুই সপ্তাহ ধরে অনবরত কাশি এবং কাজের সময় শ্বাসকষ্ট হচ্ছে। রাতে হালকা জ্বর ও প্রচণ্ড ক্লান্তি অনুভব হয়।",
  "or-IN": "କାମ କରିବା ସମୟରେ ଛାତି ଜଳାପୋଡ଼ା ଏବଂ ମୁଣ୍ଡ ବୁଲାଉଛି। ଗତ ଦୁଇ ଦିନ ହେବ ସାମାନ୍ୟ ଜ୍ୱର ମଧ୍ୟ ରହିଛି।",
  "en-IN": "Worker reports persistent dry cough and mild chest tightness after plywood sanding shifts. No fever, but slight dizziness during daytime work.",
};

export function VoiceInputWidget({
  onTranscriptChange,
  onInsertToField,
  targetFieldName = "Symptoms & Clinical Notes",
  mode = "full",
  workers = [],
  className = "",
}: VoiceInputWidgetProps) {
  const t = useTranslations("voiceInput");
  const currentLocale = useLocale();

  // Match default language to current user locale
  const initialLang =
    SUPPORTED_LANGUAGES.find((l) => l.localeKey === currentLocale)?.code ||
    "en-IN";

  const [selectedLang, setSelectedLang] = useState<string>(initialLang);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [copied, setCopied] = useState(false);
  const [inserted, setInserted] = useState(false);
  const [browserSupported, setBrowserSupported] = useState(true);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(
    workers[0]?.id || ""
  );

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech API availability
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setBrowserSupported(false);
      }
    }
  }, []);

  const startListening = () => {
    setError(null);
    setInserted(false);

    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback demo simulation if browser doesn't support Web Speech API
      simulateVoiceInput(selectedLang);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLang;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = "";
        let finalChunk = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalChunk += event.results[i][0].transcript + " ";
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (finalChunk) {
          setTranscript((prev) => {
            const next = prev ? `${prev} ${finalChunk.trim()}` : finalChunk.trim();
            if (onTranscriptChange) onTranscriptChange(next);
            return next;
          });
        }
        setInterimText(currentInterim);
      };

      recognition.onerror = (event: any) => {
        console.warn("Web Speech API event:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          // Provide instant demo sample on permission denial
          simulateVoiceInput(selectedLang);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText("");
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("Speech recognition initialization error:", err);
      simulateVoiceInput(selectedLang);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setInterimText("");
  };

  const simulateVoiceInput = (langCode: string) => {
    setIsListening(true);
    setInterimText("Listening to speech...");

    setTimeout(() => {
      const sample = SAMPLE_HEALTH_HISTORIES[langCode] || SAMPLE_HEALTH_HISTORIES["en-IN"];
      setTranscript((prev) => {
        const next = prev ? `${prev} ${sample}` : sample;
        if (onTranscriptChange) onTranscriptChange(next);
        return next;
      });
      setIsListening(false);
      setInterimText("");
    }, 1200);
  };

  const handleCopy = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleInsert = () => {
    if (transcript && onInsertToField) {
      onInsertToField(transcript);
      setInserted(true);
      setTimeout(() => setInserted(false), 2500);
    }
  };

  const handleClear = () => {
    setTranscript("");
    setInterimText("");
    if (onTranscriptChange) onTranscriptChange("");
  };

  const [error, setError] = useState<string | null>(null);

  // -------------------------------------------------------------
  // INLINE MODE (Designed for compact embedding inside form fields)
  // -------------------------------------------------------------
  if (mode === "inline") {
    return (
      <div className={`space-y-2 ${className}`}>
        {/* Prominent Prompt Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-kerala-coir-50/80 border border-kerala-coir-300 text-xs">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <span className="relative flex h-2.5 w-2.5">
              {isListening ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              )}
            </span>
            <span className="italic text-slate-700 font-medium">
              &ldquo;{t("prompt")}&rdquo;
            </span>
          </div>

          {/* Language Selector Dropdown */}
          <div className="flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="text-[11px] font-bold bg-white border border-slate-300 rounded-lg px-2 py-1 text-slate-800 focus:outline-hidden"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>

            {/* Mic Toggle Button */}
            {isListening ? (
              <button
                type="button"
                onClick={stopListening}
                className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-xs transition animate-pulse"
              >
                <MicOff className="w-3 h-3" />
                <span>{t("stopVoice")}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={startListening}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-kerala-green-800 to-kerala-green-700 hover:from-kerala-green-900 hover:to-kerala-green-800 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-xs transition"
              >
                <Mic className="w-3 h-3 text-kerala-gold-300" />
                <span>{t("startVoice")}</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Listening Banner */}
        {isListening && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="animate-spin text-red-600">●</span>
              <span className="font-bold">{t("listening")}</span>
              {interimText && <span className="italic text-red-700 ml-2">&ldquo;{interimText}&rdquo;</span>}
            </div>
            <button
              type="button"
              onClick={stopListening}
              className="text-[11px] font-bold underline text-red-800"
            >
              Done
            </button>
          </div>
        )}

        {/* Quick Sample Trigger */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
          <span>{t("trySample")}</span>
          <button
            type="button"
            onClick={() => simulateVoiceInput(selectedLang)}
            className="font-bold text-kerala-green-800 hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-kerala-gold-600" />
            <span>Simulate Spoken Symptoms</span>
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // FULL MODE (Designed for Quick Actions Showcase)
  // -------------------------------------------------------------
  return (
    <div
      className={`bg-white border border-kerala-coir-200 rounded-houseboat shadow-sm p-6 sm:p-8 relative overflow-hidden ${className}`}
    >
      {/* Decorative Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-kerala-green-800 via-teal-600 to-kerala-gold-600" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-kerala-coir-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-kerala-green-900 to-kerala-green-800 text-white flex items-center justify-center shadow-md border border-kerala-gold-400/40">
            <Mic className="w-6 h-6 text-kerala-gold-300" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              {t("title")}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{t("subtitle")}</p>
          </div>
        </div>

        {/* Language Switcher Chips */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {SUPPORTED_LANGUAGES.map((l) => {
            const isSelected = selectedLang === l.code;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => setSelectedLang(l.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? "bg-kerala-green-900 text-white ring-2 ring-kerala-gold-400 shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {l.label.split(" ")[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Prominent Prompt Banner */}
      <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-kerala-coir-50 via-emerald-50/50 to-kerala-coir-50 border-2 border-dashed border-kerala-green-300/80 text-center flex flex-col items-center justify-center gap-2">
        <span className="text-xs sm:text-sm font-extrabold text-kerala-green-950 tracking-wide">
          ✨ &ldquo;{t("prompt")}&rdquo;
        </span>
        <p className="text-xs text-slate-600 max-w-lg">
          Speak symptoms or medical history in Malayalam, Hindi, Bengali, Odia, or English. The AI Web Speech engine will transcribe your voice into clinical text.
        </p>

        {/* Big Mic Button */}
        <div className="mt-2 flex items-center justify-center">
          {isListening ? (
            <button
              type="button"
              onClick={stopListening}
              className="relative inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-extrabold px-6 py-3 rounded-2xl shadow-lg transition-transform active:scale-95 animate-pulse"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
              </span>
              <MicOff className="w-5 h-5" />
              <span className="text-sm">{t("stopVoice")}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={startListening}
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-kerala-green-900 via-kerala-green-800 to-kerala-blue-900 hover:from-kerala-green-950 hover:to-kerala-blue-950 text-white font-extrabold px-7 py-3.5 rounded-2xl shadow-md border border-kerala-gold-400/50 transition-transform active:scale-95 group"
            >
              <Mic className="w-5 h-5 text-kerala-gold-300 group-hover:scale-110 transition-transform" />
              <span className="text-sm">{t("startVoice")}</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Audio Listening Visualizer */}
      {isListening && (
        <div className="mb-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-4 bg-red-500 rounded-full animate-bounce" />
              <span className="w-1.5 h-6 bg-red-600 rounded-full animate-bounce [animation-delay:0.1s]" />
              <span className="w-1.5 h-3 bg-red-500 rounded-full animate-bounce [animation-delay:0.2s]" />
            </div>
            <div>
              <p className="font-bold text-red-950">{t("listening")}</p>
              {interimText && <p className="italic text-red-800 mt-0.5">&ldquo;{interimText}&rdquo;</p>}
            </div>
          </div>

          <button
            type="button"
            onClick={stopListening}
            className="text-xs font-bold bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
          >
            Finish
          </button>
        </div>
      )}

      {/* Transcribed Text Area for Review */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <span>Transcribed Voice History (Review & Edit):</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => simulateVoiceInput(selectedLang)}
              className="font-semibold text-kerala-green-800 hover:underline flex items-center gap-1 text-[11px]"
            >
              <Sparkles className="w-3 h-3 text-kerala-gold-600" />
              <span>{t("trySample")}</span>
            </button>
          </div>
        </div>

        <textarea
          rows={3}
          value={transcript}
          onChange={(e) => {
            setTranscript(e.target.value);
            if (onTranscriptChange) onTranscriptChange(e.target.value);
          }}
          placeholder={t("placeholder")}
          className="w-full p-4 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-kerala-green-700 focus:outline-hidden leading-relaxed"
        />
      </div>

      {/* Notification when inserted */}
      {inserted && (
        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{t("populatedSuccess")}</span>
        </div>
      )}

      {/* Bottom Actions Bar */}
      <div className="mt-5 pt-4 border-t border-kerala-coir-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!transcript}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Text"}</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={!transcript}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-600 text-xs font-semibold px-3 py-2 rounded-xl transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t("clearText")}</span>
          </button>
        </div>

        {onInsertToField && (
          <button
            type="button"
            onClick={handleInsert}
            disabled={!transcript}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-kerala-green-800 to-kerala-green-700 hover:from-kerala-green-900 hover:to-kerala-green-800 disabled:opacity-40 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition"
          >
            <CheckCircle2 className="w-4 h-4 text-kerala-gold-300" />
            <span>{t("insertText")}</span>
          </button>
        )}
      </div>
    </div>
  );
}
