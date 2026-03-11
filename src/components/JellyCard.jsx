import { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

export default function JellyCard({ task, onComplete, width = 340, height = 180 }) {
  const [isDismissed, setIsDismissed] = useState(false);

  const x = useMotionValue(0);

  // 1. 颜色与动感映射
  // 手指往右拉 (0 -> 200px)：
  // 卡片顺时针甩出去 (0 -> 10 度)
  const rotate = useTransform(x, [0, 200], [0, 10]);

  // 卷角从右上角反向斜切 (0 -> -60px)
  const foldX = useTransform(x, [0, 200], [0, -60]);

  // 卷角放大 (1 -> 1.8 倍)
  const foldScale = useTransform(x, [0, 200], [1, 1.8]);

  // 颜色从橙色渐变为紫色反馈 (0 -> 1)
  const purpleOpacity = useTransform(x, [0, 150], [0, 1]);

  const handleDragEnd = (_, info) => {
    // 判定翻篇成功阈值
    if (info.offset.x > 140) {
      if (navigator.vibrate) navigator.vibrate(40);
      setIsDismissed(true);
      // 给动画留出 500ms 的时间，让"灰飞烟灭"放完
      setTimeout(() => onComplete?.(task.id), 500);
    } else {
      x.set(0);
    }
  };

  return (
    <div style={{ position: 'relative', width, height, marginBottom: 25 }}>
      <AnimatePresence>
        {!isDismissed && (
          <motion.div
            style={{ width: '100%', height: '100%', x, rotate, cursor: 'grab', zIndex: 1 }}
            drag="x"
            dragConstraints={{ left: 0, right: 300 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            // --- 🌟 终极灰飞烟灭 (Exit Animation) ---
            exit={{
              x: 600,
              y: 50,           // 1. 甩向右下方
              opacity: 0,      // 2. 瞬间透明
              scale: 0.5,      // 3. 迅速缩小
              rotate: 60,      // 4. 加速旋转飞出
              filter: "blur(12px)", // 5. 瞬间高斯模糊 (灵魂所在)
              transition: {
                duration: 0.4,
                ease: "easeIn" // 400ms 完成，先慢后快
              }
            }}
          >
            {/* --- 卡片实体：果冻渐变回归 --- */}
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 32,
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 15px 35px rgba(0,0,0,0.06)',
                border: '1px solid rgba(255,255,255,0.8)'
              }}
            >
              {/* 【图层 1】：你最满意的果冻青绿与暖橙色 */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, #a7f3d0 0%, #fef3c7 100%)'
                }}
              />

              {/* 【图层 2】：滑动的紫色反馈 */}
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, #f06292 0%, #9c27b0 100%)',
                  opacity: purpleOpacity
                }}
              />

              {/* 【图层 3】：内容区 */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  pointerEvents: 'none'
                }}
              >
                <h3 style={{ margin: 0, fontSize: 19, color: '#1e293b', fontWeight: 900 }}>
                  {task.title}
                </h3>
                <p style={{ margin: '8px 0 0', fontSize: 14, color: '#475569', padding: '0 30px' }}>
                  {task.description}
                </p>
              </div>

              {/* === 🌟 卷边效果回归 === */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: -1,
                  right: -1,
                  width: 45,
                  height: 45,
                  // 手指拉动时，卷角反向移动、变大
                  x: foldX,
                  y: useTransform(x, [0, 200], [0, 60]),
                  scale: foldScale,
                  // 模拟折叠的纸背：纯白到浅灰的斜向渐变
                  background: 'linear-gradient(225deg, #ffffff 45%, #f1f5f9 50%, #e2e8f0 51%)',
                  boxShadow: '-4px 4px 10px rgba(0,0,0,0.08)',
                  borderBottomLeftRadius: 18,
                  zIndex: 10,
                  pointerEvents: 'none',
                  transformOrigin: 'top right'
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
