"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import {
  Terminal,
  Mic,
  MicOff,
  Send,
  X,
  Minus,
  Maximize2,
  Trash2,
  PhoneCall,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Command,
} from "lucide-react";

interface TerminalMessage {
  id: string;
  sender: "system" | "user" | "bot" | "guardrail";
  text?: string;
  timestamp: string;
  commandKey?: string;
  actionLink?: string;
  actionLabel?: string;
  isMedical?: boolean;
}

const MEDICAL_KEYWORDS = [
  // English
  "fever", "temperature", "cough", "cold", "headache", "chest pain", "pain",
  "vomit", "vomiting", "diarrhea", "loose motion", "stomach ache", "breath",
  "breathlessness", "asthma", "sugar", "diabetes", "bp", "blood pressure",
  "hypertension", "infection", "rash", "skin rash", "itch", "itching",
  "wound", "injury", "fracture", "bleeding", "swelling", "burn", "dizzy",
  "dizziness", "medicine", "pill", "tablet", "dosage", "dose", "antibiotic",
  "paracetamol", "prescription", "cure", "treatment", "sick", "illness",
  "disease", "symptom", "diagnose", "diagnosis", "doctor advise", "what should i take",
  "how to cure", "how to treat", "is it dangerous", "cancer", "tb", "tuberculosis",
  // Malayalam
  "പനി", "ചുമ", "ശ്വാസംമുട്ടൽ", "തലവേദന", "വയറുവേദന", "ഛർദ്ദി", "അതിസാരം",
  "മുറിവ്", "രക്തസമ്മർദ്ദം", "പ്രമേഹം", "മരുന്ന്", "ഗുളിക", "ചികിത്സ",
  // Hindi
  "बुखार", "खांसी", "जुकाम", "सिरदर्द", "दर्द", "उल्टी", "दस्त", "पेट दर्द",
  "सांस", "दवा", "गोली", "इलाज", "बीमारी", "लक्षण", "मधुमेह", "ब्लड प्रेशर",
  // Bengali
  "জ্বর", "কাশি", "মাথাব্যথা", "ব্যথা", "বমি", "ডায়রিয়া", "পেট ব্যথা",
  "শ্বাসকষ্ট", "ওষুধ", "চিকিৎসা", "রোগ", "লক্ষণ", "প্রেসার",
  // Odia
  "ଜ୍ୱର", "କାଶ", "ମୁଣ୍ଡବିନ୍ଧା", "ଯନ୍ତ୍ରଣା", "ବାନ୍ତି", "ଝାଡ଼ା", "ପେଟ ଯନ୍ତ୍ରଣା",
  "ଶ୍ୱାସକଷ୍ଟ", "ଔଷଧ", "ଚିକିତ୍ସା", "ରୋଗ", "ଲକ୍ଷଣ"
];

function isMedicalQuestion(input: string): boolean {
  const normalized = input.toLowerCase().trim();
  return MEDICAL_KEYWORDS.some((kw) => normalized.includes(kw.toLowerCase()));
}

export function SahaayakTerminal() {
  const t = useTranslations("sahaayak");
  const locale = useLocale();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<TerminalMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Initialize terminal greeting on mount
  useEffect(() => {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setMessages([
      {
        id: "init-1",
        sender: "system",
        timestamp: now,
        text: `🟢 Sahaayak\nPlatform Help Assistant\nHello! I can help you use this platform.\nType help to see available commands.`,
      },
    ]);
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, isMinimized]);

  // Speech Recognition initialization
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        const langMap: Record<string, string> = {
          en: "en-IN",
          ml: "ml-IN",
          hi: "hi-IN",
          bn: "bn-IN",
          or: "or-IN",
        };
        recognition.lang = langMap[locale] || "en-IN";

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputVal(transcript);
            handleCommandExecution(transcript);
          }
          setIsListening(false);
        };

        recognition.onerror = (err: any) => {
          console.warn("Speech recognition error in Sahaayak:", err);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [locale]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        const langMap: Record<string, string> = {
          en: "en-IN",
          ml: "ml-IN",
          hi: "hi-IN",
          bn: "bn-IN",
          or: "or-IN",
        };
        recognitionRef.current.lang = langMap[locale] || "en-IN";
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  const handleCommandExecution = (rawInput: string) => {
    const cleaned = rawInput.trim();
    if (!cleaned) return;

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const userMsgId = `user-${Date.now()}`;
    const botMsgId = `bot-${Date.now() + 1}`;

    // 1. Append User Input Message
    const updatedMessages: TerminalMessage[] = [
      ...messages,
      {
        id: userMsgId,
        sender: "user",
        text: cleaned,
        timestamp: time,
      },
    ];

    // 2. CRITICAL CONSTRAINT: Medical Question Guardrail
    if (isMedicalQuestion(cleaned)) {
      setMessages([
        ...updatedMessages,
        {
          id: botMsgId,
          sender: "guardrail",
          timestamp: time,
          isMedical: true,
          text: t("medicalWarningMessage"),
          actionLink: "/quick-actions",
          actionLabel: "Open 2-Min Health Triage",
        },
      ]);
      setInputVal("");
      return;
    }

    // 3. Command Resolver
    const lower = cleaned.toLowerCase();

    // Clear command
    if (lower === "clear" || lower === "cls") {
      setMessages([
        {
          id: `init-${Date.now()}`,
          sender: "system",
          timestamp: time,
          text: `🟢 Sahaayak [Console Buffer Cleared]\nType help to see available commands.`,
        },
      ]);
      setInputVal("");
      return;
    }

    let responseItem: Partial<TerminalMessage> = {};

    if (lower === "help" || lower === "commands" || lower === "menu" || lower === "?") {
      responseItem = {
        commandKey: "help",
        text: `${t("cmdHelpTitle")}\n\n• login        - ${t("cmdLoginTitle")}\n• register     - ${t("cmdRegisterTitle")}\n• health-id    - ${t("cmdHealthIdTitle")}\n• qr           - ${t("cmdQrTitle")}\n• records      - ${t("cmdRecordsTitle")}\n• appointments - Clinic & Camp Appointments\n• language     - ${t("cmdLanguageTitle")}\n• profile      - ${t("cmdProfileTitle")}\n• password     - ${t("cmdPasswordTitle")}\n• contact      - ${t("cmdContactTitle")}\n• clear        - Clear terminal buffer`,
      };
    } else if (lower.includes("appointment") || lower.includes("follow") || lower.includes("schedule") || lower.includes("booking")) {
      responseItem = {
        commandKey: "appointments",
        text: `📅 Clinic Appointments & Follow-ups\nView upcoming scheduled appointments, specialist follow-up referrals, and past consultations across Kerala facilities.`,
        actionLink: "/appointments",
        actionLabel: "Open Appointments",
      };
    } else if (lower.includes("login") || lower.includes("sign in") || lower.includes("auth") || lower.includes("provider")) {
      responseItem = {
        commandKey: "login",
        text: `🔐 ${t("cmdLoginTitle")}\n${t("cmdLoginDesc")}`,
        actionLink: "/login",
        actionLabel: t("cmdLoginAction"),
      };
    } else if (lower.includes("register") || lower.includes("enroll") || lower.includes("signup") || lower.includes("new worker")) {
      responseItem = {
        commandKey: "register",
        text: `📝 ${t("cmdRegisterTitle")}\n${t("cmdRegisterDesc")}`,
        actionLink: "/registry",
        actionLabel: t("cmdRegisterAction"),
      };
    } else if (lower.includes("health-id") || lower.includes("id") || lower.includes("athidhi")) {
      responseItem = {
        commandKey: "health-id",
        text: `🪪 ${t("cmdHealthIdTitle")}\n${t("cmdHealthIdDesc")}`,
        actionLink: "/registry",
        actionLabel: t("cmdHealthIdAction"),
      };
    } else if (lower.includes("qr") || lower.includes("scan") || lower.includes("card") || lower.includes("barcode")) {
      responseItem = {
        commandKey: "qr",
        text: `📱 ${t("cmdQrTitle")}\n${t("cmdQrDesc")}`,
        actionLink: "/",
        actionLabel: t("cmdQrAction"),
      };
    } else if (lower.includes("record") || lower.includes("history") || lower.includes("report") || lower.includes("prescription")) {
      responseItem = {
        commandKey: "records",
        text: `📂 ${t("cmdRecordsTitle")}\n${t("cmdRecordsDesc")}`,
        actionLink: "/records",
        actionLabel: t("cmdRecordsAction"),
      };
    } else if (lower.includes("language") || lower.includes("lang") || lower.includes("hindi") || lower.includes("malayalam") || lower.includes("bengali") || lower.includes("odia")) {
      responseItem = {
        commandKey: "language",
        text: `🌐 ${t("cmdLanguageTitle")}\n${t("cmdLanguageDesc")}`,
      };
    } else if (lower.includes("profile") || lower.includes("search") || lower.includes("find") || lower.includes("worker")) {
      responseItem = {
        commandKey: "profile",
        text: `👤 ${t("cmdProfileTitle")}\n${t("cmdProfileDesc")}`,
        actionLink: "/registry",
        actionLabel: t("cmdProfileAction"),
      };
    } else if (lower.includes("password") || lower.includes("credential") || lower.includes("demo") || lower.includes("reset")) {
      responseItem = {
        commandKey: "password",
        text: `🔑 ${t("cmdPasswordTitle")}\n${t("cmdPasswordDesc")}`,
        actionLink: "/login",
        actionLabel: t("cmdPasswordAction"),
      };
    } else if (lower.includes("contact") || lower.includes("helpline") || lower.includes("disha") || lower.includes("phone") || lower.includes("support") || lower.includes("emergency")) {
      responseItem = {
        commandKey: "contact",
        text: `📞 ${t("cmdContactTitle")}\n${t("cmdContactDesc")}`,
        actionLink: "tel:1056",
        actionLabel: t("cmdContactAction"),
      };
    } else {
      // Unknown command
      responseItem = {
        text: t("unknownCommand", { cmd: cleaned }),
      };
    }

    setMessages([
      ...updatedMessages,
      {
        id: botMsgId,
        sender: "bot",
        timestamp: time,
        ...responseItem,
      },
    ]);
    setInputVal("");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommandExecution(inputVal);
  };

  const commandChips = [
    "help",
    "login",
    "register",
    "health-id",
    "qr",
    "records",
    "appointments",
    "language",
    "profile",
    "password",
    "contact",
  ];

  return (
    <>
      {/* Floating Sahaayak Trigger Button (Bottom Right) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-5 right-5 z-50 bg-[#08120a] hover:bg-[#0c1a10] text-[#e1f4df] border-2 border-[#1b4332] shadow-2xl px-4 py-2.5 rounded-full flex items-center gap-2.5 transition-all duration-200 hover:scale-105 group"
          aria-label="Open Sahaayak Platform Terminal"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
          <span className="font-mono text-xs font-bold tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-6 transition-transform" />
            <span>Sahaayak</span>
            <span className="text-[10px] text-[#b1dbb8] px-1.5 py-0.2 rounded-md bg-[#0f3e17] border border-[#275544]">
              &gt;_
            </span>
          </span>
        </button>
      )}

      {/* Terminal Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-200 shadow-2xl ${
            isMinimized
              ? "bottom-5 right-5 w-72 sm:w-80 rounded-card overflow-hidden border border-[#275544]"
              : "bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[480px] max-h-[85vh] sm:max-h-[600px] h-[540px] rounded-card overflow-hidden border-2 border-[#1b4332] flex flex-col bg-[#080e0a]"
          }`}
        >
          {/* Terminal Title Bar */}
          <div className="bg-[#0c1a10] border-b border-[#1b4332] px-3.5 py-2.5 flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              {/* Window Dots */}
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <div className="flex items-center gap-1.5 ml-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-xs font-bold text-emerald-300">
                  {t("headerTitle")}
                </span>
                <span className="text-[10px] text-emerald-600 font-mono hidden sm:inline">
                  • {t("headerSubtitle")}
                </span>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Restore" : "Minimize"}
                className="p-1 hover:text-white hover:bg-white/10 rounded transition"
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1 hover:text-red-400 hover:bg-red-950/40 rounded transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* If Minimized, Only Render Compact Bar */}
          {!isMinimized && (
            <>
              {/* Terminal Buffer / Output Stream */}
              <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-3.5 text-emerald-300 bg-[#080e0a] select-text">
                {/* System Node Banner */}
                <div className="text-[10px] text-emerald-700 pb-1 border-b border-[#0f2d19] flex items-center justify-between">
                  <span>node: kerala-dhs-gateway-v2.4</span>
                  <span className="text-emerald-500">locale: {locale.toUpperCase()}</span>
                </div>

                {messages.map((msg) => (
                  <div key={msg.id} className="space-y-1.5 animate-in fade-in duration-150">
                    {/* User Prompt Entry */}
                    {msg.sender === "user" && (
                      <div className="flex items-start gap-1.5 text-emerald-400">
                        <span className="text-emerald-500 font-bold select-none">guest@sahaayak:~$</span>
                        <span className="text-white font-semibold break-words">{msg.text}</span>
                        <span className="text-[9px] text-emerald-700 ml-auto select-none shrink-0">{msg.timestamp}</span>
                      </div>
                    )}

                    {/* System Greeting */}
                    {msg.sender === "system" && (
                      <div className="p-3 rounded-lg bg-[#0c1f13] border border-[#1b4332] text-emerald-200 whitespace-pre-line leading-relaxed shadow-xs">
                        {msg.text}
                      </div>
                    )}

                    {/* Medical Guardrail Restriction Warning */}
                    {msg.sender === "guardrail" && (
                      <div className="p-3.5 rounded-lg bg-red-950/80 border-2 border-red-500 text-red-200 space-y-2 shadow-md">
                        <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                          <span>{t("medicalWarningTitle")}</span>
                        </div>
                        <p className="text-xs leading-relaxed text-red-100 font-sans">
                          {msg.text}
                        </p>
                        <div className="pt-1.5 flex flex-wrap items-center gap-2">
                          <a
                            href="tel:1056"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] font-sans shadow-xs transition"
                          >
                            <PhoneCall className="w-3 h-3" />
                            <span>{t("callDishaBtn")}</span>
                          </a>
                          {msg.actionLink && (
                            <Link
                              href={msg.actionLink as any}
                              onClick={() => setIsOpen(false)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px] font-sans transition"
                            >
                              <span>{msg.actionLabel || "Open Triage"}</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Bot Navigation Response */}
                    {msg.sender === "bot" && (
                      <div className="p-3 rounded-lg bg-[#0a160e] border border-[#1b4332] text-emerald-200 space-y-2 shadow-xs">
                        <div className="whitespace-pre-line leading-relaxed">
                          {msg.text}
                        </div>

                        {/* Interactive Navigation Link Button */}
                        {msg.actionLink && (
                          <div className="pt-1">
                            {msg.actionLink.startsWith("tel:") ? (
                              <a
                                href={msg.actionLink}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#133125] hover:bg-[#1b4332] text-emerald-300 border border-[#275544] text-[11px] font-bold transition"
                              >
                                <PhoneCall className="w-3 h-3 text-emerald-400" />
                                <span>{msg.actionLabel || "Call Now"}</span>
                              </a>
                            ) : (
                              <Link
                                href={msg.actionLink as any}
                                onClick={() => setIsOpen(false)}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#133125] hover:bg-[#1b4332] text-emerald-300 border border-[#275544] text-[11px] font-bold transition group"
                              >
                                <span>{msg.actionLabel || "Jump to Page"}</span>
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Command Suggestions Chips */}
              <div className="px-3 py-2 bg-[#0a140d] border-t border-[#132b1c] overflow-x-auto">
                <div className="flex items-center gap-1.5 text-[11px] font-mono">
                  <span className="text-emerald-600 shrink-0 text-[10px] uppercase font-bold">
                    [cmd]:
                  </span>
                  {commandChips.map((cmd) => (
                    <button
                      key={cmd}
                      type="button"
                      onClick={() => handleCommandExecution(cmd)}
                      className="px-2 py-0.5 rounded-md bg-[#0f2416] hover:bg-[#1b4332] text-emerald-400 hover:text-white border border-[#1b4332] shrink-0 transition"
                    >
                      {cmd}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleCommandExecution("clear")}
                    title={t("clearTerminal")}
                    className="p-1 text-emerald-700 hover:text-red-400 rounded transition shrink-0 ml-auto"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Terminal Input Bar with Web Speech API */}
              <form
                onSubmit={handleFormSubmit}
                className="p-2.5 bg-[#060b08] border-t border-[#1b4332] flex items-center gap-2"
              >
                <div className="flex items-center gap-1.5 flex-1 bg-[#09120b] border border-[#1b4332] focus-within:border-emerald-500 rounded-md px-2.5 py-1.5 transition">
                  <span className="text-emerald-500 font-mono text-xs font-bold select-none">&gt;</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder={isListening ? t("listening") : t("inputPlaceholder")}
                    className="w-full bg-transparent text-emerald-300 font-mono text-xs focus:outline-hidden placeholder:text-emerald-800"
                  />
                  {/* Blinking Cursor Indicator */}
                  {!inputVal && !isListening && (
                    <span className="w-1.5 h-3.5 bg-emerald-500 animate-pulse select-none" />
                  )}
                </div>

                {/* Voice Input Mic Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  title={isListening ? t("stopListening") : t("listening")}
                  className={`p-2 rounded-md transition flex items-center justify-center ${
                    isListening
                      ? "bg-red-600 text-white animate-pulse"
                      : "bg-[#0f2416] hover:bg-[#1b4332] text-emerald-400 border border-[#1b4332]"
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>

                {/* Submit Command Button */}
                <button
                  type="submit"
                  disabled={!inputVal.trim()}
                  className="p-2 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-slate-950 font-bold transition flex items-center justify-center"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
