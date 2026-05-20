/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bell, Trophy, Star, ChevronRight, Settings, MessageSquare, Award, LogOut, Check, Pencil, Camera, X, ArrowLeft, Share2, Shield, Lock, Unlock, Eye, EyeOff, HelpCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface Achievement {
  id: string;
  title: string;
  desc: string;
  requirement: string;
  status: 'unlocked' | 'locked';
  emoji: string;
  color: string;
  borderColor: string;
  iconColor: string;
  achievedDate?: string;
  tip: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'perseverance',
    title: '坚持达人',
    desc: '在温暖的存钱日子里，意志坚如磐石。',
    requirement: '连续 30 天打卡存钱',
    status: 'unlocked',
    emoji: '🏆',
    color: 'bg-[#fdf2df] text-[#845400]',
    borderColor: 'border-amber-300/40',
    iconColor: 'text-[#845400]',
    achievedDate: '2026-03-12',
    tip: '点滴积累汇成大海，您已连续打卡坚持成功！'
  },
  {
    id: 'goal_achiever',
    title: '目标达成者',
    desc: '恭喜您完成了人生中首个温馨存钱目标的圆满达成。',
    requirement: '完成首个存钱目标 100%',
    status: 'unlocked',
    emoji: '⭐',
    color: 'bg-emerald-500/10 text-emerald-700',
    borderColor: 'border-emerald-300/40',
    iconColor: 'text-emerald-600',
    achievedDate: '2026-04-18',
    tip: '首发必中，梦想照进现实的第一步，继续加油！'
  },
  {
    id: 'savings_rookie',
    title: '存钱新秀',
    desc: '万丈高楼平地起，财富雪球在这里开始慢慢滚大。',
    requirement: '明细累计存钱大于 ¥500',
    status: 'unlocked',
    emoji: '🌱',
    color: 'bg-blue-500/10 text-blue-700',
    borderColor: 'border-blue-300/40',
    iconColor: 'text-blue-500',
    achievedDate: '2026-05-01',
    tip: '已经跨过了500元储蓄门槛，理财习惯正在健康养成！'
  },
  {
    id: 'pathfinder',
    title: '理财筑路人',
    desc: '两线齐飞，多管齐下。有远见的您开始多元化规划您的财务未来。',
    requirement: '开启 2 个及更多存钱挑战',
    status: 'locked',
    emoji: '🗺️',
    color: 'bg-purple-100/40 text-purple-700',
    borderColor: 'border-purple-300/30',
    iconColor: 'text-purple-500',
    tip: '加油！同时开启多个梦想储备池，让未来预算路更明确。'
  },
  {
    id: 'golden_will',
    title: '黄金之意志',
    desc: '极致专注，超凡储蓄力。将自律内化成一种令人瞩目的生活本领。',
    requirement: '累计获得 1240 元虚拟收益奖励值',
    status: 'locked',
    emoji: '👑',
    color: 'bg-yellow-100/40 text-yellow-700',
    borderColor: 'border-yellow-300/30',
    iconColor: 'text-yellow-600',
    tip: '极致自律带来的丰硕果实，属于大富翁级别的终极储蓄荣耀！'
  }
];

interface PersonalCenterProps {
  profile: UserProfile;
  onUpdateName: (newName: string) => void;
  onUpdateAvatar: (newAvatar: string) => void;
  onNavigateToTab: (tab: 'CHALLENGES' | 'HISTORY' | 'ME') => void;
  onResetApp: () => void;
}

export default function PersonalCenter({
  profile,
  onUpdateName,
  onUpdateAvatar,
  onNavigateToTab,
  onResetApp
}: PersonalCenterProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [typedName, setTypedName] = useState(profile.name);
  const [reminderTime, setReminderTime] = useState('08:00');
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showLogOutDialog, setShowLogOutDialog] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  
  // Account Settings and Permission states as requested
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [isConfidentialMode, setIsConfidentialMode] = useState(true); // Default matching "保密中"
  const [isAchievementsPublic, setIsAchievementsPublic] = useState(false);
  const [isSecretLock, setIsSecretLock] = useState(true);
  const [isAutoSync, setIsAutoSync] = useState(true);
  const [isTouchIDSim, setIsTouchIDSim] = useState(true);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2000);
  };

  const handleSaveName = () => {
    if (!typedName.trim()) {
      triggerToast('名字不能空着哦！');
      return;
    }
    onUpdateName(typedName);
    setIsEditingName(false);
    triggerToast('昵称更新成功 🌟');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onUpdateAvatar(reader.result);
          triggerToast('头像上传并更新成功 🎨');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFeedbackSubmit = () => {
    if (!feedbackText.trim()) {
      alert('请写点什么再提交反馈哦！');
      return;
    }
    setShowFeedbackModal(false);
    setFeedbackText('');
    triggerToast('感谢反馈！理财达人会尽快查看 💌');
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#FAF9F6] relative overflow-hidden">
      {/* Sticky Top Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-[#FAF9F6]/90 border-b border-brand-secondary/10 shrink-0 select-none">
        <div className="flex items-center space-x-2">
          {/* Mini Top image */}
          <div className="w-8 h-8 rounded-full overflow-hidden border border-brand-secondary/45">
            <img src={profile.avatar} alt="User Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          </div>
          <span className="text-lg font-bold text-brand-gold font-sans">存钱挑战</span>
        </div>
        <button 
          id="btn-personal-bell" 
          onClick={() => setShowNotificationModal(true)}
          className="p-2 text-brand-dark/80 relative cursor-pointer hover:scale-110 active:scale-95 duration-150 transition-transform"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FFB347] border-2 border-[#FAF9F6] rounded-full animate-pulse"></span>
        </button>
      </div>

      {/* Main Container Content & Scroll Area */}
      <div className="px-5 space-y-6 flex-1 overflow-y-auto max-w-sm mx-auto w-full pt-3 pb-32">
        {/* Dynamic User Profile Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-brand-secondary/15 relative flex flex-col items-center select-none">
          {/* Golden Avatar Border Frame */}
          <div className="relative mb-4 group cursor-pointer">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#FFB347] to-[#FFF9C4] flex items-center justify-center shadow-md">
              <div className="w-full h-full rounded-full overflow-hidden bg-brand-cream border-2 border-white">
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            
            <input 
              id="input-avatar-upload"
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="hidden" 
            />

            {/* Soft overlay camera button for change */}
            <button 
              id="btn-trigger-change-avatar"
              onClick={() => document.getElementById('input-avatar-upload')?.click()}
              className="absolute bottom-1 right-0 w-8 h-8 rounded-full bg-[#845400] text-white flex items-center justify-center shadow-md border-2 border-white hover:scale-110 active:scale-90 transition-transform cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User Name + Editing Input Option */}
          <div className="text-center w-full space-y-2">
            {isEditingName ? (
              <div className="flex items-center justify-center space-x-2 max-w-xs mx-auto">
                <input
                  id="input-user-edit-name"
                  type="text"
                  value={typedName}
                  maxLength={15}
                  onChange={(e) => setTypedName(e.target.value)}
                  className="bg-brand-cream/50 border border-brand-primary rounded-lg py-1 px-2 text-sm text-brand-dark text-center focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  autoFocus
                />
                <button 
                  id="btn-save-edited-name"
                  onClick={handleSaveName}
                  className="bg-emerald-500 text-white rounded-lg p-1 hover:bg-emerald-600 transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-1">
                <h2 className="text-xl font-bold text-brand-gold">{profile.name}</h2>
                <button 
                  id="btn-edit-user-name"
                  onClick={() => setIsEditingName(true)} 
                  className="p-1 text-zinc-400 hover:text-brand-gold transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Badge Indicator tag */}
            <div className="inline-block bg-brand-cream text-brand-gold/90 border border-brand-secondary/35 text-xs font-semibold rounded-full py-1 px-4 font-sans tracking-wide">
              已加入 {profile.joinedDays} 天
            </div>
          </div>
        </div>

        {/* Savings Achievement section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-base font-bold text-brand-dark">储蓄成就</h3>
            <button 
              id="btn-view-all-achievements"
              onClick={() => setShowAllAchievements(true)}
              className="text-xs text-[#845400] hover:text-[#ffaa33] font-bold pb-0.5 px-2 py-1 rounded hover:bg-brand-cream/40 transition active:scale-95 cursor-pointer"
            >
              查看全部
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Badge 1 - 坚持达人 */}
            <button
              id="badge-perseverance"
              onClick={() => {
                const badge = ACHIEVEMENTS.find(a => a.id === 'perseverance');
                if (badge) setSelectedAchievement(badge);
              }}
              className="bg-[#FAF9F6] border border-brand-secondary/15 rounded-2xl p-4 flex flex-col items-center text-center space-y-2 relative shadow-sm hover:shadow-md hover:border-amber-400/40 active:scale-95 transition-all text-left w-full cursor-pointer outline-none focus:ring-1 focus:ring-amber-400/30"
            >
              <div className="w-12 h-12 rounded-full bg-[#fdf2df] flex items-center justify-center text-amber-600">
                <Trophy className="w-6 h-6 text-[#845400]" />
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-brand-dark">坚持达人</div>
                <div className="text-xs text-zinc-455 font-sans text-zinc-400">连续存钱 30 天</div>
              </div>
            </button>

            {/* Badge 2 - 目标达成者 */}
            <button
              id="badge-goal-achiever"
              onClick={() => {
                const badge = ACHIEVEMENTS.find(a => a.id === 'goal_achiever');
                if (badge) setSelectedAchievement(badge);
              }}
              className="bg-[#FAF9F6] border border-brand-secondary/15 rounded-2xl p-4 flex flex-col items-center text-center space-y-2 relative shadow-sm hover:shadow-md hover:border-emerald-400/40 active:scale-95 transition-all text-left w-full cursor-pointer outline-none focus:ring-1 focus:ring-emerald-400/30"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <Star className="w-6 h-6 fill-emerald-600 text-emerald-600" />
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-brand-dark">目标达成者</div>
                <div className="text-xs text-zinc-455 font-sans text-zinc-400">完成首个目标</div>
              </div>
            </button>
          </div>
        </div>

        {/* List of Settings Options Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-brand-secondary/10 overflow-hidden divide-y divide-brand-cream select-none">
          {/* 我的挑战 */}
          <button
            id="btn-option-my-challenges"
            onClick={() => onNavigateToTab('CHALLENGES')}
            className="w-full py-4 px-5 flex items-center justify-between text-left hover:bg-brand-cream/20 transition-colors"
          >
            <div className="flex items-center space-x-3.5">
              <Award className="w-5 h-5 text-[#845400]" />
              <span className="text-sm font-semibold text-brand-gold">我的挑战</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-300" />
          </button>

          {/* 提醒设置 with dynamic clock */}
          <button
            id="btn-option-reminders"
            onClick={() => setShowReminderPicker(true)}
            className="w-full py-4 px-5 flex items-center justify-between text-left hover:bg-brand-cream/20 transition-colors"
          >
            <div className="flex items-center space-x-3.5">
              <Bell className="w-5 h-5 text-[#845400]" />
              <span className="text-sm font-semibold text-brand-gold">提醒设置</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-zinc-400 font-sans">每天 {reminderTime}</span>
              <ChevronRight className="w-4 h-4 text-zinc-300" />
            </div>
          </button>

          {/* 账号设置 */}
          <button
            id="btn-option-account-settings"
            onClick={() => setShowAccountSettings(true)}
            className="w-full py-4 px-5 flex items-center justify-between text-left hover:bg-brand-cream/20 transition-colors"
          >
            <div className="flex items-center space-x-3.5">
              <Settings className="w-5 h-5 text-[#845400]" />
              <span className="text-sm font-semibold text-brand-gold">账号设置</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold select-none ${
                isConfidentialMode 
                  ? 'bg-zinc-100 text-[#3D3D3D]/65 border border-zinc-200' 
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              }`}>
                {isConfidentialMode ? '🔒 保密模式' : '⚙️ 自定义权限'}
              </span>
              <ChevronRight className="w-4 h-4 text-zinc-300" />
            </div>
          </button>

          {/* 意见反馈 */}
          <button
            id="btn-option-feedback"
            onClick={() => setShowFeedbackModal(true)}
            className="w-full py-4 px-5 flex items-center justify-between text-left hover:bg-brand-cream/20 transition-colors"
          >
            <div className="flex items-center space-x-3.5">
              <MessageSquare className="w-5 h-5 text-[#845400]" />
              <span className="text-sm font-semibold text-brand-gold">意见反馈</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-300" />
          </button>
        </div>

        {/* Big Secondary Button Center exit log */}
        <div className="pt-4 pb-8 flex flex-col items-center">
          <button
            id="btn-option-logout"
            onClick={() => setShowLogOutDialog(true)}
            className="w-full py-3 border border-red-500/20 text-red-500 font-semibold rounded-xl text-center bg-transparent hover:bg-red-500/5 active:bg-red-500/10 transition-colors cursor-pointer"
          >
            退出登录
          </button>
        </div>
      </div>

      {/* Toast Alert Dialog overlay */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-[#3D3D3D] text-[#FAF9F6] text-xs font-semibold py-2.5 px-4 rounded-full shadow-lg z-50 flex items-center space-x-1.5 whitespace-nowrap"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reminder settings Modal overlay */}
      <AnimatePresence>
        {showReminderPicker && (
          <motion.div 
            className="fixed inset-0 bg-[#3D3D3D]/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-xs border border-brand-secondary/10 space-y-4"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3 className="text-base font-bold text-brand-gold">设置每天提醒时间</h3>
              <p className="text-xs text-zinc-400">我们将在此刻轻声呼唤您打卡记账 🕒</p>
              
              <input
                id="input-reminder-time"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full bg-brand-cream/50 border border-brand-secondary/35 rounded-lg py-2 px-3 text-brand-dark text-lg font-bold font-sans text-center select-none outline-none focus:border-brand-primary"
              />

              <div className="flex gap-2">
                <button
                  id="btn-cancel-reminder"
                  onClick={() => setShowReminderPicker(false)}
                  className="flex-1 py-2 bg-brand-cream hover:bg-brand-cream/80 text-brand-gold text-xs font-semibold rounded-lg text-center"
                >
                  取消
                </button>
                <button
                  id="btn-save-reminder"
                  onClick={() => {
                    setShowReminderPicker(false);
                    triggerToast(`提醒时间已设为每天 ${reminderTime} ⏰`);
                  }}
                  className="flex-1 py-2 bg-brand-primary hover:bg-[#ffaa33] text-white text-xs font-semibold rounded-lg text-center"
                >
                  保存
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback writing Modal overlay */}
      <AnimatePresence>
        {showFeedbackModal && (
          <motion.div 
            className="fixed inset-0 bg-[#3D3D3D]/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-xs border border-brand-secondary/15 space-y-4"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3 className="text-base font-bold text-brand-gold">提出意见反馈</h3>
              <p className="text-xs text-zinc-400">让我们听到你的声音，一同温暖向暖 ✨</p>
              
              <textarea
                id="textarea-feedback-content"
                rows={4}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="在此写下您的想法、建议或遇到的故障..."
                className="w-full bg-brand-cream/50 border border-brand-secondary/35 rounded-lg py-2 px-3 text-xs text-brand-dark placeholder-zinc-455 focus:outline-none focus:border-brand-primary"
              />

              <div className="flex gap-2">
                <button
                  id="btn-cancel-feedback"
                  onClick={() => setShowFeedbackModal(false)}
                  className="flex-1 py-2 bg-brand-cream hover:bg-brand-cream/80 text-brand-gold text-xs font-semibold rounded-lg text-center"
                >
                  取消
                </button>
                <button
                  id="btn-submit-feedback"
                  onClick={handleFeedbackSubmit}
                  className="flex-1 py-2 bg-brand-primary hover:bg-[#ffaa33] text-white text-xs font-semibold rounded-lg text-center"
                >
                  提交
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simulation Reset App Confirmation LogOut */}
      <AnimatePresence>
        {showLogOutDialog && (
          <motion.div 
            className="fixed inset-0 bg-[#3D3D3D]/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-xs border border-brand-secondary/15 space-y-4"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="bg-red-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-red-500">
                <LogOut className="w-5 h-5" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-brand-dark">确认退出登录吗？</h3>
                <p className="text-xs text-zinc-400">退出登录将清除当前的本地账本，并重置回初始数据哦。</p>
              </div>

              <div className="flex gap-2 text-center">
                <button
                  id="btn-cancel-logout"
                  onClick={() => setShowLogOutDialog(false)}
                  className="flex-1 py-2 bg-brand-cream hover:bg-brand-cream/80 text-brand-gold text-xs font-semibold rounded-lg"
                >
                  取消
                </button>
                <button
                  id="btn-confirm-logout"
                  onClick={() => {
                    setShowLogOutDialog(false);
                    onResetApp();
                    triggerToast('账本重置 & 初始化就绪！🔄');
                  }}
                  className="flex-1 py-2 bg-red-500 text-white hover:bg-red-600 text-xs font-semibold rounded-lg"
                >
                  退出并重置
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-sm border border-brand-secondary/15 space-y-4 text-left"
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
                  id="btn-close-notification-modal-me"
                  onClick={() => setShowNotificationModal(false)}
                  className="text-zinc-400 hover:text-zinc-650 text-sm font-bold cursor-pointer font-sans"
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
                id="btn-close-notif-dialog-me"
                onClick={() => setShowNotificationModal(false)}
                className="w-full py-2.5 bg-brand-primary hover:bg-[#ffaa33] text-white text-xs font-semibold rounded-xl text-center cursor-pointer shadow-md"
              >
                我知道了，温暖存钱 🌱
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievements Sub-Page View (Secondary page transition effect as requested) */}
      <AnimatePresence>
        {showAllAchievements && (
          <motion.div
            className="absolute inset-0 bg-[#FAF9F6] z-30 flex flex-col justify-between overflow-hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 bg-[#FAF9F6]/95 border-b border-brand-secondary/10 shrink-0 select-none">
              <button
                id="btn-back-from-achievements"
                onClick={() => setShowAllAchievements(false)}
                className="p-2 text-brand-dark hover:bg-brand-cream/60 rounded-xl transition cursor-pointer active:scale-95 duration-100"
              >
                <ArrowLeft className="w-5 h-5 text-zinc-650" />
              </button>
              <span className="text-base font-bold text-brand-gold font-sans">全部成就勋章</span>
              <div className="w-9 h-9"></div> {/* spacing placeholder */}
            </div>

            {/* Scroll Container */}
            <div className="flex-1 overflow-y-auto px-5 pt-4 pb-20 space-y-5">
              <div className="bg-gradient-to-br from-[#845400]/5 to-[#ffb347]/5 border border-brand-secondary/10 rounded-2xl p-4.5 text-center space-y-1 align-middle select-none">
                <p className="text-xs text-brand-gold font-bold">🌱 自律理财 · 温馨见证</p>
                <p className="text-[11px] text-[#3D3D3D]/70 font-sans">
                  您在这个温暖小栈所种下的每一个储蓄心愿，都会成长为沉甸甸的财富纪念章。
                </p>
              </div>

              {/* Grid of All Medals */}
              <div className="grid grid-cols-2 gap-3.5 pt-1">
                {ACHIEVEMENTS.map((item) => (
                  <button
                    key={item.id}
                    id={`achievement-card-${item.id}`}
                    onClick={() => setSelectedAchievement(item)}
                    className={`border rounded-2xl p-4 flex flex-col items-center text-center space-y-2.5 relative shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer text-left w-full outline-none select-none ${
                      item.status === 'unlocked'
                        ? 'bg-white border-brand-secondary/15 hover:border-amber-400/40'
                        : 'bg-zinc-100/30 border-dashed border-zinc-200 opacity-70 filter grayscale hover:opacity-100'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-inner ${
                      item.status === 'unlocked' ? item.color : 'bg-zinc-200 text-zinc-400'
                    }`}>
                      <span className="text-2xl">{item.emoji}</span>
                    </div>

                    <div className="space-y-0.5 w-full">
                      <div className="text-xs font-bold text-brand-dark flex items-center justify-center space-x-1">
                        <span>{item.title}</span>
                        {item.status === 'unlocked' ? (
                          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 rounded">✓</span>
                        ) : (
                          <span className="text-[10px] text-zinc-400">🔒</span>
                        )}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-sans line-clamp-1">
                        {item.requirement}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* No more medals card with summoning trigger */}
              <div className="bg-white border border-brand-secondary/10 rounded-2xl p-5 text-center space-y-3 shadow-xs select-none">
                <p className="text-xs font-bold text-zinc-400">--- 没有更多隐藏勋章了哦 ---</p>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                  当前的 5枚 成就包含了理财路上最扎实的坚持。想创造一个您的定制打卡勋章吗？
                </p>
                <button
                  id="btn-summon-hidden"
                  onClick={() => triggerToast('存钱家你好！理财达人正在努力构筑更精彩的神秘储蓄勋章中... 🌱')}
                  className="px-4 py-2 bg-brand-cream hover:bg-brand-cream/80 text-[#845400] text-xs font-bold rounded-xl transition cursor-pointer active:scale-95 inline-block"
                >
                  召唤专属新勋章 ✨
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Detail Modal Overlay */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            className="fixed inset-0 bg-[#3D3D3D]/65 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-6.5 shadow-xl w-full max-w-xs border border-brand-secondary/15 space-y-5 text-center relative select-none"
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
            >
              {/* Top right cancel */}
              <button
                id="btn-close-achievement-detail"
                onClick={() => setSelectedAchievement(null)}
                className="absolute top-4 right-4 text-zinc-300 hover:text-zinc-500 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Badge visual effect container */}
              <div className="pt-4 flex justify-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center relative ${
                  selectedAchievement.status === 'unlocked' 
                    ? 'bg-[#fdf2df] shadow-md circle-glow' 
                    : 'bg-zinc-100 opacity-60'
                }`}>
                  <span className="text-4xl">{selectedAchievement.emoji}</span>
                  {selectedAchievement.status === 'unlocked' && (
                    <motion.div 
                      className="absolute inset-0 rounded-full border-2 border-brand-primary opacity-30 scale-110"
                      animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>
              </div>

              {/* Text metadata */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-brand-gold">{selectedAchievement.title}</h3>
                
                <div className="flex justify-center">
                  {selectedAchievement.status === 'unlocked' ? (
                    <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-bold py-0.5 px-2.5 rounded-full border border-emerald-100">
                      ✨ 勋章已激活解锁
                    </span>
                  ) : (
                    <span className="inline-block bg-zinc-100 text-zinc-500 text-[10px] font-bold py-0.5 px-2.5 rounded-full border border-zinc-200">
                      🔒 尚未开启解锁
                    </span>
                  )}
                </div>
              </div>

              {/* Detail fields log */}
              <div className="bg-[#FAF9F6] border border-brand-secondary/10 rounded-2xl p-4 text-xs space-y-2 text-left font-sans">
                <div>
                  <span className="font-bold text-[#845400] block mb-0.5">🎖️ 勋章寄语：</span>
                  <p className="text-[#3D3D3D]/80 leading-relaxed italic">
                    “{selectedAchievement.desc}”
                  </p>
                </div>
                
                <div className="pt-1.5 border-t border-brand-cream/60">
                  <span className="font-semibold text-zinc-400 block mb-0.5">解锁标准：</span>
                  <p className="text-[#3D3D3D]/70 font-semibold text-[11px]">
                    {selectedAchievement.requirement}
                  </p>
                </div>

                {selectedAchievement.status === 'unlocked' && selectedAchievement.achievedDate && (
                  <div className="pt-1.5 border-t border-brand-cream/60 flex justify-between text-[10px] text-zinc-400">
                    <span>激活于：</span>
                    <span className="font-mono">{selectedAchievement.achievedDate}</span>
                  </div>
                )}
              </div>

              {/* Advice Tip text */}
              <p className="text-[10px] text-zinc-400 leading-normal">
                💡 {selectedAchievement.tip}
              </p>

              {/* Action buttons */}
              <div className="flex space-x-2.5 pt-1">
                {selectedAchievement.status === 'unlocked' && (
                  <button
                    id="btn-share-achievement"
                    onClick={() => triggerToast('📸 精美成就卡片已成功生成并自动保存至本地相册！')}
                    className="flex-1 py-2 px-3 bg-brand-cream hover:bg-brand-cream/80 text-[#845400] text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition cursor-pointer active:scale-95"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>保存为图片</span>
                  </button>
                )}
                <button
                  id="btn-close-achievement-okay"
                  onClick={() => setSelectedAchievement(null)}
                  className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer active:scale-95 text-center ${
                    selectedAchievement.status === 'unlocked' 
                      ? 'w-[85px] bg-[#845400] hover:bg-[#ffaa33] text-white' 
                      : 'w-full bg-brand-cream hover:bg-brand-cream/80 text-brand-dark'
                  }`}
                >
                  我知道了
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Account Settings Sub-Page View (Secondary page transition effect as requested) */}
      <AnimatePresence>
        {showAccountSettings && (
          <motion.div
            className="absolute inset-0 bg-[#FAF9F6] z-30 flex flex-col justify-between overflow-hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 bg-[#FAF9F6]/95 border-b border-brand-secondary/10 shrink-0 select-none">
              <button
                id="btn-back-from-account-settings"
                onClick={() => setShowAccountSettings(false)}
                className="p-2 text-brand-dark hover:bg-brand-cream/60 rounded-xl transition cursor-pointer active:scale-95 duration-100 animate-in"
              >
                <ArrowLeft className="w-5 h-5 text-zinc-650" />
              </button>
              <span className="text-base font-bold text-brand-gold font-sans">账号与权限设置</span>
              <div className="w-9 h-9"></div> {/* spacing placeholder */}
            </div>

            {/* Scroll Container */}
            <div className="flex-1 overflow-y-auto px-5 pt-4 pb-24 space-y-6">
              
              {/* Privacy Shield Intro Card */}
              <div className="bg-gradient-to-br from-[#845400]/5 to-emerald-500/5 border border-brand-secondary/10 rounded-2xl p-5 text-center space-y-3 shadow-xs select-none">
                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <Shield className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-brand-dark">温暖隐私安全护航</h4>
                  <p className="text-[11px] text-[#3D3D3D]/70 font-sans leading-relaxed">
                    本账本数据完全经过本地私密算法加锁，所有储蓄流水及隐私徽章均享受银行级本地沙盒防护。
                  </p>
                </div>
              </div>

              {/* SECTION 1: Master Confidential switch */}
              <div className="bg-white rounded-2xl p-4.5 border border-brand-secondary/10 space-y-4 shadow-sm">
                <div className="flex justify-between items-center pb-3 border-b border-brand-cream select-none">
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-brand-dark flex items-center">
                      🔒 强力保密模式
                    </span>
                    <span className="text-[10px] text-zinc-400 block font-sans">
                      开启后将锁定极客极密防护，禁止所有外部统计与分项控制
                    </span>
                  </div>
                  
                  {/* Premium styled custom switch */}
                  <button
                    id="btn-toggle-confidential-mode"
                    onClick={() => {
                      const prev = isConfidentialMode;
                      setIsConfidentialMode(!prev);
                      if (!prev) {
                        // Turning confidential ON forces custom options to lock down
                        setIsAchievementsPublic(false);
                        setIsSecretLock(true);
                        setIsTouchIDSim(true);
                        triggerToast('🛡️ 已锁死极高级隐私，数据保密状态已激活');
                      } else {
                        triggerToast('🔓 已解锁高级自定义控制，您可以自由开启/禁用其它偏好');
                      }
                    }}
                    className={`w-11 h-6.5 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer outline-none ${
                      isConfidentialMode ? 'bg-[#845400]' : 'bg-zinc-200'
                    }`}
                  >
                    <motion.div 
                      className="bg-white w-4.5 h-4.5 rounded-full shadow-md"
                      animate={{ x: isConfidentialMode ? 18 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                {isConfidentialMode ? (
                  <div className="p-3 bg-brand-cream/40 border border-[#ebd5bc]/25 rounded-xl text-[10px] text-[#845400] leading-relaxed flex items-start space-x-2 select-none animate-fadeIn">
                    <span className="mt-0.5">💡</span>
                    <span>
                      当前已开启<strong>“强力保密模式”</strong>。您的任何存钱金额、徽章详情都对外界100%隐匿。要在此自定义其他配置偏好与权限，请先在上方关闭此开关。
                    </span>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-[10px] text-emerald-800 leading-relaxed flex items-start space-x-2 select-none animate-fadeIn">
                    <span className="mt-0.5">✓</span>
                    <span>
                      已打开<strong>“自定义控制”</strong>。现在您可以根据需要调整下方的存钱网络偏好、徽章外显及提醒配置。
                    </span>
                  </div>
                )}
              </div>

              {/* SECTION 2: Custom Permissions Toggles (conditional look/feel) */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-400 px-1 select-none flex items-center space-x-1">
                  <span>⚙️</span>
                  <span>分项权限定制</span>
                </h3>

                <div className="bg-white rounded-2xl border border-brand-secondary/10 overflow-hidden divide-y divide-brand-cream/60 shadow-sm">
                  
                  {/* Toggle 1: Achievements Public */}
                  <div className={`p-4 flex items-center justify-between transition-opacity ${isConfidentialMode ? 'opacity-50' : 'opacity-100'}`}>
                    <div className="space-y-0.5 max-w-[200px]">
                      <span className="text-xs font-bold text-brand-dark block">公开我的成就徽章</span>
                      <span className="text-[10px] text-zinc-400 block font-sans">
                        允许好友在温暖排行榜上看见您的“坚持达人”等勋章
                      </span>
                    </div>
                    {isConfidentialMode ? (
                      <div className="flex items-center space-x-2 text-[11px] text-zinc-400 font-sans">
                        <span>保密已禁</span>
                        <Lock className="w-3.5 h-3.5 text-zinc-400" />
                      </div>
                    ) : (
                      <button
                        id="btn-toggle-publicize-achievements"
                        onClick={() => {
                          setIsAchievementsPublic(!isAchievementsPublic);
                          triggerToast(isAchievementsPublic ? '已隐藏账户徽章，他人不再可见 🔒' : '已公开您的成就徽章，好友可共睹成果 🌟');
                        }}
                        className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                          isAchievementsPublic ? 'bg-amber-600' : 'bg-zinc-200'
                        }`}
                      >
                        <motion.div 
                          className="bg-white w-5 h-5 rounded-full shadow-sm"
                          animate={{ x: isAchievementsPublic ? 16 : 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>
                    )}
                  </div>

                  {/* Toggle 2: Keypad Code simulation lock */}
                  <div className={`p-4 flex items-center justify-between transition-opacity ${isConfidentialMode ? 'opacity-50' : 'opacity-100'}`}>
                    <div className="space-y-0.5 max-w-[200px]">
                      <span className="text-xs font-bold text-brand-dark block">启动时进行面容验证</span>
                      <span className="text-[10px] text-zinc-400 block font-sans">
                        下次打开本存钱小程序时验证账本人脸与指纹权限
                      </span>
                    </div>
                    {isConfidentialMode ? (
                      <div className="flex items-center space-x-2 text-[11px] text-zinc-400 font-sans">
                        <span>强制开启</span>
                        <Lock className="w-3.5 h-3.5 text-zinc-400" />
                      </div>
                    ) : (
                      <button
                        id="btn-toggle-secret-lock"
                        onClick={() => {
                          setIsSecretLock(!isSecretLock);
                          triggerToast(isSecretLock ? '已关闭设备指纹免密安全限制' : '已开启极密面容识别保驾护航 🔐');
                        }}
                        className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                          isSecretLock ? 'bg-amber-600' : 'bg-zinc-200'
                        }`}
                      >
                        <motion.div 
                          className="bg-white w-5 h-5 rounded-full shadow-sm"
                          animate={{ x: isSecretLock ? 16 : 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>
                    )}
                  </div>

                  {/* Toggle 3: Multi-device cloud sync */}
                  <div className={`p-4 flex items-center justify-between transition-opacity ${isConfidentialMode ? 'opacity-50' : 'opacity-100'}`}>
                    <div className="space-y-0.5 max-w-[200px]">
                      <span className="text-xs font-bold text-brand-dark block">数据自动云端同步</span>
                      <span className="text-[10px] text-zinc-400 block font-sans">
                        静默备份温暖存钱数据至云服务器进行同步防丢失
                      </span>
                    </div>
                    {isConfidentialMode ? (
                      <div className="flex items-center space-x-2 text-[11px] text-zinc-400 font-sans">
                        <span>保密已禁</span>
                        <Lock className="w-3.5 h-3.5 text-zinc-400" />
                      </div>
                    ) : (
                      <button
                        id="btn-toggle-auto-sync"
                        onClick={() => {
                          setIsAutoSync(!isAutoSync);
                          triggerToast(isAutoSync ? '已关闭自动同步，存钱记账本地留存' : '已开启多终端端对端超强自动同步 🔄');
                        }}
                        className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                          isAutoSync ? 'bg-amber-600' : 'bg-zinc-200'
                        }`}
                      >
                        <motion.div 
                          className="bg-white w-5 h-5 rounded-full shadow-sm"
                          animate={{ x: isAutoSync ? 16 : 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>
                    )}
                  </div>

                  {/* Toggle 4: Haptic Feedbacks */}
                  <div className={`p-4 flex items-center justify-between transition-opacity ${isConfidentialMode ? 'opacity-50' : 'opacity-100'}`}>
                    <div className="space-y-0.5 max-w-[200px]">
                      <span className="text-xs font-bold text-brand-dark block">存钱时伴随触感微震</span>
                      <span className="text-[10px] text-zinc-400 block font-sans">
                        完成投币玻璃存钱罐瞬间触发轻快逼真的小震动
                      </span>
                    </div>
                    {isConfidentialMode ? (
                      <div className="flex items-center space-x-2 text-[11px] text-zinc-400 font-sans">
                        <span>强制开启</span>
                        <Lock className="w-3.5 h-3.5 text-zinc-400" />
                      </div>
                    ) : (
                      <button
                        id="btn-toggle-touchid-sim"
                        onClick={() => {
                          setIsTouchIDSim(!isTouchIDSim);
                          triggerToast(isTouchIDSim ? '已关闭清脆手感震动反馈' : '已开启金币存入高质轻巧微震触觉 📳');
                        }}
                        className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                          isTouchIDSim ? 'bg-amber-600' : 'bg-zinc-200'
                        }`}
                      >
                        <motion.div 
                          className="bg-white w-5 h-5 rounded-full shadow-sm"
                          animate={{ x: isTouchIDSim ? 16 : 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>
                    )}
                  </div>

                </div>
              </div>

              {/* Action Buttons inside Settings Subpanel */}
              <div className="space-y-3 pt-2">
                <button
                  id="btn-save-settings-subpage"
                  onClick={() => {
                    setShowAccountSettings(false);
                    triggerToast('✨ 账号隐私及安全权限策略保存并套用成功！');
                  }}
                  className="w-full py-3 bg-[#845400] hover:bg-[#ffaa33] text-white text-xs font-bold rounded-xl text-center shadow-md active:scale-95 transition cursor-pointer"
                >
                  保存并套用配置
                </button>
                <button
                  id="btn-reset-default-settings"
                  onClick={() => {
                    setIsConfidentialMode(true);
                    setIsAchievementsPublic(false);
                    setIsSecretLock(true);
                    setIsAutoSync(true);
                    setIsTouchIDSim(true);
                    triggerToast('已为您一键重置至初始默认“强力保密模式” 🛡️');
                  }}
                  className="w-full py-3 bg-brand-cream/60 hover:bg-brand-cream/90 text-brand-gold text-xs font-semibold rounded-xl text-center active:scale-95 transition cursor-pointer border border-[#ebd5bc]/25"
                >
                  恢复默认设置
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
