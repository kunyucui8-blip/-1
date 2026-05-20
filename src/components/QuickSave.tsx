/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { X, Delete, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Challenge } from '../types';

interface QuickSaveProps {
  challenges: Challenge[];
  defaultChallengeId?: string;
  onClose: () => void;
  onSave: (amount: number, challengeId: string, category: string) => void;
}

export default function QuickSave({
  challenges,
  defaultChallengeId,
  onClose,
  onSave
}: QuickSaveProps) {
  const activeChallenges = challenges.filter(c => c.status === 'ACTIVE');
  const [selectedChallengeId, setSelectedChallengeId] = useState(
    defaultChallengeId || (activeChallenges[0]?.id || '')
  );
  
  const [valueStr, setValueStr] = useState('0.00');
  const [isReset, setIsReset] = useState(true); // Track if the number has been touched
  const [selectedCategory, setSelectedCategory] = useState('即时存入');
  const [showSuccess, setShowSuccess] = useState(false);
  const [savedAmount, setSavedAmount] = useState(0);

  const categories = ['即时存入', '健康存钱挑战', '节省生活费挑战', '零钱挑战'];

  const handleKeyPress = (key: string) => {
    if (key === 'delete') {
      if (valueStr === '0.00' || valueStr.length <= 1) {
        setValueStr('0.00');
        setIsReset(true);
      } else {
        const newVal = valueStr.slice(0, -1);
        if (newVal === '' || newVal === '0.' || newVal === '0') {
          setValueStr('0.00');
          setIsReset(true);
        } else {
          setValueStr(newVal);
        }
      }
      return;
    }

    if (isReset) {
      if (key === '.') {
        setValueStr('0.');
        setIsReset(false);
      } else if (key === '0') {
        // stay 0.00
      } else {
        setValueStr(key);
        setIsReset(false);
      }
    } else {
      // Check decimal constraints
      if (key === '.') {
        if (valueStr.includes('.')) return; // No double dots
        setValueStr(prev => prev + '.');
      } else {
        // Prevent more than 2 digits after decimal
        const parts = valueStr.split('.');
        if (parts[1] && parts[1].length >= 2) return;
        
        // Prevent extremely long inputs
        if (valueStr.replace('.', '').length >= 8) return;

        setValueStr(prev => prev + key);
      }
    }
  };

  const handleConfirm = () => {
    const numericAmount = parseFloat(valueStr);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('请输入有效的存款金额哦！');
      return;
    }

    if (!selectedChallengeId) {
      alert('请先选择一个存钱计划！');
      return;
    }

    setSavedAmount(numericAmount);
    setShowSuccess(true);
    
    // Trigger callback
    setTimeout(() => {
      onSave(numericAmount, selectedChallengeId, selectedCategory);
      onClose();
    }, 1800);
  };

  const selectedChallengeObj = challenges.find(c => c.id === selectedChallengeId);

  return (
    <div className="fixed inset-0 bg-[#FAF9F6] z-50 flex flex-col justify-between p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <button 
          id="btn-close-quick-save"
          onClick={onClose} 
          className="p-2 transition-transform hover:scale-110 active:scale-90 text-brand-dark/80"
        >
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-brand-gold font-sans tracking-wide">快速存入</h1>
        <div className="w-10"></div> {/* Balanced Spacer */}
      </div>

      {/* Main Content Form */}
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-6">
        {/* Challenge Selection Card overlay */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-brand-secondary/20">
          <label className="text-xs text-brand-gold/80 font-medium block mb-2">选择存钱目标计划</label>
          {activeChallenges.length > 0 ? (
            <select
              id="select-active-challenge"
              value={selectedChallengeId}
              onChange={(e) => setSelectedChallengeId(e.target.value)}
              className="w-full bg-brand-cream/50 border border-brand-secondary/35 rounded-lg py-2 px-3 text-sm text-brand-dark focus:outline-none focus:border-brand-primary"
            >
              {activeChallenges.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title} (目标: ¥{c.target.toLocaleString()})
                </option>
              ))}
            </select>
          ) : (
            <div className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> 暂无进行中的计划，存款将计入临时零钱账户
            </div>
          )}
        </div>

        {/* Categories Selection */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-brand-secondary/20">
          <label className="text-xs text-brand-gold/80 font-medium block mb-2">存入类型</label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                id={`btn-category-${cat}`}
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`py-2 px-3 text-xs rounded-lg transition-all border ${
                  selectedCategory === cat
                    ? 'bg-brand-primary text-white border-brand-primary shadow-sm font-medium'
                    : 'bg-brand-cream/30 text-brand-dark/80 border-brand-secondary/25 hover:bg-brand-cream/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Display Amount */}
        <div className="text-center py-6">
          <span className="text-xs text-brand-gold/80 font-medium block uppercase tracking-wider mb-2">存入金额</span>
          <div className="text-[40px] font-bold text-brand-gold tracking-tight font-sans transition-all duration-150">
            ¥ {parseFloat(valueStr).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Numerical Keyboard & Confirm Section */}
      <div className="w-full max-w-sm mx-auto space-y-4">
        {/* Custom Touchpad Pad Layout */}
        <div className="grid grid-cols-3 gap-3 bg-white/40 p-2 rounded-2xl border border-brand-secondary/15 backdrop-blur-sm">
          {[
            '1', '2', '3',
            '4', '5', '6',
            '7', '8', '9',
            '.', '0', 'delete'
          ].map((key) => {
            const isDelete = key === 'delete';
            return (
              <button
                id={`btn-keypad-${key}`}
                key={key}
                type="button"
                onClick={() => handleKeyPress(key)}
                className="h-14 flex items-center justify-center text-xl font-medium rounded-xl bg-white hover:bg-brand-cream/60 active:bg-brand-secondary/30 text-brand-dark transition-all duration-75 shadow-sm border border-brand-secondary/10"
              >
                {isDelete ? (
                  <Delete className="w-5 h-5 text-zinc-500" />
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>

        {/* Confirm Button */}
        <button
          id="btn-confirm-deposit"
          onClick={handleConfirm}
          disabled={parseFloat(valueStr) <= 0 || !selectedChallengeId}
          className={`w-full py-4 rounded-xl text-center font-semibold text-lg transition-all duration-200 transform outline-none active:scale-[0.98] ${
            parseFloat(valueStr) > 0 && selectedChallengeId
              ? 'bg-brand-primary hover:bg-[#ffaa33] text-white shadow-md shadow-brand-primary/15 hover:shadow-lg hover:shadow-brand-primary/20 cursor-pointer'
              : 'bg-[#ffeed6] text-brand-gold/40 cursor-not-allowed'
          }`}
        >
          确认存入
        </button>
      </div>

      {/* Success Animation Dialog Layer overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#3D3D3D]/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-xs text-center border border-brand-secondary/15 space-y-4"
            >
              <div className="mx-auto bg-brand-sage/20 w-16 h-16 rounded-full flex items-center justify-center text-brand-sage-dark">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 animate-bounce" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-brand-gold">存入成功</h3>
                <p className="text-sm text-brand-dark/80">
                  成功为 <span className="font-semibold text-brand-gold">“{selectedChallengeObj?.title || ''}”</span> 攒下
                </p>
                <div className="text-2xl font-bold text-brand-gold">
                  +¥{savedAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <p className="text-xs text-zinc-400">正在为您更新爱心蓄水金罐罐...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
