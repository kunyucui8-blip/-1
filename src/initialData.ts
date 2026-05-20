/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Challenge, SavingRecord } from './types';

export const INITIAL_RECORDS: SavingRecord[] = [
  {
    id: 'rec_1',
    title: '大理旅行基金',
    amount: 200,
    date: '2023-11-24',
    category: '健康存钱挑战',
    iconType: 'trip',
    challengeId: 'ch_1'
  },
  {
    id: 'rec_2',
    title: '新相机购置',
    amount: 500,
    date: '2023-11-22',
    category: '节省生活费挑战',
    iconType: 'camera',
    challengeId: 'ch_3'
  },
  {
    id: 'rec_3',
    title: '梦想之家',
    amount: 1200,
    date: '2023-11-20',
    category: '健康存钱挑战',
    iconType: 'home',
    challengeId: 'ch_4'
  },
  {
    id: 'rec_4',
    title: '每日结余',
    amount: 45.50,
    date: '2023-11-19',
    category: '零钱挑战',
    iconType: 'piggy'
  },
  {
    id: 'rec_5',
    title: '少喝一杯咖啡',
    amount: 30,
    date: '2023-11-18',
    category: '即时存入',
    iconType: 'coffee'
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'ch_1',
    title: '大理之旅',
    target: 5000,
    current: 2400,
    joinedDays: 45,
    status: 'ACTIVE',
    bannerImage: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&q=80&w=800',
    bannerQuote: '洱海的梦想...',
    records: [
      {
        id: 'det_1',
        title: '每周存入',
        amount: 200,
        date: '2023-11-12',
        category: '目标积累',
        iconType: 'default'
      },
      {
        id: 'det_2',
        title: '奖励金',
        amount: 50,
        date: '2023-11-08',
        category: '额外存款',
        iconType: 'reward'
      },
      {
        id: 'det_3',
        title: '每月自动存',
        amount: 1000,
        date: '2023-11-01',
        category: '系统存存',
        iconType: 'piggy'
      }
    ]
  },
  {
    id: 'ch_2',
    title: '首付储备金',
    target: 50000,
    current: 50000,
    joinedDays: 180,
    status: 'COMPLETED',
    daysSaved: 180,
    interestSaved: 1240,
    ranking: '前 5%',
    badgeName: '意志之金',
    bannerImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
    bannerQuote: '筑巢引凤的安稳感。',
    records: []
  },
  {
    id: 'ch_3',
    title: '新相机计划',
    target: 8000,
    current: 3200,
    joinedDays: 20,
    status: 'ACTIVE',
    bannerImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
    bannerQuote: '记录下生活的闪光瞬间',
    records: []
  },
  {
    id: 'ch_4',
    title: '梦想之家',
    target: 100000,
    current: 45000,
    joinedDays: 90,
    status: 'ACTIVE',
    bannerImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    bannerQuote: '给未来绘制一份温馨港湾',
    records: []
  }
];
