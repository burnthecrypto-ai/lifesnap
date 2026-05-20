import { useLocation } from "wouter";
import { motion, useAnimationFrame } from "framer-motion";
import { useRef, useState } from "react";
import {
  Mic, Keyboard, Paperclip,
  Brain, Activity, FileText, BookOpen, CheckSquare, Users,
  AlertTriangle, Terminal, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/context";
import { ProcessInputMode } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const MODES: { value: ProcessInputMode; label: string }[] = [
  { value: "ai_recommended", label: "AI Recommended" },
  { value: "life_admin",     label: "Life Admin" },
  { value: "health",         label: "Health Appt Prep" },
  { value: "legal",          label: "Legal / Incident" },
  { value: "business",       label: "Business Build" },
  { value: "legacy",         label: "Legacy / Final Admin" },
  { value: "diary",          label: "Diary / Reflection" },
];

/* ── DayGlo colour constants ─────────────────────────────────────── */
const PINK   = "hsl(330 100% 62%)";
const PURPLE = "hsl(272 95% 68%)";
const CYAN   = "hsl(188 100% 54%)";
const ORANGE = "hsl(28 100% 58%)";
const AMBER  = "hsl(45 100% 60%)";

/* ── Particle layer ─────────────────────────────────────────────── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  r: 85 + (i % 4) * 28,
  size: i % 3 === 0 ? 4 : i % 2 === 0 ? 3 : 2,
  speed: 0.00025 + (i % 5) * 0.00012,
  offset: (i / 18) * Math.PI * 2,
  color: [PINK, CYAN, PURPLE, ORANGE][i % 4],
}));

function OrbParticles() {
  const [angles, setAngles] = useState(() => PARTICLES.map(p => p.offset));
  useAnimationFrame((t) => {
    setAngles(PARTICLES.map(p => p.offset + t * p.speed));
  });
  return (
    <svg
      className="absolute"
      style={{ width: 320, height: 320, top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }}
      viewBox="0 0 320 320"
    >
      {PARTICLES.map((p, i) => {
        const cx = 160 + Math.cos(angles[i]) * p.r;
        const cy = 160 + Math.sin(angles[i]) * p.r;
        return (
          <circle key={p.id} cx={cx} cy={cy} r={p.size} fill={p.color}
            style={{ filter: `blur(${p.size > 3 ? 1.5 : 0.5}px)`, opacity: 0.9 }} />
        );
      })}
    </svg>
  );
}

/* ── The living orb ─────────────────────────────────────────────── */
function LivingOrb() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>

      {/* Atmospheric outer halos */}
      <div className="absolute inset-0" style={{
        borderRadius: "50%",
        background: `radial-gradient(circle, transparent 35%, ${PINK}08 55%, ${PURPLE}12 75%, transparent 100%)`,
        animation: "pulse 3s ease-in-out infinite",
      }} />
      <div className="absolute" style={{
        inset: -30, borderRadius: "50%",
        background: `radial-gradient(circle, transparent 40%, ${CYAN}06 65%, ${PURPLE}08 85%, transparent 100%)`,
        animation: "pulse 4s ease-in-out infinite 1s",
      }} />

      {/* Particle field */}
      <OrbParticles />

      {/* Ring 1 — outermost, cyan dashed, slow CW */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="absolute"
        style={{
          inset: 10, borderRadius: "50%",
          border: "2px dashed hsl(188 100% 54% / .7)",
          boxShadow: "0 0 12px hsl(188 100% 54% / .5), inset 0 0 12px hsl(188 100% 54% / .2)",
        }}
      />

      {/* Ring 2 — purple, half-arc, medium CCW */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        className="absolute"
        style={{
          inset: 26, borderRadius: "50%",
          border: "3px solid transparent",
          borderTopColor: "hsl(272 95% 68%)",
          borderRightColor: "hsl(272 95% 68% / .15)",
          borderBottomColor: "hsl(272 95% 68%)",
          borderLeftColor: "hsl(272 95% 68% / .15)",
          boxShadow: "0 0 16px hsl(272 95% 68% / .6), inset 0 0 10px hsl(272 95% 68% / .15)",
        }}
      />

      {/* Ring 3 — hot pink, dotted, fast CW */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute"
        style={{
          inset: 44, borderRadius: "50%",
          border: "3px dotted hsl(330 100% 62%)",
          boxShadow: "0 0 18px hsl(330 100% 62% / .7), 0 0 40px hsl(330 100% 62% / .3), inset 0 0 14px hsl(330 100% 62% / .2)",
        }}
      />

      {/* Ring 4 — orange, thin, medium CCW */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 13, repeat: Infinity, ease: "linear" }}
        className="absolute"
        style={{
          inset: 60, borderRadius: "50%",
          border: "2px solid transparent",
          borderTopColor: "hsl(28 100% 58%)",
          borderBottomColor: "hsl(28 100% 58% / .3)",
          boxShadow: "0 0 12px hsl(28 100% 58% / .5)",
        }}
      />

      {/* Core orb — layered radial, breathing */}
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: 64, height: 64, borderRadius: "50%",
          background: `radial-gradient(circle at 38% 35%, hsl(0 0% 100%) 0%, hsl(330 100% 78%) 20%, hsl(330 100% 62%) 45%, hsl(272 95% 52%) 75%, hsl(240 18% 10%) 100%)`,
          boxShadow: `
            0 0 0 2px hsl(330 100% 62% / .4),
            0 0 20px hsl(330 100% 62%),
            0 0 45px hsl(330 100% 62% / .7),
            0 0 90px hsl(272 95% 68% / .5),
            0 0 160px hsl(272 95% 68% / .25),
            inset 0 -4px 12px hsl(272 95% 50% / .4),
            inset 0 3px 8px hsl(0 0% 100% / .5)
          `,
        }}
      />
    </div>
  );
}

/* ── Vertical card ──────────────────────────────────────────────── */
interface VertCardProps {
  cardClass: string;
  iconClass: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge?: { label: string; color: string };
  delay?: number;
}
function VertCard({ cardClass, iconClass, icon, title, desc, badge, delay = 0 }: VertCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={`${cardClass} p-5 relative overflow-hidden`}
    >
      {badge && (
        <span
          className="absolute top-3 right-3 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest font-mono rounded-sm"
          style={{ background: badge.color, color: "#000" }}
        >
          {badge.label}
        </span>
      )}
      <div className="flex items-start gap-4">
        <div className={`${iconClass} p-3 rounded-lg shrink-0`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-black text-white uppercase text-sm tracking-wide mb-1.5">{title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */
export default function Home() {
  const [, setLocation] = useLocation();
  const { selectedMode, setSelectedMode, setInputType } = useApp();
  const { toast } = useToast();

  const handleAction = (type: "talk" | "type") => {
    setInputType(type);
    setLocation("/input");
  };

  const handleUpload = () => {
    toast({ title: "Coming in V2", description: "File upload is in the next release." });
  };

  return (
    <div className="flex-1 flex flex-col pb-16 overflow-y-auto" style={{ scrollbarWidth: "none" }}>

      {/* ════ HERO ════ */}
      <section className="relative flex flex-col items-center px-6 pt-10 pb-8 overflow-hidden">

        {/* Living background atmosphere */}
        <div className="atmo-bg">
          <div className="atmo-blob" style={{ width: 340, height: 340, top: "-120px", left: "-80px", background: `radial-gradient(circle, ${PINK}, transparent 70%)` }} />
          <div className="atmo-blob" style={{ width: 300, height: 300, top: "-80px", right: "-100px", background: `radial-gradient(circle, ${PURPLE}, transparent 70%)`, animationDelay: "3s" }} />
          <div className="atmo-blob" style={{ width: 260, height: 260, top: "160px", left: "50%", transform: "translateX(-50%)", background: `radial-gradient(circle, ${CYAN}, transparent 70%)`, animationDelay: "6s", opacity: 0.1 }} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 mb-6"
        >
          <LivingOrb />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 text-center space-y-3 w-full"
        >
          <h1
            className="text-6xl font-black uppercase tracking-tighter text-white"
            style={{ textShadow: "0 0 30px hsl(0 0% 100% / .7), 0 0 70px hsl(330 100% 62% / .4), 0 0 120px hsl(272 95% 68% / .25)" }}
          >
            LifeSnap
          </h1>
          <p
            className="text-lg font-bold uppercase tracking-widest"
            style={{ color: CYAN, textShadow: "0 0 12px hsl(188 100% 54%), 0 0 35px hsl(188 100% 54% / .6)" }}
          >
            AI Case Intelligence for Real Life
          </p>
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 mt-1 text-[10px] font-black uppercase tracking-widest font-mono rounded-sm"
            style={{
              background: `linear-gradient(90deg, hsl(28 100% 58% / .18), hsl(55 100% 58% / .12))`,
              border: `1.5px solid hsl(28 100% 58% / .7)`,
              color: ORANGE,
              boxShadow: `0 0 10px hsl(28 100% 58% / .3), 0 0 25px hsl(28 100% 58% / .15)`,
              textShadow: `0 0 8px hsl(28 100% 58%)`,
            }}
          >
            <Zap className="w-3 h-3" />
            DAAI007 — Founder Beta
          </div>
        </motion.div>

        {/* ── Action buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 w-full flex flex-col gap-3 mt-10"
        >
          <button
            className="w-full h-16 flex items-center px-6 gap-4 font-black uppercase tracking-wider text-base btn-dayglo-pink rounded-lg"
            onClick={() => handleAction("talk")}
            data-testid="button-talk"
          >
            <Mic className="w-6 h-6 shrink-0" />
            Talk it out
          </button>
          <button
            className="w-full h-16 flex items-center px-6 gap-4 font-black uppercase tracking-wider text-sm btn-dayglo-cyan rounded-lg"
            onClick={() => handleAction("type")}
            data-testid="button-type"
          >
            <Keyboard className="w-6 h-6 shrink-0" />
            Type it out
          </button>
          <button
            className="w-full h-14 flex items-center px-6 gap-4 font-bold uppercase tracking-wider text-sm text-muted-foreground rounded-lg transition-colors hover:text-white"
            style={{ background: "hsl(240 14% 8%)", border: "2px solid hsl(240 10% 18%)" }}
            onClick={handleUpload}
            data-testid="button-upload"
          >
            <Paperclip className="w-5 h-5 shrink-0 opacity-50" />
            Upload file (V2)
          </button>
        </motion.div>

        {/* ── Mode chips ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="relative z-10 w-full mt-6"
        >
          <div className="flex overflow-x-auto pb-2 gap-2" style={{ scrollbarWidth: "none" }}>
            {MODES.map((mode) => {
              const active = selectedMode === mode.value;
              return (
                <button
                  key={mode.value}
                  onClick={() => setSelectedMode(mode.value)}
                  className="snap-center shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all"
                  style={active ? {
                    background: `linear-gradient(135deg, hsl(330 100% 62% / .3), hsl(272 95% 68% / .25))`,
                    border: "2px solid hsl(330 100% 62% / .8)",
                    color: "#fff",
                    boxShadow: "0 0 14px hsl(330 100% 62% / .5), 0 0 30px hsl(330 100% 62% / .25)",
                    textShadow: "0 0 8px hsl(330 100% 62% / .8)",
                  } : {
                    background: "hsl(240 14% 9%)",
                    border: "2px solid hsl(240 10% 18%)",
                    color: "hsl(240 8% 55%)",
                  }}
                  data-testid={`mode-${mode.value}`}
                >
                  {mode.label}
                </button>
              );
            })}
          </div>
        </motion.div>
      </section>

      <div className="section-divider mx-6" />

      {/* ════ FOUNDER ACCESS ════ */}
      <section className="px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-pink p-6 relative overflow-hidden rounded-xl"
        >
          <div className="absolute inset-0 scan-line opacity-40" />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, hsl(330 100% 80% / .6), transparent)" }} />

          <div className="relative z-10 text-center">
            <p
              className="text-[10px] font-black uppercase tracking-widest font-mono mb-3"
              style={{ color: PINK, textShadow: `0 0 8px ${PINK}` }}
            >
              Limited to 100 Members
            </p>
            <h3
              className="text-3xl font-black uppercase tracking-wide text-white mb-1"
              style={{ textShadow: "0 0 20px hsl(0 0% 100% / .5), 0 0 50px hsl(330 100% 62% / .3)" }}
            >
              Founder's Access
            </h3>
            <div
              className="text-5xl font-black my-4"
              style={{ color: PINK, textShadow: `0 0 16px ${PINK}, 0 0 40px hsl(330 100% 62% / .6), 0 0 80px hsl(330 100% 62% / .3)` }}
            >
              $39<span className="text-xl opacity-60">/month</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Lock in founder pricing forever before public launch.
            </p>
            <ul className="text-left text-sm space-y-3 mb-8">
              {["AI Case Mapping", "Skin-Body Timeline Report", "Doctor-Facing Report Export", "Priority Support"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-white/90">
                  <span className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: PINK, boxShadow: `0 0 8px ${PINK}, 0 0 20px hsl(330 100% 62% / .5)` }} />
                  {item}
                </li>
              ))}
            </ul>
            <button
              className="w-full h-14 font-black uppercase tracking-widest text-sm btn-dayglo-pink rounded-lg"
            >
              Join the Founder Pilot
            </button>
          </div>
        </motion.div>
      </section>

      <div className="section-divider mx-6" />

      {/* ════ VERTICALS ════ */}
      <section className="px-6 py-10">
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xl font-black uppercase tracking-widest text-center mb-8 text-white"
          style={{ textShadow: "0 0 20px hsl(0 0% 100% / .4), 0 0 50px hsl(272 95% 68% / .25)" }}
        >
          One Intelligence Platform
        </motion.h3>
        <div className="flex flex-col gap-4">
          <VertCard delay={0}   cardClass="card-pink"   iconClass="icon-wrap-pink"
            icon={<Brain className="w-6 h-6" style={{ color: PINK }} />}
            title="AI Case Mapping Assistant"
            desc="Describe any situation. Instant structured case map, timeline, and action plan." />
          <VertCard delay={0.05} cardClass="card-cyan"  iconClass="icon-wrap-cyan"
            icon={<Activity className="w-6 h-6" style={{ color: CYAN }} />}
            title="Skin-Body Timeline Report"
            desc="Track symptoms, flares, treatments, and patterns. Build your evidence trail." />
          <VertCard delay={0.1} cardClass="card-purple" iconClass="icon-wrap-purple"
            icon={<FileText className="w-6 h-6" style={{ color: PURPLE }} />}
            title="Doctor-Facing Report Tools"
            desc="Clinical-grade summaries ready for your GP, specialist, or solicitor." />
          <VertCard delay={0.15} cardClass="card-orange" iconClass="icon-wrap-orange"
            icon={<BookOpen className="w-6 h-6" style={{ color: ORANGE }} />}
            title="The Book"
            desc="Pre-order: The LifeSnap Method — a complete guide to health documentation." />
          <VertCard delay={0.2} cardClass="card-cyan"   iconClass="icon-wrap-cyan"
            icon={<CheckSquare className="w-6 h-6" style={{ color: CYAN }} />}
            title="Evidence Checklist"
            desc="Free lead magnet. Download the LifeSnap Evidence Starter Kit."
            badge={{ label: "Free", color: CYAN }} />
          <VertCard delay={0.25} cardClass="card-purple" iconClass="icon-wrap-purple"
            icon={<Users className="w-6 h-6" style={{ color: PURPLE }} />}
            title="Community & Courses"
            desc="Peer support, live sessions, and structured learning."
            badge={{ label: "Coming Soon", color: PURPLE }} />
        </div>
      </section>

      <div className="section-divider mx-6" />

      {/* ════ AI CONSOLE SHOWCASE ════ */}
      <section className="px-6 py-10">
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xl font-black uppercase tracking-widest text-center mb-6 text-white"
          style={{ textShadow: "0 0 20px hsl(0 0% 100% / .4), 0 0 50px hsl(188 100% 54% / .25)" }}
        >
          Your AI produces this, instantly
        </motion.h3>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-cyan relative overflow-hidden rounded-xl"
        >
          <div className="absolute inset-0 scan-line opacity-60" />

          {/* Terminal header */}
          <div className="relative z-10 px-4 py-3 flex items-center gap-2.5 border-b-2"
            style={{ borderColor: `${CYAN}50`, background: `hsl(188 40% 8% / .8)` }}>
            <Terminal className="w-4 h-4" style={{ color: CYAN }} />
            <span className="font-black text-[10px] uppercase tracking-widest font-mono"
              style={{ color: CYAN, textShadow: `0 0 8px ${CYAN}` }}>
              LIFESNAP // CASE INTELLIGENCE ACTIVE
            </span>
            <span className="inline-block w-2 h-3.5 ml-1 rounded-sm animate-pulse"
              style={{ background: CYAN, boxShadow: `0 0 8px ${CYAN}` }} />
          </div>

          <div className="relative z-10 p-4 space-y-3">
            {/* Mock summary card */}
            <div className="p-3 rounded-lg"
              style={{ background: "hsl(240 14% 7% / .9)", border: "1px solid hsl(240 10% 20%)" }}>
              <div className="text-[10px] uppercase tracking-wider font-mono mb-2 pb-1 border-b border-border/40"
                style={{ color: CYAN }}>Situation Summary</div>
              <div className="space-y-1.5">
                <div className="h-2 rounded bg-muted/70 w-full" />
                <div className="h-2 rounded bg-muted/50 w-4/5" />
              </div>
            </div>
            {/* Mock actions card */}
            <div className="p-3 rounded-lg"
              style={{ background: "hsl(240 14% 7% / .9)", border: "1px solid hsl(240 10% 20%)" }}>
              <div className="text-[10px] uppercase tracking-wider font-mono mb-2 pb-1 border-b border-border/40"
                style={{ color: PINK }}>Next 3 Actions</div>
              {["1.", "2.", "3."].map((n) => (
                <div key={n} className="flex gap-2 mb-1.5">
                  <span className="text-[10px] font-mono font-black" style={{ color: PINK }}>{n}</span>
                  <div className="h-2 rounded bg-muted/60 flex-1 mt-0.5" />
                </div>
              ))}
            </div>
            {/* Mock risk card */}
            <div className="p-3 rounded-lg"
              style={{ background: "hsl(28 30% 6% / .9)", border: `1px solid hsl(28 100% 58% / .35)` }}>
              <div className="text-[10px] uppercase tracking-wider font-mono mb-2 pb-1 border-b flex items-center gap-1"
                style={{ color: ORANGE, borderColor: `${ORANGE}30` }}>
                <AlertTriangle className="w-3 h-3" /> Risk & Deadline Flags
              </div>
              <div className="space-y-1.5">
                <div className="flex gap-2"><span className="text-[10px] font-black" style={{ color: ORANGE }}>!</span><div className="h-2 rounded flex-1 mt-0.5" style={{ background: `hsl(28 100% 58% / .25)` }} /></div>
                <div className="flex gap-2"><span className="text-[10px] font-black" style={{ color: ORANGE }}>!</span><div className="h-2 rounded w-4/5 mt-0.5" style={{ background: `hsl(28 100% 58% / .2)` }} /></div>
              </div>
            </div>
          </div>
        </motion.div>
        <p className="text-center text-[10px] text-muted-foreground mt-4 font-mono uppercase tracking-widest">
          Tap Talk or Type above to run your own case
        </p>
      </section>

      <div className="section-divider mx-6" />

      {/* ════ SAFETY ════ */}
      <section className="px-6 pt-8 pb-14">
        <div className="card-amber relative overflow-hidden rounded-xl p-5">
          <div className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: `linear-gradient(90deg, transparent, ${AMBER}, transparent)` }} />
          <div className="flex items-center gap-2.5 mb-3">
            <AlertTriangle className="w-5 h-5 shrink-0" style={{ color: AMBER, filter: `drop-shadow(0 0 6px ${AMBER})` }} />
            <h4
              className="font-black uppercase text-sm tracking-wider"
              style={{ color: AMBER, textShadow: `0 0 10px ${AMBER}` }}
            >
              Important Boundaries
            </h4>
          </div>
          <p className="text-xs text-white/85 leading-relaxed mb-3">
            LifeSnap is an AI documentation and organisation tool. It is NOT a substitute
            for medical, legal, financial, psychological, or emergency professional advice.
            Always consult a qualified professional. In an emergency, call 999 or 112.
          </p>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            No raw audio or video stored. Text-first storage only.
          </p>
        </div>
      </section>

    </div>
  );
}
