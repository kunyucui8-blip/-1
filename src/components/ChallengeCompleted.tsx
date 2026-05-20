/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowLeft, MoreVertical, Trophy, Award, Share2, Sparkles, Check } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Challenge } from '../types';

interface ChallengeCompletedProps {
  challenge: Challenge;
  onBack: () => void;
  onRestart: () => void; // CTA back to live goals
}

export default function ChallengeCompleted({
  challenge,
  onBack,
  onRestart
}: ChallengeCompletedProps) {
  const [showShareToast, setShowShareToast] = useState(false);

  const handleShare = () => {
    setShowShareToast(true);
    setTimeout(() => {
      setShowShareToast(false);
    }, 2000);
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen flex flex-col justify-between pb-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 sticky top-0 bg-[#FAF9F6]/90 backdrop-blur-md z-10">
        <button 
          id="btn-back-completed-view"
          onClick={onBack} 
          className="p-2 transition-transform hover:scale-110 active:scale-90 text-brand-dark/80"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-lg font-semibold text-brand-gold font-sans">挑战详情</span>
        <button id="btn-completed-more" className="p-2 text-brand-dark/80">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-5 space-y-8 pb-4 max-w-md mx-auto w-full">
        {/* Giant Trophy Header & Celebration */}
        <div className="flex flex-col items-center text-center space-y-4 pt-4">
          <div className="relative">
            <div className="w-36 h-36 rounded-full bg-[#fdf2df] flex items-center justify-center shadow-lg shadow-brand-primary/5 border border-brand-primary/10">
              <Trophy className="w-16 h-16 text-brand-primary animate-pulse" />
            </div>
            {/* Small floating sparkles representing triumph */}
            <Sparkles className="absolute top-0 right-0 w-6 h-6 text-[#FFB347] animate-bounce" />
            <Sparkles className="absolute bottom-2 -left-2 w-5 h-5 text-emerald-500" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-brand-gold tracking-wide">挑战完成！</h2>
            <p className="text-xs text-brand-dark/70 px-4 leading-relaxed font-sans">
              恭喜！你已经成功达成了这项存钱目标，离财务自由又近了一步。
            </p>
          </div>
        </div>

        {/* Detailed Statistics Core Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-secondary/15 space-y-5">
          {/* Goal Name Column */}
          <div className="flex items-center justify-between border-b border-brand-cream pb-4">
            <span className="text-sm font-medium text-brand-dark/60">目标名称</span>
            <span className="text-lg font-bold text-brand-gold">{challenge.title}</span>
          </div>

          {/* Grid of Results */}
          <div className="grid grid-cols-2 gap-4">
            {/* Box 1 */}
            <div className="bg-brand-cream/30 p-4 rounded-xl border border-brand-secondary/10 space-y-1">
              <div className="text-xs text-zinc-400 font-sans">最终总额</div>
              <div className="text-base font-bold text-brand-gold">
                ¥{challenge.target.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </div>
            </div>

            {/* Box 2 */}
            <div className="bg-brand-cream/30 p-4 rounded-xl border border-brand-secondary/10 space-y-1">
              <div className="text-xs text-zinc-400 font-sans">坚持天数</div>
              <div className="text-base font-bold text-brand-gold">
                {challenge.daysSaved || challenge.joinedDays} 天
              </div>
            </div>

            {/* Box 3 */}
            <div className="bg-brand-cream/30 p-4 rounded-xl border border-brand-secondary/10 space-y-1">
              <div className="text-xs text-zinc-400 font-sans">节省利息</div>
              <div className="text-base font-bold text-emerald-600 font-sans">
                ¥{(challenge.interestSaved || 1240).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </div>
            </div>

            {/* Box 4 */}
            <div className="bg-brand-cream/30 p-4 rounded-xl border border-brand-secondary/10 space-y-1">
              <div className="text-xs text-zinc-400 font-sans">达成排名</div>
              <div className="text-base font-bold text-brand-gold">
                {challenge.ranking || '前 5%'}
              </div>
            </div>
          </div>
        </div>

        {/* Badge container block */}
        <div className="bg-brand-cream/40 border border-[#e3dfd3] rounded-2xl p-4 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-inner text-amber-500 border border-brand-primary/10">
            <Award className="w-6 h-6 text-[#845400]" />
          </div>
          <div className="flex-1 space-y-0.5">
            <div className="text-sm font-semibold text-brand-gold">
              获得“{challenge.badgeName || '意志之金'}”勋章
            </div>
            <div className="text-xs text-brand-dark/70 font-sans">
              这是你连续完成的第 3 个存钱挑战。
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Bottom Action Stack */}
      <div className="px-5 space-y-3 max-w-md mx-auto w-full pt-4">
        <button
          id="btn-trigger-new-active-challenge"
          onClick={onRestart}
          className="w-full py-3.5 bg-brand-primary hover:bg-[#ffaa33] text-white font-semibold rounded-xl text-center shadow-md active:scale-[0.99] transition-all"
        >
          开启新挑战
        </button>

        <button
          id="btn-share-completed-challenge"
          onClick={handleShare}
          className="w-full py-4 bg-[#e8e7e1] hover:bg-[#dddcde] text-brand-dark/90 font-semibold rounded-xl flex items-center justify-center space-x-2 active:scale-[0.99] transition-all cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>分享成就</span>
        </button>
      </div>

      {/* Share Toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-[#3D3D3D] text-[#FAF9F6] text-xs font-medium py-2.5 px-4 rounded-full shadow-lg flex items-center space-x-2 z-50 whitespace-nowrap"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>成就图片已保存至相册，快去朋友圈打卡吧！</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
