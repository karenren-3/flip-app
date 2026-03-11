import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';

// --- 1. 配置与语录数据 ---
const dailyQuotes = [
  "现在的这一页，值得你全神贯注地写。",
  "与其在旧账里内耗，不如在这一页落笔。",
  "翻过去，是为了腾出手来，握住新的可能。"
];
const farewellQuotes = [
  "这一页的褶皱已经抹平，祝你有个好梦。",
  "所有的疲惫都已消散，祝你做个好梦。"
];
const feedbackPool = ["释怀", "放下", "新生", "圆满", "翻篇"];

// --- 2. 样式定义 ---
const styles = {
  appBg: { 
    height: '100dvh', width: '100vw', backgroundColor: '#fcfcfd', 
    position: 'fixed', inset: 0, overflow: 'hidden', 
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' 
  },
  mainWrapper: { height: '100%', width: '100%', display: 'flex', flexDirection: 'column', padding: '40px 24px 0' },
  layoutWrapper: { maxWidth: '400px', margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 },
  
  // 核心修复：物理裁剪外壳，解决截图中的直角 Bug
  cardShell: { 
    position: 'relative', width: '100%', minHeight: '160px', 
    borderRadius: '35px', overflow: 'hidden', isolation: 'isolate', 
    marginBottom: '16px', WebkitMaskImage: '-webkit-radial-gradient(white, black)' 
  },
  
  cardContainer: {
    width: '100%', height: '100%', minHeight: '160px', 
    display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px', 
    touchAction: 'none', cursor: 'grab',
    background: 'linear-gradient(135deg, rgba(45, 212, 191, 0.2) 0%, rgba(251, 146, 60, 0.15) 100%)',
    backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', 
    border: '1px solid rgba(255,255,255,0.8)', borderRadius: '35px',
  },
  editInput: { 
    width: '100%', background: 'transparent', border: 'none', outline: 'none', 
    fontSize: '22px', fontWeight: 900, color: '#1e293b', 
    borderBottom: '2px solid #2dd4bf', paddingBottom: '4px' 
  }
};

// --- 3. 子组件：FlipItem ---
const FlipItem = ({ task, onAction, onUpdate }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 0.5, 1, 0.5, 0]);
  
  const [phrase, setPhrase] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  
  const audioRef = useRef(null);
  const pressTimer = useRef(null);

  const playFlipSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const triggerConfetti = (info) => {
    confetti({
      particleCount: 30, spread: 60, 
      origin: { x: info.point.x / window.innerWidth, y: info.point.y / window.innerHeight },
      colors: ['#2dd4bf', '#fb923c', '#ffffff'], gravity: 0.8
    });
  };

  const handleShare = async () => {
    if (isEditing) return;
    const element = document.getElementById(`card-${task.id}`);
    if (!element) return;
    const canvas = await html2canvas(element, { backgroundColor: '#fcfcfd', scale: 3, borderRadius: 35 });
    const link = document.createElement('a');
    link.download = `翻篇-${task.title}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handlePointerDown = () => {
    if (isEditing) return;
    pressTimer.current = setTimeout(() => setIsEditing(true), 600);
  };

  const handlePointerUp = () => clearTimeout(pressTimer.current);

  const handleSave = () => {
    onUpdate(task.id, editValue);
    setIsEditing(false);
  };

  return (
    <div style={styles.cardShell} id={`card-${task.id}`} onDoubleClick={handleShare}>
      <audio ref={audioRef} src="/flip.mp3" preload="auto" />
      <AnimatePresence>
        {phrase && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#94a3b8', fontSize: '28px', fontWeight: 800, zIndex: 10, pointerEvents: 'none' }}>
            {phrase}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        drag={!isEditing}
        dragElastic={0.9}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        whileTap={{ scale: isEditing ? 1 : 0.98 }}
        style={{ x, y, rotate, opacity, ...styles.cardContainer }}
        onDragEnd={(_, info) => {
          if (Math.abs(info.offset.x) > 100 || Math.abs(info.offset.y) > 100) {
            playFlipSound();
            triggerConfetti(info);
            setPhrase(feedbackPool[Math.floor(Math.random() * feedbackPool.length)]);
            setTimeout(() => onAction(task.id), 500);
          } else { x.set(0); y.set(0); }
        }}
      >
        {isEditing ? (
          <div style={{ textAlign: 'left' }}>
            <input autoFocus value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={handleSave} onKeyDown={(e) => e.key === 'Enter' && handleSave()} style={styles.editInput} />
            <p style={{ fontSize: '12px', color: '#2dd4bf', marginTop: '8px' }}>正在重写这一页...</p>
          </div>
        ) : (
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#1e293b', margin: '0 0 12px 0', lineHeight: 1.3 }}>{task.title}</h3>
            <p style={{ fontSize: '15px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{task.description}</p>
            <div style={{ position: 'absolute', bottom: 12, right: 20, opacity: 0.2, fontSize: '10px' }}>长按编辑 · 双击分享</div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// --- 4. 主组件：App ---
export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('flip_tasks') : null;
    return saved ? JSON.parse(saved) : [{ id: '1', title: "长按我可以修改内容", description: "向左右滑动翻篇", isGuide: true }];
  });

  const [inputValue, setInputValue] = useState('');
  const [step, setStep] = useState('active');
  const [breathSec, setBreathSec] = useState(3);
  const [dailyQuote, setDailyQuote] = useState("");
  const [sleepQuote, setSleepQuote] = useState("");

  useEffect(() => {
    setDailyQuote(dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)]);
    setSleepQuote(farewellQuotes[Math.floor(Math.random() * farewellQuotes.length)]);
  }, []);

  useEffect(() => {
    localStorage.setItem('flip_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAction = (id) => {
    setTasks(prev => {
      const remaining = prev.filter(t => t.id !== id);
      if (remaining.length === 0) setTimeout(() => setStep('final_text'), 600);
      return remaining;
    });
  };

  const handleUpdate = (id, newTitle) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, title: newTitle } : t));
  };

  const handleAddTask = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      setTasks(prev => [{ id: Date.now().toString(), title: inputValue, description: "这一页，由你亲手落笔", isGuide: false }, ...prev]);
      setInputValue('');
    }
  };

  useEffect(() => {
    if (step === 'final_text') setTimeout(() => setStep('breathing'), 3000);
    if (step === 'breathing') {
      const interval = setInterval(() => {
        setBreathSec(s => {
          if (s <= 1) { clearInterval(interval); setTimeout(() => setStep('sleep'), 1000); return 0; }
          return s - 1;
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [step]);

  return (
    <div style={styles.appBg}>
      <AnimatePresence mode="wait">
        {step === 'active' && (
          <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.mainWrapper}>
            <div style={styles.layoutWrapper}>
              <header style={{ marginBottom: '24px', display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <h1 style={{ fontSize: '42px', fontWeight: 900, color: '#1a1a1a', margin: 0 }}>翻篇</h1>
                <span style={{ fontSize: '18px', fontWeight: 200, color: '#cbd5e1', letterSpacing: '2px' }}>FLIP</span>
              </header>
              <p style={{ fontSize: '16px', color: '#94a3b8', marginBottom: '32px', fontStyle: 'italic' }}>“{dailyQuote}”</p>
              <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '160px' }} className="hide-scrollbar">
                <AnimatePresence>
                  {tasks.map(t => <FlipItem key={t.id} task={t} onAction={handleAction} onUpdate={handleUpdate} />)}
                </AnimatePresence>
              </div>
            </div>
            <div style={{ position: 'fixed', bottom: '40px', left: '24px', right: '24px', maxWidth: '400px', margin: '0 auto' }}>
              <input value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={handleAddTask} placeholder="此刻想翻篇什么？"
                style={{ width: '100%', padding: '22px 30px', borderRadius: '35px', border: '1px solid #f1f5f9', background: '#fff', fontSize: '17px', outline: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.06)' }}
              />
            </div>
          </motion.div>
        )}

        {step === 'final_text' && (
          <motion.div key="final" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: '22px', color: '#64748b', lineHeight: 2, fontWeight: 300 }}>辛苦了。<br/>所有的喧嚣都已落幕，<br/>这一页，已经彻底翻过去了。</p>
          </motion.div>
        )}

        {step === 'breathing' && (
          <motion.div key="breath" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 4, repeat: Infinity }} style={{ width: '250px', height: '250px', borderRadius: '50%', background: '#fff', filter: 'blur(80px)', position: 'absolute' }} />
            <span style={{ color: '#fff', fontSize: '100px', fontWeight: 100 }}>{breathSec}</span>
            <p style={{ color: '#666', marginTop: '100px', letterSpacing: '10px' }}>深呼吸</p>
          </motion.div>
        )}

        {step === 'sleep' && (
          <motion.div key="sleep" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'fixed', inset: 0, background: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>
            <h2 style={{ fontSize: '48px', fontWeight: 200, letterSpacing: '15px' }}>晚安</h2>
            <p style={{ color: '#888', marginTop: '20px', textAlign: 'center', padding: '0 40px' }}>{sleepQuote}</p>
            <button onClick={() => window.location.reload()} style={{ marginTop: '80px', color: '#fff', border: '1px solid #444', padding: '15px 40px', borderRadius: '30px', background: 'none' }}>开启新一页</button>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}