/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Trophy, History as HistoryIcon, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewType, Challenge, SavingRecord, UserProfile } from './types';
import { INITIAL_CHALLENGES, INITIAL_RECORDS } from './initialData';

// Sub components split
import ChallengesList from './components/ChallengesList';
import SavingHistory from './components/SavingHistory';
import PersonalCenter from './components/PersonalCenter';
import ChallengeDetail from './components/ChallengeDetail';
import ChallengeCompleted from './components/ChallengeCompleted';
import QuickSave from './components/QuickSave';

export default function App() {
  // Navigation Stack States
  const [activeTab, setActiveTab] = useState<'CHALLENGES' | 'HISTORY' | 'ME'>('ME'); // Default selected to Personal Center 'ME' as shown in Screen 1
  const [detailView, setDetailView] = useState<Challenge | null>(null);
  const [completedCelebrationView, setCompletedCelebrationView] = useState<Challenge | null>(null);
  const [showQuickSaveOverlay, setShowQuickSaveOverlay] = useState(false);

  // Core Global States
  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem('savings_challenges');
    return saved ? JSON.parse(saved) : INITIAL_CHALLENGES;
  });

  const [records, setRecords] = useState<SavingRecord[]>(() => {
    const saved = localStorage.getItem('savings_records');
    return saved ? JSON.parse(saved) : INITIAL_RECORDS;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('savings_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If they still have the old unsplash avatar or old placeholder loaded, migrate it to the sprout avatar to match the home screen!
        if (parsed.avatar && (parsed.avatar.includes('images.unsplash.com') || parsed.avatar.includes('photo-1544005313') || parsed.avatar.includes('photo-1534528741775-53994a69daeb') || parsed.avatar.includes('photo-1494790108377-be9c29b29330'))) {
          parsed.avatar = "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='50' fill='%23FFEBD6'/%3E%3Ctext x='50' y='66' font-size='48' text-anchor='middle'%3E🌱%3C/text%3E%3C/svg%3E";
        }
        return parsed;
      } catch (e) {
        // Fallback to default
      }
    }
    return {
      name: '存钱达人小星',
      joinedDays: 128,
      avatar: "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='50' fill='%23FFEBD6'/%3E%3Ctext x='50' y='66' font-size='48' text-anchor='middle'%3E🌱%3C/text%3E%3C/svg%3E"
    };
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('savings_challenges', JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem('savings_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('savings_profile', JSON.stringify(profile));
  }, [profile]);

  // Handlers
  const handleUpdateName = (newName: string) => {
    setProfile(prev => ({ ...prev, name: newName }));
  };

  const handleUpdateAvatar = (newAvatar: string) => {
    setProfile(prev => ({ ...prev, avatar: newAvatar }));
  };

  // Add custom challenge goal
  const handleAddChallenge = (title: string, target: number, bannerImage: string, bannerQuote: string) => {
    const newChallenge: Challenge = {
      id: `ch_${Date.now()}`,
      title,
      target,
      current: 0,
      joinedDays: 1,
      status: 'ACTIVE',
      bannerImage,
      bannerQuote,
      records: []
    };
    setChallenges(prev => [...prev, newChallenge]);
  };

  // Update an existing challenge
  const handleUpdateChallenge = (id: string, updates: Partial<Challenge>) => {
    setChallenges(prev => {
      const updatedList = prev.map(c => {
        if (c.id === id) {
          const updated = { ...c, ...updates };
          // Keep detail view state in sync if visible details match
          if (detailView && detailView.id === id) {
            setDetailView(updated);
          }
          return updated;
        }
        return c;
      });
      return updatedList;
    });
  };

  // Delete a challenge
  const handleDeleteChallenge = (id: string) => {
    setChallenges(prev => prev.filter(c => c.id !== id));
    if (detailView && detailView.id === id) {
      setDetailView(null);
    }
  };

  // Quick Save numeric logic trigger
  const handleCommitDeposit = (amount: number, challengeId: string, category: string) => {
    const timestampStr = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-');

    const newRecordId = `rec_${Date.now()}`;
    
    // 1. Append transaction to global ledger history
    const challengeObj = challenges.find(c => c.id === challengeId);
    const newRecord: SavingRecord = {
      id: newRecordId,
      title: challengeObj ? challengeObj.title : '自主存入',
      amount,
      date: timestampStr,
      category,
      iconType: challengeObj?.id === 'ch_1' ? 'trip' : challengeObj?.id === 'ch_3' ? 'camera' : 'piggy',
      challengeId
    };
    setRecords(prev => [newRecord, ...prev]);

    // 2. Add amount to active Challenge & check if completed
    setChallenges(prevChallenges => {
      const updated = prevChallenges.map(c => {
        if (c.id === challengeId) {
          const newCurrent = c.current + amount;
          const isFinished = newCurrent >= c.target;
          
          const newLog: SavingRecord = {
            id: `det_${Date.now()}`,
            title: category === '即时存入' ? '自主存钱' : category,
            amount,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            category,
            iconType: 'default'
          };

          const challengeUpdated: Challenge = {
            ...c,
            current: Math.min(newCurrent, c.target),
            status: isFinished ? 'COMPLETED' : 'ACTIVE',
            records: [newLog, ...c.records],
            daysSaved: isFinished ? c.joinedDays + 1 : undefined,
            interestSaved: isFinished ? 1240 : undefined,
            ranking: isFinished ? '前 5%' : undefined,
            badgeName: isFinished ? '意志之金' : undefined
          };

          // If finished, set celebration screen
          if (isFinished) {
            setCompletedCelebrationView(challengeUpdated);
          } else {
            // If we are on detail view, keep detail view synced with updated values
            if (detailView && detailView.id === challengeId) {
              setDetailView(challengeUpdated);
            }
          }

          return challengeUpdated;
        }
        return c;
      });
      return updated;
    });
  };

  // Reset core storage state back to original initial data
  const handleResetApp = () => {
    localStorage.removeItem('savings_challenges');
    localStorage.removeItem('savings_records');
    localStorage.removeItem('savings_profile');
    setChallenges(INITIAL_CHALLENGES);
    setRecords(INITIAL_RECORDS);
    setProfile({
      name: '存钱达人小星',
      joinedDays: 128,
      avatar: "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='50' fill='%23FFEBD6'/%3E%3Ctext x='50' y='66' font-size='48' text-anchor='middle'%3E🌱%3C/text%3E%3C/svg%3E"
    });
    setDetailView(null);
    setCompletedCelebrationView(null);
    setActiveTab('ME');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#3D3D3D] flex flex-col items-center justify-start select-none w-full relative">
      {/* Outer wrapper max width frame of 480px representing beautiful mobile card style */}
      <div className="w-full max-w-[480px] min-h-screen bg-[#FAF9F6] shadow-2xl shadow-brand-gold/10 border-x border-brand-secondary/15 flex flex-col justify-between relative overflow-hidden">
        
        {/* Pages Content View Switch (Slide / fade layout) */}
        <div className="flex-1 w-full relative">
          <AnimatePresence mode="wait">
            {completedCelebrationView ? (
              <motion.div
                key="celebration-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <ChallengeCompleted
                  challenge={completedCelebrationView}
                  onBack={() => setCompletedCelebrationView(null)}
                  onRestart={() => {
                    setCompletedCelebrationView(null);
                    setDetailView(null);
                    setActiveTab('CHALLENGES');
                  }}
                />
              </motion.div>
            ) : detailView ? (
              <motion.div
                key="detail-screen"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full"
              >
                <ChallengeDetail
                  challenge={detailView}
                  onBack={() => setDetailView(null)}
                  onOpenQuickSave={() => setShowQuickSaveOverlay(true)}
                  onUpdateChallenge={handleUpdateChallenge}
                  onDeleteChallenge={handleDeleteChallenge}
                />
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full"
              >
                {activeTab === 'CHALLENGES' && (
                  <ChallengesList
                    challenges={challenges}
                    onSelectChallenge={(id) => {
                      const found = challenges.find(c => c.id === id);
                      if (found) setDetailView(found);
                    }}
                    onSelectCompletedChallenge={(id) => {
                      const found = challenges.find(c => c.id === id);
                      if (found) setCompletedCelebrationView(found);
                    }}
                    onAddChallenge={handleAddChallenge}
                  />
                )}

                {activeTab === 'HISTORY' && (
                  <SavingHistory
                    records={records}
                    onOpenQuickSave={() => setShowQuickSaveOverlay(true)}
                    onNavigateToMe={() => setActiveTab('ME')}
                    avatar={profile.avatar}
                  />
                )}

                {activeTab === 'ME' && (
                  <PersonalCenter
                    profile={profile}
                    onUpdateName={handleUpdateName}
                    onUpdateAvatar={handleUpdateAvatar}
                    onNavigateToTab={(tab) => {
                      setDetailView(null);
                      setCompletedCelebrationView(null);
                      setActiveTab(tab);
                    }}
                    onResetApp={handleResetApp}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Global Keypad Quick Save Overlay */}
        <AnimatePresence>
          {showQuickSaveOverlay && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="absolute inset-0 z-50 pointer-events-auto"
            >
              <QuickSave
                challenges={challenges}
                defaultChallengeId={detailView?.id || undefined}
                onClose={() => setShowQuickSaveOverlay(false)}
                onSave={handleCommitDeposit}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sticky Bottom Navigation Tabs bar */}
        {!detailView && !completedCelebrationView && (
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-brand-secondary/15 py-3.5 px-6 flex justify-between items-center z-20 shadow-lg">
            
            {/* Tab 1: 挑战 */}
            <button
              id="nav-tab-challenges"
              onClick={() => {
                setDetailView(null);
                setCompletedCelebrationView(null);
                setActiveTab('CHALLENGES');
              }}
              className="flex-1 flex justify-center outline-none cursor-pointer"
            >
              {activeTab === 'CHALLENGES' ? (
                <div className="bg-[#FFB347] text-white rounded-full py-1.5 px-5 flex items-center space-x-1.5 shadow-sm transform transition-all duration-300">
                  <Trophy className="w-4 h-4 text-white" />
                  <span className="text-[11px] font-bold tracking-wide">挑战</span>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-0.5 text-zinc-400 hover:text-brand-gold transition-colors duration-150 py-1">
                  <Trophy className="w-5 h-5" />
                  <span className="text-[10px] font-medium">挑战</span>
                </div>
              )}
            </button>

            {/* Tab 2: 历史 */}
            <button
              id="nav-tab-history"
              onClick={() => {
                setDetailView(null);
                setCompletedCelebrationView(null);
                setActiveTab('HISTORY');
              }}
              className="flex-1 flex justify-center outline-none cursor-pointer"
            >
              {activeTab === 'HISTORY' ? (
                <div className="bg-[#FFB347] text-white rounded-full py-1.5 px-5 flex items-center space-x-1.5 shadow-sm transform transition-all duration-300">
                  <HistoryIcon className="w-4 h-4 text-white" />
                  <span className="text-[11px] font-bold tracking-wide">历史</span>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-0.5 text-zinc-400 hover:text-brand-gold transition-colors duration-150 py-1">
                  <HistoryIcon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">历史</span>
                </div>
              )}
            </button>

            {/* Tab 3: 个人中心 */}
            <button
              id="nav-tab-me"
              onClick={() => {
                setDetailView(null);
                setCompletedCelebrationView(null);
                setActiveTab('ME');
              }}
              className="flex-1 flex justify-center outline-none cursor-pointer"
            >
              {activeTab === 'ME' ? (
                <div className="bg-[#FFB347] text-white rounded-full py-1.5 px-5 flex items-center space-x-1.5 shadow-sm transform transition-all duration-300">
                  <User className="w-4 h-4 text-white" />
                  <span className="text-[11px] font-bold tracking-wide">个人中心</span>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-0.5 text-zinc-400 hover:text-brand-gold transition-colors duration-150 py-1">
                  <User className="w-5 h-5" />
                  <span className="text-[10px] font-medium">个人中心</span>
                </div>
              )}
            </button>

          </div>
        )}
      </div>
    </div>
  );
}
