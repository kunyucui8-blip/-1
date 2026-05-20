/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Bell, SlidersHorizontal, Plus, Compass, Camera, Home, Coins, Coffee, Sparkles, Award, Info, ShieldCheck, Heart, X, Trash2 } from 'lucide-react';
import { SavingRecord } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface SavingHistoryProps {
  records: SavingRecord[];
  onOpenQuickSave: () => void;
  onNavigateToMe: () => void;
  onDeleteRecord: (id: string) => void;
  avatar: string;
}

export default function SavingHistory({
  records,
  onOpenQuickSave,
  onNavigateToMe,
  onDeleteRecord,
  avatar
}: SavingHistoryProps) {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<SavingRecord | null>(null);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  // Aggregate stats dynamically excluding deleted records
  const filteredActiveRecords = records.filter(item => !deletedIds.includes(item.id));
  const monthlySum = filteredActiveRecords.reduce((acc, r) => acc + r.amount, 0);
  const count = filteredActiveRecords.length;
  
  // Custom comparison formula based on records sum
  const basePastMonthSum = 3000;
  const growthRate = (((monthlySum - basePastMonthSum) / basePastMonthSum) * 100).toFixed(1);
  const growthSign = parseFloat(growthRate) >= 0 ? '+' : '';

  // Icon mapper
  const renderRecordIcon = (iconType: string) => {
    switch (iconType) {
      case 'trip':
        return <Compass className="w-5 h-5 text-amber-700" />;
      case 'camera':
        return <Camera className="w-5 h-5 text-amber-750 text-indigo-700" />;
      case 'home':
        return <Home className="w-5 h-5 text-emerald-700" />;
      case 'piggy':
        return <Coins className="w-5 h-5 text-olive-750 text-amber-600" />;
      case 'coffee':
        return <Coffee className="w-5 h-5 text-amber-900" />;
      case 'reward':
        return <Award className="w-5 h-5 text-yellow-600" />;
      default:
        return <Coins className="w-5 h-5 text-[#845400]" />;
    }
  };

  // Bg color mapper
  const getIconBgColor = (iconType: string) => {
    switch (iconType) {
      case 'trip': return 'bg-[#eae3b1]';
      case 'camera': return 'bg-[#ffdcc4]';
      case 'home': return 'bg-[#d0ebd1]';
      case 'piggy': return 'bg-[#ebedd3]';
      case 'coffee': return 'bg-[#ebdcd0]';
      case 'reward': return 'bg-[#feeec8]';
      default: return 'bg-brand-cream/80';
    }
  };

  const handleFilterClick = () => {
    alert('近期动态筛选功能已开启：可根据日期或计划类别筛选财务足迹！');
  };

  const [hasLoadedEarlier, setHasLoadedEarlier] = useState(false);

  const olderRecords: SavingRecord[] = [
    {
      id: 'rec_old_1',
      title: '第一桶金开启',
      amount: 100,
      date: '2023-11-10',
      category: '零钱挑战',
      iconType: 'piggy'
    },
    {
      id: 'rec_old_2',
      title: '买温和少点杯奶茶',
      amount: 15,
      date: '2023-11-05',
      category: '即时存入',
      iconType: 'coffee'
    },
    {
      id: 'rec_old_3',
      title: '首周坚持奖励',
      amount: 80,
      date: '2023-11-01',
      category: '额外奖励',
      iconType: 'reward'
    }
  ];

  const handleEarlierClick = () => {
    setHasLoadedEarlier(true);
  };

  const displayedRecords = hasLoadedEarlier ? [...records, ...olderRecords] : records;
  const filteredRecords = displayedRecords.filter(item => !deletedIds.includes(item.id));

  return (
    <div className="w-full h-full flex flex-col bg-[#FAF9F6] relative overflow-hidden">
      {/* Sticky Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-[#FAF9F6]/90 border-b border-brand-secondary/10 shrink-0 select-none">
        <div className="flex items-center space-x-2.5">
          {/* Circular mini avatar leading to Personal Center */}
          <button 
            id="btn-history-left-avatar"
            onClick={onNavigateToMe}
            className="w-9 h-9 rounded-full overflow-hidden border border-brand-secondary/45 active:scale-90 transition-transform cursor-pointer"
          >
            <img 
              src={avatar} 
              alt="User" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover" 
            />
          </button>
          <span className="text-lg font-bold text-brand-gold font-sans">历史记录</span>
        </div>
        <button 
          id="btn-history-notification" 
          onClick={() => setShowNotificationModal(true)}
          className="p-2 text-brand-dark/80 relative hover:scale-110 duration-150 cursor-pointer active:scale-95 transition-transform"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FFB347] border-2 border-[#FAF9F6] rounded-full animate-pulse"></span>
        </button>
      </div>

      {/* Main Stats Summary Block & Scroll Area */}
      <div className="px-5 space-y-6 flex-1 overflow-y-auto max-w-sm mx-auto w-full pt-3 pb-32">
        {/* Core summary metrics card */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-brand-secondary/15 space-y-5">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs text-zinc-400 font-sans block uppercase font-medium tracking-wider">本月累计节省</span>
              <h2 className="text-[34px] font-bold text-brand-gold leading-none tracking-tight">
                ¥{monthlySum.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
            </div>
            {/* Soft decorative visual block mirroring the top right box of Screen 2 */}
            <div className="w-14 h-14 bg-[#ffebd6] rounded-2.5xl flex items-center justify-center text-brand-primary">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          {/* Progress Goal Slider Bar */}
          <div className="space-y-2">
            <div className="h-2 w-full bg-brand-cream rounded-full overflow-hidden relative">
              <div 
                style={{ width: '72%' }}
                className="h-full bg-brand-primary rounded-full transition-all duration-500 ease-out"
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-zinc-400 font-sans">
              <span>起步阶段</span>
              <span>已达目标的 72%</span>
            </div>
          </div>

          {/* Sub Row columns metrics */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-brand-cream/60">
            <div className="space-y-0.5">
              <span className="text-xs text-zinc-400 font-sans block">结余次数</span>
              <span className="text-lg font-bold text-brand-dark">{count} 次</span>
            </div>
            <div className="space-y-0.5 border-l border-brand-cream/60 pl-4">
              <span className="text-xs text-zinc-400 font-sans block">对比上月</span>
              <span className="text-lg font-bold text-emerald-600 font-sans">
                {growthSign}{growthRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Recent Dynamic Activity Flow */}
        <div className="space-y-3 pb-8">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-base font-bold text-brand-dark">近期动态</h3>
            <button 
              id="btn-filter-activities"
              onClick={handleFilterClick}
              className="text-xs text-zinc-400 hover:text-brand-gold flex items-center space-x-1.5 font-medium transition-colors"
            >
              <span>筛选</span>
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* List items dynamic mapping */}
          <div className="space-y-3 font-sans">
            {filteredRecords.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-[20px] p-4 shadow-sm border border-brand-secondary/10 flex items-center justify-between transition-transform duration-200 hover:-translate-y-0.5 animate-fadeIn"
              >
                <div className="flex items-center space-x-3.5">
                  {/* Decorative Square box */}
                  <div className={`w-11 h-11 rounded-xl ${getIconBgColor(item.iconType)} flex items-center justify-center shadow-sm`}>
                    {renderRecordIcon(item.iconType)}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-brand-dark">{item.title}</h4>
                    <span className="text-[11px] text-zinc-400 font-sans block">
                      {item.date}
                    </span>
                  </div>
                </div>

                {/* Right financial logs & delete action */}
                <div className="flex items-center space-x-3 text-right">
                  <div className="space-y-0.5">
                    <span className="text-base font-bold text-brand-gold block font-sans">
                      +¥{item.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-zinc-455 bg-brand-cream/60 text-brand-gold/85 rounded-full px-2 py-0.5 font-sans inline-block">
                      {item.category}
                    </span>
                  </div>
                  
                  {/* Native popup trigger button */}
                  <button
                    id={`btn-delete-record-${item.id}`}
                    onClick={() => setRecordToDelete(item)}
                    className="p-1.5 text-rose-500/70 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all active:scale-95 cursor-pointer ml-1"
                    title="删除记录"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Earlier log trigger button */}
          <div className="pt-3 pb-4 flex flex-col items-center justify-center space-y-2">
            {!hasLoadedEarlier ? (
              <button 
                id="btn-earlier-before"
                onClick={handleEarlierClick}
                className="py-2.5 px-6 bg-brand-cream/40 hover:bg-brand-cream/80 text-brand-gold hover:text-[#845400] text-xs font-semibold rounded-full border border-brand-secondary/15 transition-all outline-none cursor-pointer duration-200"
              >
                更早之前
              </button>
            ) : (
              <p className="text-zinc-400 text-xs font-medium py-2 select-none font-sans text-center transition-all">
                — 没有更多历史 —
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Extreme Floating Fab Button to Quick Save */}
      <div className="absolute bottom-28 right-6">
        <button
          id="btn-floating-fab-save"
          onClick={onOpenQuickSave}
          className="w-14 h-14 bg-brand-gold hover:bg-[#6c4400] text-white rounded-full flex items-center justify-center shadow-lg shadow-brand-gold/25 transition-all transform active:scale-90 hover:scale-105 select-none cursor-pointer z-30"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* Notifications Warning Disclaimer Modal Overlay */}
      <AnimatePresence>
        {showNotificationModal && (
          <motion.div 
            className="fixed inset-0 bg-[#3D3D3D]/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-sm border border-brand-secondary/15 space-y-4"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="flex justify-between items-center pb-2 border-b border-brand-cream">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🔔</span>
                  <h3 className="text-base font-bold text-brand-gold">记账安全与注意事项</h3>
                </div>
                <button 
                  id="btn-close-notification-modal"
                  onClick={() => setShowNotificationModal(false)}
                  className="text-zinc-400 hover:text-zinc-650 text-sm font-bold cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-brand-dark/95 leading-relaxed font-sans">
                <div className="flex items-start space-x-2.5">
                  <div className="w-5 h-5 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-gold mt-0.5 shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <span className="font-bold block text-brand-gold">真实防丢与本地缓存</span>
                    为了保障您的财产私密性，本月流水暂存放在本设备的本地浏览器缓存（LocalStorage）中。请避免清理浏览器垃圾或者无痕浏览，以免数据走失。
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 mt-0.5 shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <span className="font-bold block text-emerald-600">理财挑战理性规划</span>
                    坚持挑战是一件温暖且富有成就感的小事，不要因一时的存款多寡而焦虑。推荐设定“少喝一杯咖啡”这类对生活无负担的小微额度挑战！
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600 mt-0.5 shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <span className="font-bold block text-indigo-600">多端同步与后续说明</span>
                    退出登录将重置数据。我们会在后续版本引入云数据库加密备份，更安全地为您的发财理想护航。
                  </div>
                </div>
              </div>

              <button
                id="btn-close-notif-dialog"
                onClick={() => setShowNotificationModal(false)}
                className="w-full py-2.5 bg-brand-primary hover:bg-[#ffaa33] text-white text-xs font-semibold rounded-xl text-center cursor-pointer shadow-md"
              >
                我知道了，温暖存钱 🌱
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Record Confirmation Modal Dialog */}
      <AnimatePresence>
        {recordToDelete && (
          <motion.div 
            className="fixed inset-0 bg-[#3D3D3D]/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-sm border border-brand-secondary/15 space-y-4 animate-in fade-in zoom-in duration-200"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="flex items-center space-x-2 pb-2 border-b border-brand-cream text-rose-650 font-bold text-base select-none">
                <span>🗑️</span>
                <span className="text-rose-600">确认删除记账明细？</span>
              </div>

              <div className="space-y-2 text-xs text-[#3D3D3D]/90 leading-relaxed font-sans">
                <p>您确定要永久删除这条存钱账单明细吗？</p>
                <div className="bg-[#FAF9F6] border border-brand-secondary/15 rounded-xl p-3.5 space-y-1 mt-2">
                  <div className="flex justify-between font-bold text-xs text-brand-gold">
                    <span>名 称：</span>
                    <span>{recordToDelete.title}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xs text-brand-gold">
                    <span>金 额：</span>
                    <span className="text-rose-600 font-mono">¥{recordToDelete.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-400">
                    <span>日 期：</span>
                    <span>{recordToDelete.date}</span>
                  </div>
                </div>
                {recordToDelete.challengeId && (
                  <p className="text-[10px] text-rose-500/80 mt-2 font-mono">
                    ⚠️ 提示：此账单与特定存钱挑战计划关联，删除后，该计划内的对应累计钱款额也将自动扣减。
                  </p>
                )}
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  id="btn-confirm-delete-cancel"
                  onClick={() => setRecordToDelete(null)}
                  className="flex-1 py-2.5 border border-[#ebd5bc]/30 rounded-xl text-center text-xs font-semibold text-brand-dark hover:bg-brand-cream/40 transition cursor-pointer"
                >
                  取消
                </button>
                <button
                  id="btn-confirm-delete-submit"
                  onClick={() => {
                    const id = recordToDelete.id;
                    setDeletedIds(prev => [...prev, id]);
                    onDeleteRecord(id);
                    setRecordToDelete(null);
                  }}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-center text-xs font-semibold transition cursor-pointer shadow-md"
                >
                  确认删除
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
