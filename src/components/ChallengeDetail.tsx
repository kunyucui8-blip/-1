/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MoreVertical, Coins, Plus, Sparkles, MapPin } from 'lucide-react';
import { Challenge } from '../types';

interface ChallengeDetailProps {
  challenge: Challenge;
  onBack: () => void;
  onOpenQuickSave: () => void;
  onUpdateChallenge: (id: string, updates: Partial<Challenge>) => void;
  onDeleteChallenge: (id: string) => void;
}

export default function ChallengeDetail({
  challenge,
  onBack,
  onOpenQuickSave,
  onUpdateChallenge,
  onDeleteChallenge
}: ChallengeDetailProps) {
  const percentage = Math.min(Math.round((challenge.current / challenge.target) * 100), 100);
  const remainingValue = Math.max(challenge.target - challenge.current, 0);

  // States for Popup Dropdown & Modals
  const [showDropdown, setShowDropdown] = useState(false);
  const [editingField, setEditingField] = useState<'title' | 'target' | 'bannerQuote' | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Handle Edit Field Save
  const handleSaveEdit = () => {
    if (!editingField) return;
    
    if (editingField === 'title') {
      const trimmed = inputValue.trim();
      if (!trimmed) return;
      onUpdateChallenge(challenge.id, { title: trimmed });
    } else if (editingField === 'target') {
      const val = parseFloat(inputValue);
      if (isNaN(val) || val <= 0) return;
      const isFinished = challenge.current >= val;
      onUpdateChallenge(challenge.id, { 
        target: val,
        status: isFinished ? 'COMPLETED' : 'ACTIVE'
      });
    } else if (editingField === 'bannerQuote') {
      const trimmed = inputValue.trim();
      onUpdateChallenge(challenge.id, { bannerQuote: trimmed });
    }

    setEditingField(null);
    setInputValue('');
  };

  // Handle resets
  const handleConfirmReset = () => {
    onUpdateChallenge(challenge.id, {
      current: 0,
      status: 'ACTIVE',
      records: []
    });
    setShowResetConfirm(false);
  };

  // Handle delete
  const handleConfirmDelete = () => {
    onDeleteChallenge(challenge.id);
    setShowDeleteConfirm(false);
    onBack();
  };

  // Fallback default placeholder records if empty, matching Screen 4 layout
  const recordsToShow = challenge.records.length > 0 ? challenge.records : [
    {
      id: 'stat_1',
      title: '每周存入',
      date: 'Nov 12, 2023',
      amount: 200,
      iconType: 'default',
      category: '健康存钱挑战'
    },
    {
      id: 'stat_2',
      title: '奖励金',
      date: 'Nov 08, 2023',
      amount: 50,
      iconType: 'reward',
      category: '任务奖励'
    },
    {
      id: 'stat_3',
      title: '每月自动存',
      date: 'Nov 01, 2023',
      amount: 1000,
      iconType: 'piggy',
      category: '自动存入'
    }
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#FAF9F6] relative overflow-hidden">
      {/* Header Panel */}
      <div className="flex items-center justify-between px-4 py-4 bg-[#FAF9F6]/90 border-b border-brand-secondary/10 shrink-0 select-none">
        <button 
          id="btn-back-to-goals"
          onClick={onBack} 
          className="p-2 transition-transform hover:scale-110 active:scale-90 text-brand-dark/80 cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-brand-gold font-sans truncate max-w-[200px]">{challenge.title}</h1>
        
        {/* Dropsdown container */}
        <div className="relative" ref={dropdownRef}>
          <button 
            id="btn-challenge-more-dropdown" 
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 text-brand-dark hover:scale-105 active:scale-95 duration-150 cursor-pointer"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-brand-secondary/20 py-2 z-50 animate-in fade-in slide-in-from-top-3 duration-150">
              <button
                onClick={() => {
                  setEditingField('title');
                  setInputValue(challenge.title);
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2.5 text-xs font-medium text-[#3D3D3D]/90 hover:bg-brand-cream/50 transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <span>💬</span>
                <span>修改计划名称</span>
              </button>
              
              <button
                onClick={() => {
                  setEditingField('target');
                  setInputValue(String(challenge.target));
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2.5 text-xs font-medium text-[#3D3D3D]/90 hover:bg-brand-cream/50 transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <span>🎯</span>
                <span>修改目标金额</span>
              </button>

              <button
                onClick={() => {
                  setEditingField('bannerQuote');
                  setInputValue(challenge.bannerQuote);
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2.5 text-xs font-medium text-[#3D3D3D]/90 hover:bg-brand-cream/50 transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <span>✨</span>
                <span>修改计划寄语</span>
              </button>

              <hr className="border-t border-brand-secondary/10 my-1" />

              <button
                onClick={() => {
                  setShowResetConfirm(true);
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2.5 text-xs font-medium text-amber-600 hover:bg-amber-50/50 transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <span>🔄</span>
                <span>重置计划进度</span>
              </button>

              <button
                onClick={() => {
                  setShowDeleteConfirm(true);
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50/50 transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <span>🗑️</span>
                <span>删除此存钱计划</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Flow Content Container */}
      <div className="flex-1 px-5 space-y-6 pb-28 overflow-y-auto max-w-sm mx-auto w-full pt-3">
        {/* Visual Glass Jar Indicator Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-brand-secondary/15 relative flex flex-col items-center">
          {/* Badge Completeness on Top Right */}
          <div className="absolute top-4 right-4 bg-brand-primary/15 text-brand-gold rounded-full px-3 py-1 text-xs font-semibold flex items-center space-x-1 border border-brand-primary/10">
            <span>🏆</span>
            <span>{percentage}% 完成</span>
          </div>

          {/* Interactive Translucent Jar Frame */}
          <div className="w-40 h-52 relative mt-4 border-4 border-brand-secondary/30 rounded-[40px] rounded-t-[16px] overflow-hidden bg-white shadow-inner flex items-end justify-center">
            {/* The Liquid Reservoir with wave effects */}
            <div 
              style={{ height: `${percentage}%` }}
              className="absolute left-0 right-0 bottom-0 bg-[#FFB347] transition-all duration-700 ease-out flex items-center justify-center opacity-90 overflow-hidden"
            >
              {/* Wave Animated Overlays if state allows */}
              <div className="absolute w-[200%] h-[200%] left-[-50%] top-[-85%] rounded-[45%] bg-[#fff9c4]/15 waves-layer-1 liquid-wave-1"></div>
              <div className="absolute w-[200%] h-[200%] left-[-45%] top-[-80%] rounded-[40%] bg-white/10 waves-layer-2 liquid-wave-2"></div>
              
              {/* Gold Sprout Core Glow inside Jar */}
              <div className="text-white/40 font-bold z-10 bottom-4 absolute text-xs font-serif italic tracking-wide animate-pulse">
                SACH
              </div>
            </div>

            {/* Glowing Sprout inside fluid when completed */}
            {percentage >= 100 && (
              <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-[#fff9c4] animate-bounce z-10" />
            )}
          </div>

          {/* Money status values underneath */}
          <div className="text-center mt-5 space-y-0.5">
            <h2 className="text-[32px] font-bold text-brand-gold tracking-tight font-mono">
              ¥{challenge.current.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </h2>
            <p className="text-xs text-brand-dark/50 uppercase tracking-widest font-sans">当前存钱</p>
          </div>
        </div>

        {/* Dual Metric Storage Boxes */}
        <div className="grid grid-cols-2 gap-4">
          {/* Left Block: Goal Target */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-brand-secondary/15 space-y-1">
            <span className="text-xs text-zinc-450 font-sans block text-zinc-400">目标</span>
            <span className="text-lg font-bold text-brand-gold font-mono">
              ¥{challenge.target.toLocaleString('zh-CN', { minimumFractionDigits: 0 })}
            </span>
          </div>

          {/* Right Block: Remaining with left red bar indicator */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-brand-secondary/15 space-y-1 border-l-4 border-l-rose-600 pl-3">
            <span className="text-xs text-zinc-450 font-sans block text-zinc-400">剩余</span>
            <span className="text-lg font-bold text-rose-600 font-mono">
              ¥{remainingValue.toLocaleString('zh-CN', { minimumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        {/* Challenge History Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-base font-bold text-brand-dark">存钱历史</h3>
            <span className="text-xs text-zinc-400 font-medium font-sans">累计已存 {challenge.records.length} 次</span>
          </div>

          {/* List of savings entries */}
          <div className="space-y-3">
            {recordsToShow.map((item, index) => {
              // Custom beige/sage palettes that match Screen 4 perfectly
              let circleColor = 'bg-[#ffe4cc]';
              if (item.title === '奖励金' || item.iconType === 'reward') {
                circleColor = 'bg-[#e0edd3]';
              } else if (item.title === '每月自动存' || item.iconType === 'piggy') {
                circleColor = 'bg-[#ffebd6]';
              }

              return (
                <div 
                  key={item.id || index}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-brand-secondary/10 flex items-center justify-between transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div className="flex items-center space-x-3.5">
                    {/* Circle badge */}
                    <div className={`w-10 h-10 rounded-full ${circleColor} flex items-center justify-center font-bold text-[#845400] text-sm shadow-inner`}>
                      {item.title === '每月自动存' ? '💳' : item.title === '奖励金' ? '✨' : '💰'}
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-sm font-semibold text-brand-gold">{item.title}</div>
                      <div className="text-xs text-zinc-400 font-sans">{item.date}</div>
                    </div>
                  </div>
                  <div className="text-base font-bold text-brand-gold font-mono">
                    +¥{item.amount.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scenic Location Lake Banner Overlay */}
        <div className="relative rounded-[24px] overflow-hidden shadow-md h-40 border border-brand-secondary/15 group">
          <img 
            src={challenge.bannerImage}
            alt={challenge.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {/* Black gradient mask for high typography contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          
          <div className="absolute bottom-4 left-4 text-white space-y-1">
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-primary" />
              <span className="text-[11px] font-sans tracking-widest text-[#FFF9C4]/90">DESTINATION</span>
            </div>
            <h4 className="text-lg font-bold text-[#fcfcfc] tracking-wide">{challenge.bannerQuote}</h4>
          </div>
        </div>
      </div>

      {/* Floating Bottom action button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6]/95 to-transparent z-15 flex justify-center">
        <button
          id="btn-detail-save-now-cta"
          onClick={onOpenQuickSave}
          className="w-full max-w-sm py-4 bg-brand-primary hover:bg-[#ffaa33] text-[#FAF9F6] text-center font-semibold rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-brand-primary/15 transition-all outline-none duration-150 active:scale-95 cursor-pointer"
        >
          <div className="bg-[#FAF9F6]/20 rounded-full p-0.5 text-[#fff9c4]">
            <Plus className="w-4 h-4 text-white" />
          </div>
          <span>现在存钱</span>
        </button>
      </div>

      {/* --- Action Modals --- */}
      
      {/* 1. Edit Input Modal (Title, Target, or Quote) */}
      {editingField && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99] flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-sm w-full p-6 shadow-2xl border border-brand-secondary/20 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-brand-gold mb-1">
              {editingField === 'title' && '修改计划名称'}
              {editingField === 'target' && '修改计划目标金额'}
              {editingField === 'bannerQuote' && '修改计划梦想寄语'}
            </h3>
            <p className="text-xs text-zinc-400 mb-4 font-sans">
              {editingField === 'title' && '请输入该存钱计划的新标题名称：'}
              {editingField === 'target' && '请输入需要达成的目标数额（必须大于0）：'}
              {editingField === 'bannerQuote' && '写下一句给自己充满正能量的筑梦宣言配文：'}
            </p>
            
            <input
              type={editingField === 'target' ? 'number' : 'text'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-4 py-3 border border-brand-secondary/35 rounded-xl bg-[#FAF9F6] text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder:text-zinc-400 font-sans mb-5"
              autoFocus
              placeholder={editingField === 'target' ? '例如 5000' : '请输入内容...'}
            />

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setEditingField(null);
                  setInputValue('');
                }}
                className="flex-1 py-3 border border-brand-secondary/30 rounded-xl text-center text-sm font-medium text-brand-dark/80 hover:bg-brand-cream/40 transition cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={editingField === 'title' && !inputValue.trim()}
                className="flex-1 py-3 bg-brand-primary hover:bg-[#ffaa33] disabled:opacity-50 text-[#FAF9F6] rounded-xl text-center text-sm font-semibold transition active:scale-95 cursor-pointer"
              >
                确认保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Reset Progress Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99] flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-sm w-full p-6 shadow-2xl border border-brand-secondary/20">
            <h3 className="text-lg font-bold text-brand-gold mb-1">🔄 重置存钱进度？</h3>
            <p className="text-xs text-zinc-500 mb-5 font-sans leading-relaxed">
              确定要清空当前已经存下的 <span className="font-bold text-amber-700">¥{challenge.current}</span> 吗？此操作不可撤销，且会清除属于本项挑战下的所有历史存钱明细。
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 border border-brand-secondary/30 rounded-xl text-center text-sm font-medium text-brand-dark/80 hover:bg-brand-cream/40 transition cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmReset}
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-center text-sm font-semibold transition active:scale-95 cursor-pointer"
              >
                确认重置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Delete Plan Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99] flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-sm w-full p-6 shadow-2xl border border-brand-secondary/20">
            <h3 className="text-lg font-bold text-rose-700 mb-1">🗑️ 删除存钱计划？</h3>
            <p className="text-xs text-zinc-500 mb-5 font-sans leading-relaxed">
              真的要永久删除【<span className="font-bold text-brand-gold">{challenge.title}</span>】计划吗？删除后此计划的数据将不可恢复。
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 border border-[#ebd5bc]/30 rounded-xl text-center text-sm font-medium text-brand-dark/80 hover:bg-brand-cream/40 transition cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-center text-sm font-semibold transition active:scale-95 cursor-pointer"
              >
                确认永久删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
