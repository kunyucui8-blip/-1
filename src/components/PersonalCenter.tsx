/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bell, Trophy, Star, ChevronRight, Settings, MessageSquare, Award, LogOut, Check, Pencil, Camera, X } from 'lucide-react';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';

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
            <button className="text-xs text-zinc-400 hover:text-brand-gold font-medium">查看全部</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Badge 1 */}
            <div className="bg-[#FAF9F6] border border-brand-secondary/15 rounded-2xl p-4 flex flex-col items-center text-center space-y-2 relative shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#fdf2df] flex items-center justify-center text-amber-600">
                <Trophy className="w-6 h-6 text-[#845400]" />
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-brand-dark">坚持达人</div>
                <div className="text-xs text-zinc-455 font-sans text-zinc-400">连续存钱 30 天</div>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="bg-[#FAF9F6] border border-brand-secondary/15 rounded-2xl p-4 flex flex-col items-center text-center space-y-2 relative shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <Star className="w-6 h-6 fill-emerald-600" />
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-brand-dark">目标达成者</div>
                <div className="text-xs text-zinc-455 font-sans text-zinc-400">完成首个目标</div>
              </div>
            </div>
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
            onClick={() => triggerToast('您当前的账号已完成加密备份护航中 🛡️')}
            className="w-full py-4 px-5 flex items-center justify-between text-left hover:bg-brand-cream/20 transition-colors"
          >
            <div className="flex items-center space-x-3.5">
              <Settings className="w-5 h-5 text-[#845400]" />
              <span className="text-sm font-semibold text-brand-gold">账号设置</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-300" />
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
    </div>
  );
}
