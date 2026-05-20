/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Target, Award, Plus, Compass, Sparkles, Flame, CheckCircle, Info, Landmark } from 'lucide-react';
import { Challenge } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ChallengesListProps {
  challenges: Challenge[];
  onSelectChallenge: (id: string) => void;
  onSelectCompletedChallenge: (id: string) => void;
  onAddChallenge: (title: string, target: number, bannerImage: string, bannerQuote: string) => void;
}

export default function ChallengesList({
  challenges,
  onSelectChallenge,
  onSelectCompletedChallenge,
  onAddChallenge
}: ChallengesListProps) {
  const [filter, setFilter] = useState<'ACTIVE' | 'COMPLETED'>('ACTIVE');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [selectedPresetImage, setSelectedPresetImage] = useState(0);

  const presetImages = [
    {
      url: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&q=80&w=800',
      quote: '洱海的梦想...'
    },
    {
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
      quote: '安稳而可靠的家...'
    },
    {
      url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
      quote: '留住所有美好的瞬间...'
    },
    {
      url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=800',
      quote: '向大自然出发...'
    }
  ];

  const activeChallenges = challenges.filter(c => c.status === 'ACTIVE');
  const completedChallenges = challenges.filter(c => c.status === 'COMPLETED');

  const filtered = filter === 'ACTIVE' ? activeChallenges : completedChallenges;

  const handleCreate = () => {
    if (!newTitle.trim()) {
      alert('请输入你要发起的存钱目标名称！');
      return;
    }
    const targetNum = parseFloat(newTarget);
    if (isNaN(targetNum) || targetNum <= 0) {
      alert('请输入有效的存钱目标金额！');
      return;
    }

    const img = presetImages[selectedPresetImage];
    onAddChallenge(newTitle, targetNum, img.url, img.quote);
    
    // Reset Form
    setNewTitle('');
    setNewTarget('');
    setShowAddModal(false);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#FAF9F6] relative overflow-hidden">
      {/* Header Panel */}
      <div className="flex items-center justify-between px-4 py-4 bg-[#FAF9F6]/90 border-b border-brand-secondary/10 shrink-0 select-none">
        <div className="flex items-center space-x-2">
          {/* Logo element resembling top banner header */}
          <div className="w-8 h-8 rounded-full bg-brand-primary/15 flex items-center justify-center text-brand-gold font-bold">
            🌱
          </div>
          <span className="text-lg font-bold text-brand-gold font-sans">我的存钱挑战</span>
        </div>
        <button 
          id="btn-trigger-add-challenge"
          onClick={() => setShowAddModal(true)}
          className="bg-brand-gold hover:bg-[#6c4400] text-white rounded-full p-2 active:scale-95 transition-transform flex items-center justify-center shadow-md shadow-brand-gold/15 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Tabs & Scroll Area */}
      <div className="px-5 space-y-5 flex-1 overflow-y-auto max-w-sm mx-auto w-full pt-3 pb-32">
        {/* Toggle options buttons */}
        <div className="flex bg-brand-cream/65 rounded-xl p-1 shadow-inner border border-brand-secondary/15 select-none">
          <button
            id="tab-toggle-active-challenges"
            onClick={() => setFilter('ACTIVE')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-center ${
              filter === 'ACTIVE'
                ? 'bg-white text-brand-gold shadow-sm'
                : 'text-zinc-400 hover:text-brand-gold'
            }`}
          >
            进行中 ({activeChallenges.length})
          </button>
          <button
            id="tab-toggle-completed-challenges"
            onClick={() => setFilter('COMPLETED')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-center ${
              filter === 'COMPLETED'
                ? 'bg-white text-brand-gold shadow-sm'
                : 'text-zinc-400 hover:text-brand-gold'
            }`}
          >
            已达成 ({completedChallenges.length})
          </button>
        </div>

        {/* Informative tips box */}
        <div className="bg-white/40 border border-brand-secondary/10 rounded-2xl p-4 flex items-start space-x-3 backdrop-blur-sm select-none">
          <Info className="w-4 h-4 text-brand-primary mt-0.5 shrink-0" />
          <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
            存钱是一种温和的力量，无需自我苛责，在日常的点滴里攒下未来的温度。点击对应卡片即可查看或开启快速存入哦 💗
          </p>
        </div>

        {/* Challenges Grid Cards list */}
        <div className="space-y-4 pb-12">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const currentPercent = Math.min(Math.round((item.current / item.target) * 100), 100);
              
              return (
                <div
                  id={`card-challenge-item-${item.id}`}
                  key={item.id}
                  onClick={() => filter === 'ACTIVE' ? onSelectChallenge(item.id) : onSelectCompletedChallenge(item.id)}
                  className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-md border border-brand-secondary/15 transition-all cursor-pointer duration-300 transform hover:-translate-y-1 relative"
                >
                  {/* Goal Photo container */}
                  <div className="h-32 relative">
                    <img 
                      src={item.bannerImage} 
                      alt={item.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    <div className="absolute bottom-3 left-4 text-white text-left">
                      <h4 className="text-lg font-bold text-[#fafaf9] tracking-wide">{item.title}</h4>
                      <p className="text-[10px] text-[#fff9c4] opacity-90 font-sans italic">{item.bannerQuote}</p>
                    </div>

                    {/* Progress Badge Indicator */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full py-0.5 px-2.5 text-[10px] text-[#845400] font-bold border border-brand-secondary/25 shadow-sm">
                      {filter === 'ACTIVE' ? `${currentPercent}% 进行中` : '🎉 已圆满达成'}
                    </div>
                  </div>

                  {/* Savings Data metrics columns */}
                  <div className="p-5 space-y-3 font-sans">
                    <div className="flex justify-between text-xs text-zinc-455">
                      <div>
                        <span className="text-zinc-400">当前：</span>
                        <span className="font-bold text-brand-gold text-sm">
                          ¥{item.current.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-zinc-400">目标：</span>
                        <span className="font-medium text-brand-dark">
                          ¥{item.target.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Miniature Progress bar */}
                    <div className="w-full h-1.5 bg-brand-cream rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${currentPercent}%` }}
                        className={`h-full rounded-full transition-all duration-500 ease-out ${
                          filter === 'ACTIVE' ? 'bg-brand-primary' : 'bg-emerald-500'
                        }`}
                      ></div>
                    </div>

                    <div className="flex justify-between text-[10px] text-zinc-400">
                      <span>已加入记账 {item.joinedDays} 天</span>
                      {filter === 'ACTIVE' ? (
                        <span className="text-[#845400] font-medium flex items-center gap-0.5">
                          还需 ¥{(item.target - item.current).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-medium">查看光荣战报 &gt;</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-zinc-400 space-y-2">
              <Landmark className="w-10 h-10 mx-auto text-brand-secondary/45" />
              <p className="text-xs">暂无符合条件的存钱目标计划账户，快去发起挑战吧！</p>
            </div>
          )}
        </div>
      </div>

      {/* Add New Challenge Modal popup dialog */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            className="fixed inset-0 bg-[#3D3D3D]/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-sm border border-brand-secondary/15 space-y-4 text-left"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="flex justify-between items-center pb-2 border-b border-brand-cream">
                <h3 className="text-base font-bold text-brand-gold">发起新大挑战</h3>
                <button 
                  id="btn-close-add-challenge"
                  onClick={() => setShowAddModal(false)}
                  className="text-zinc-400 hover:text-zinc-650 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Form Input fields */}
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brand-gold">挑战计划名称</label>
                  <input
                    id="input-new-challenge-title"
                    type="text"
                    placeholder="如：马尔代夫冲浪基金、我的小家..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-brand-cream/40 border border-brand-secondary/25 rounded-lg py-2 px-3 text-xs text-brand-dark focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brand-gold">攒钱目标额度 (¥)</label>
                  <input
                    id="input-new-challenge-target"
                    type="number"
                    placeholder="如：5000"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    className="w-full bg-brand-cream/40 border border-brand-secondary/25 rounded-lg py-2 px-3 text-xs text-brand-dark focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  />
                </div>

                {/* Cover presets visual */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brand-gold block">选择梦想视觉画幅</label>
                  <div className="grid grid-cols-4 gap-2">
                    {presetImages.map((img, idx) => (
                      <button
                        id={`btn-preset-image-${idx}`}
                        key={idx}
                        type="button"
                        onClick={() => setSelectedPresetImage(idx)}
                        className={`h-12 rounded-lg overflow-hidden border-2 transition-all relative ${
                          selectedPresetImage === idx
                            ? 'border-brand-primary scale-95 shadow-md'
                            : 'border-transparent'
                        }`}
                      >
                        <img 
                          src={img.url} 
                          alt="Preset" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                        {selectedPresetImage === idx && (
                          <div className="absolute inset-0 bg-brand-primary/10 flex items-center justify-center">
                            <span className="text-[10px] text-white bg-brand-gold rounded-full w-4 h-4 flex items-center justify-center">✓</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit panel buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  id="btn-cancel-create-goal"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 bg-brand-cream hover:bg-brand-cream/80 text-brand-gold text-xs font-semibold rounded-lg text-center"
                >
                  取消
                </button>
                <button
                  id="btn-confirm-create-goal"
                  onClick={handleCreate}
                  className="flex-1 py-2 bg-brand-primary hover:bg-[#ffaa33] text-white text-xs font-semibold rounded-lg text-center"
                >
                  发起梦想
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
