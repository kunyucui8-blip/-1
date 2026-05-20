/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ViewType = 'CHALLENGES' | 'HISTORY' | 'ME' | 'CHALLENGE_DETAIL' | 'CHALLENGE_COMPLETED' | 'QUICK_SAVE';

export interface SavingRecord {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string; // e.g., '健康存钱挑战', '节省生活费挑战', '零钱挑战', '即时存入'
  iconType: 'trip' | 'camera' | 'home' | 'piggy' | 'coffee' | 'reward' | 'default';
  challengeId?: string;
}

export interface Challenge {
  id: string;
  title: string;
  target: number;
  current: number;
  joinedDays: number;
  status: 'ACTIVE' | 'COMPLETED';
  // Selected detail fields
  daysSaved?: number;
  interestSaved?: number;
  ranking?: string;
  badgeName?: string;
  bannerImage: string;
  bannerQuote: string;
  records: SavingRecord[];
}

export interface UserProfile {
  name: string;
  joinedDays: number;
  avatar: string;
}
