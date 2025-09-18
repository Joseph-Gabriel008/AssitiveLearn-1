import React from 'react';
import { Trophy, Star, Zap, Target, Calendar, Award } from 'lucide-react';
import { UserProgress, Badge } from '../types';

interface GamificationProps {
  darkMode: boolean;
  userProgress: UserProgress;
  onClaimBadge: (badgeId: string) => void;
}

export default function Gamification({ darkMode, userProgress, onClaimBadge }: GamificationProps) {
  const getXPForNextLevel = (level: number) => level * 100;
  const currentLevelXP = getXPForNextLevel(userProgress.level);
  const nextLevelXP = getXPForNextLevel(userProgress.level + 1);
  const progressPercentage = ((userProgress.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  const availableBadges: Badge[] = [
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first study session',
      icon: '🎯',
      earned: userProgress.studySessions.length > 0
    },
    {
      id: '2',
      name: 'Streak Master',
      description: 'Maintain a 7-day study streak',
      icon: '🔥',
      earned: userProgress.streak >= 7
    },
    {
      id: '3',
      name: 'Knowledge Seeker',
      description: 'Reach level 5',
      icon: '📚',
      earned: userProgress.level >= 5
    },
    {
      id: '4',
      name: 'Time Master',
      description: 'Study for 10 hours total',
      icon: '⏰',
      earned: userProgress.totalStudyTime >= 600 // 10 hours in minutes
    },
    {
      id: '5',
      name: 'Vocabulary Champion',
      description: 'Learn 50 new words',
      icon: '📖',
      earned: false // This would be based on vocabulary progress
    }
  ];

  return (
    <div className={`border rounded-lg p-4 ${
      darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'
    }`}>
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        Your Progress
      </h3>

      {/* Level and XP */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-bold">Level {userProgress.level}</span>
          </div>
          <span className="text-sm text-gray-500">
            {userProgress.xp} / {nextLevelXP} XP
          </span>
        </div>
        <div className={`w-full h-3 rounded-full ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.max(0, Math.min(100, progressPercentage))}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`p-3 rounded-lg ${
          darkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium">Streak</span>
          </div>
          <p className="text-xl font-bold">{userProgress.streak} days</p>
        </div>
        <div className={`p-3 rounded-lg ${
          darkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">Study Time</span>
          </div>
          <p className="text-xl font-bold">{Math.floor(userProgress.totalStudyTime / 60)}h</p>
        </div>
      </div>

      {/* Badges */}
      <div>
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Award className="w-4 h-4" />
          Badges ({availableBadges.filter(b => b.earned).length}/{availableBadges.length})
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {availableBadges.map((badge) => (
            <div
              key={badge.id}
              className={`p-3 rounded-lg border transition-all ${
                badge.earned
                  ? darkMode
                    ? 'border-yellow-600 bg-yellow-900/20'
                    : 'border-yellow-400 bg-yellow-50'
                  : darkMode
                  ? 'border-gray-600 bg-gray-800 opacity-50'
                  : 'border-gray-300 bg-gray-100 opacity-50'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">{badge.icon}</div>
                <p className="text-xs font-medium">{badge.name}</p>
                <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                {badge.earned && (
                  <div className="mt-2">
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                      Earned!
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}