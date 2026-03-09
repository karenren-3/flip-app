import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const dailyQuotes = [
  "现在的这一页，值得你全神贯注地写。",
  "与其在旧账里内耗，不如在这一页落笔。",
  "翻过去，是为了腾出手来，握住新的可能。",
  "所有的未完待续，都抵不过此刻的'算了'。",
  "翻篇不是遗忘，而是更轻盈地出发。",
  "别让昨日的雨，淋湿今天的衣裳。",
  "当下的释怀，是给未来最好的礼物。",
  "每一个终点，都是另一个起点的伏笔。",
  "世界原本嘈杂，唯有翻篇瞬间最安静。",
  "与其追问过去，不如翻开序章。",
  "把烦恼留在旧页，把勇气带进新篇。",
  "允许一切发生，允许遗憾止于此页。",
  "你的生活不是用来复盘痛苦的，而是用来创造快乐的。",
  "翻开新的一页，你就是自己的作者。",
  "有些事不用解决，翻过去就消失了。",
  "此时此刻，你与旧事已毫无瓜葛。",
  "所有的内耗，本质上都是在拒绝翻页。",
  "停止在原地踏步，哪怕只是向后翻一页。",
  "这一页的句号，是为了下一页的惊叹号。",
  "清空了心里的积雪，春天才住得进来。",
  "你不需要完美，你只需要开始新的一页。",
  "遗憾是路标，但不是终点。",
  "在这张白纸上，没人能限制你的笔触。",
  "翻篇的瞬间，你已经赢了过去的自己。",
  "与其纠结错过的风景，不如期待前方的路。",
  "把心事交给晚风，把名字留在新页。",
  "每一个深呼吸，都是一次微型的翻篇。",
  "世界很大，别总在这一页打转。",
  "放下笔，此刻的空白也是一种圆满。",
  "明天怎样，且等来者；今日种种，至此而终。",
  "翻过这一页，你会发现星光依旧。"
];

const feedbackPool = ["释怀", "放下", "新生", "圆满", "过关", "翻篇"];

const styles = {
  appBg: {
    height: '100dvh',
    width: '100vw',
    backgroundColor: '#fcfcfd',
    position: 'fixed',
    inset: 0,
    fontFamily: '-apple-system, sans-serif',
    overflow: 'hidden'
  },
  mainWrapper: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '40px 24px 0',
  },
  layoutWrapper: {
    maxWidth: '400px',
    margin: '0 auto',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
    flexShrink: 0
  },
  title: {
    fontSize: '42px',
    fontWeight: 900,
    color: '#1a1a1a',
    margin: 0,
    letterSpacing: '-2px'
  },
  enTitle: {
    fontSize: '18px',
    fontWeight: 200,
    color: '#cbd5e1',
    letterSpacing: '2px'
  },
  scrollArea: {
    flex: 1,
    overflowY: 'auto',
    paddingBottom: '140px',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
  },
  cardContainer: {
    position: 'relative',
    width: '100%',
    height: '140px',
    borderRadius: '35px',
    marginBottom: '16px',
    border: '1px solid rgba(255,255,255,0.9)',
    background: 'linear-gradient(135deg, rgba(45, 212, 191, 0.35) 0%, rgba(251, 146, 60, 0.1) 100%)',
    backdropFilter: 'blur(50px)',
    WebkitBackdropFilter: 'blur(50px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '0 32px',
    touchAction: 'pan-y',
    zIndex: 2
  }
};

const FlipItem = ({ task, onAction }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);
  const [phrase, setPhrase] = useState("");

  return (
    <motion.div layout style={{ position: 'relative', minHeight: '156px' }}>
      <AnimatePresence>
        {phrase && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '140px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#64748b',
              fontSize: '24px',
              fontWeight: 900,
              zIndex: 1
            }}
          >
            {phrase}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        drag
        dragConstraints={{ left: -300, right: 300, top: -500, bottom: 50 }}
        style={{
          x,
          y,
          opacity,
          ...styles.cardContainer
        }}
        onDragEnd={(_, info) => {
          if (Math.abs(info.offset.x) > 120 || info.offset.y < -120) {
            setPhrase(feedbackPool[Math.floor(Math.random() * feedbackPool.length)]);
            setTimeout(() => onAction(task.id), 400);
          } else {
            x.set(0);
            y.set(0);
          }
        }}
        exit={{
          y: -400,
          scale: 0.1,
          rotateZ: 10,
          opacity: 0,
          transition: { duration: 0.5 }
        }}
      >
        <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#1e293b', margin: '0 0 8px 0' }}>
          {task.title}
        </h3>
        <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
          {task.description}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default function App() {
  const [tasks, setTasks] = useState([
    { id: 'g1', title: "感受翻篇的细腻阻力", description: "向右滑动 · 圆满", isGuide: true },
    { id: 'g2', title: "每一页翻开，都有随机反馈", description: "向左滑动 · 释怀", isGuide: true },
    { id: 'g3', title: "划掉所有干扰，开启仪式", description: "向上滑动 · 翻篇", isGuide: true }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [step, setStep] = useState('active'); // active -> final_text -> breathing -> sleep
  const [breathSec, setBreathSec] = useState(3);

  const handleAction = (id) => {
    setTasks(prev => {
      const remaining = prev.filter(t => t.id !== id);
      if (remaining.length === 0) setTimeout(() => setStep('final_text'), 800);
      return remaining;
    });
  };

  const handleAddTask = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      setTasks(prev => [
        { id: Date.now().toString(), title: inputValue, description: "这一页，由你亲手落笔", isGuide: false },
        ...prev.filter(t => !t.isGuide)
      ]);
      setInputValue('');
    }
  };

  // 🌟 仪式流转逻辑
  useEffect(() => {
    if (step === 'final_text') {
      const timer = setTimeout(() => setStep('breathing'), 3500);
      return () => clearTimeout(timer);
    }
    if (step === 'breathing') {
      const interval = setInterval(() => {
        setBreathSec(s => {
          if (s <= 1) {
            clearInterval(interval);
            setTimeout(() => setStep('sleep'), 1500);
            return 0;
          }
          return s - 1;
        });
      }, 2500); // 慢速呼吸节奏
      return () => clearInterval(interval);
    }
  }, [step]);

  return (
    <div style={styles.appBg}>
      <AnimatePresence mode="wait">
        {step === 'active' && (
          <motion.div
            key="active"
            exit={{ opacity: 0 }}
            style={styles.mainWrapper}
          >
            <div style={styles.layoutWrapper}>
              <header style={styles.header}>
                <h1 style={styles.title}>翻篇</h1>
                <span style={styles.enTitle}>FLIP</span>
              </header>
              <p style={{ fontSize: '15px', color: '#94a3b8', marginBottom: '24px' }}>
                {dailyQuotes[new Date().getDate() % dailyQuotes.length]}
              </p>
              <div style={styles.scrollArea} className="hide-scrollbar">
                <AnimatePresence mode="popLayout">
                  {tasks.map(t => (
                    <FlipItem key={t.id} task={t} onAction={handleAction} />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div style={{
              position: 'fixed',
              bottom: '40px',
              left: '24px',
              right: '24px',
              maxWidth: '400px',
              margin: '0 auto'
            }}>
              <input
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleAddTask}
                placeholder="此刻想翻篇什么？"
                style={{
                  width: '100%',
                  padding: '20px 28px',
                  borderRadius: '32px',
                  border: 'none',
                  background: '#fff',
                  fontSize: '17px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                  outline: 'none'
                }}
              />
            </div>
          </motion.div>
        )}

        {step === 'final_text' && (
          <motion.div
            key="final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '40px'
            }}
          >
            <p style={{ fontSize: '22px', color: '#64748b', lineHeight: 2.2, fontWeight: 300 }}>
              辛苦了。<br/>
              所有的喧嚣都已落幕，<br/>
              这一页，已经彻底翻过去了。
            </p>
          </motion.div>
        )}

        {step === 'breathing' && (
          <motion.div
            key="breath"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: '#000',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.1, 0.4, 0.1]
              }}
              transition={{
                duration: 5,
                repeat: Infinity
              }}
              style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: '#fff',
                filter: 'blur(60px)',
                position: 'absolute'
              }}
            />
            <span style={{ color: '#fff', fontSize: '80px', fontWeight: 200, zIndex: 10, fontVariantNumeric: 'tabular-nums' }}>
              {breathSec}
            </span>
            <p style={{ color: '#555', marginTop: '120px', letterSpacing: '8px' }}>
              深 呼 吸
            </p>
          </motion.div>
        )}

        {step === 'sleep' && (
          <motion.div
            key="sleep"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: '#000',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#fff'
            }}
          >
            <h2 style={{ fontSize: '48px', fontWeight: 200, letterSpacing: '15px' }}>
              晚安
            </h2>
            <p style={{ color: '#666', marginTop: '20px', fontSize: '15px' }}>
              心头的猫毛捋顺了，去做个好梦吧。
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '80px',
                color: '#888',
                border: '1px solid #333',
                padding: '12px 35px',
                borderRadius: '25px',
                background: 'none',
                cursor: 'pointer'
              }}
            >
              明早见，开启新一页
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}
