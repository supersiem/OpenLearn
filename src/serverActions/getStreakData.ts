"use server"

import { getUserFromSession } from '@/utils/auth/auth';
import { prisma } from '@/utils/prisma';
import { cookies } from 'next/headers';
import type { StreakData, WeekActivity } from '@/store/streak/StreakData';

export async function getStreakData(): Promise<StreakData> {
  try {
    const sessionId = (await cookies()).get("polarlearn.session-id")?.value as string;
    const user = await getUserFromSession(sessionId);

    if (!user?.id) {
      return {
        streak: 0,
        freezes: 0,
        weekActivity: []
      };
    }

    // Check if getUserFromSession already includes the data we need
    let streakCount = user.streakCount;
    let freezeCount = user.freezeCount;
    let streakData = user.streakData;
    let lastActivity = user.lastActivity;

    // If the session user doesn't include complete data, then fetch only what's missing
    if (streakCount === undefined || freezeCount === undefined || streakData === undefined || lastActivity === undefined) {
      // Only fetch what we're missing
      const userData = await prisma.user.findFirst({
        where: {
          id: user.id
        },
        select: {
          streakCount: streakCount === undefined,
          freezeCount: freezeCount === undefined,
          streakData: streakData === undefined,
          lastActivity: lastActivity === undefined
        }
      });

      if (userData) {
        streakCount = streakCount ?? userData.streakCount;
        freezeCount = freezeCount ?? userData.freezeCount;
        streakData = streakData ?? userData.streakData;
        lastActivity = lastActivity ?? userData.lastActivity;
      }
    }

    // Default values for safety
    streakCount = streakCount ?? 0;
    freezeCount = freezeCount ?? 0;
    streakData = streakData ?? {};

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Check if user has activity today
    const hasActivityToday = (streakData as Record<string, string>)[today] === 'done';

    // Check if user had activity yesterday (or used a freeze)
    const yesterdayActivity = (streakData as Record<string, string>)[yesterdayStr];
    const hadActivityYesterday = yesterdayActivity === 'done' || yesterdayActivity === 'frozen';

    // Reset streak if no activity today AND no activity/freeze yesterday AND streak > 0
    if (!hasActivityToday && !hadActivityYesterday && streakCount > 0) {
      console.log(`Resetting streak for user ${user.id}: no activity today (${today}) and no activity/freeze yesterday (${yesterdayStr})`);

      // Reset streak in database
      await prisma.user.update({
        where: { id: user.id },
        data: {
          streakCount: 0,
          lastActivity: null
        }
      });

      streakCount = 0;
    }

    // Generate week activity data (last 7 days)
    const weekActivity: WeekActivity[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayActivity = (streakData as Record<string, string>)[dateStr];
      weekActivity.push({
        date: dateStr,
        hasActivity: dayActivity === 'done',
        isFrozen: dayActivity === 'frozen'
      });
    }

    return {
      streak: streakCount,
      freezes: freezeCount,
      weekActivity
    };

  } catch (error) {
    console.error('Error fetching streak data:', error);
    return {
      streak: 0,
      freezes: 0,
      weekActivity: []
    };
  }
}
