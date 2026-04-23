export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  total: number;
  type: 'daily' | 'milestone';
  completed: boolean;
}

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'q1',
    title: 'Acoustic Initializer',
    description: 'Complete your first lesson node.',
    reward: 50,
    progress: 0,
    total: 1,
    type: 'daily',
    completed: false
  },
  {
    id: 'q2',
    title: 'Nyquist Navigator',
    description: 'Use the Doppler simulator 5 times.',
    reward: 100,
    progress: 0,
    total: 5,
    type: 'daily',
    completed: false
  },
  {
    id: 'q3',
    title: 'Physics Prodigy',
    description: 'Answer 10 AI Tutor questions correctly.',
    reward: 250,
    progress: 0,
    total: 10,
    type: 'milestone',
    completed: false
  },
  {
    id: 'q4',
    title: 'Diagnostic Mastery',
    description: 'Complete all lessons in the Physics module.',
    reward: 500,
    progress: 0,
    total: 12,
    type: 'milestone',
    completed: false
  },
  {
    id: 'q5',
    title: 'Neural Symphony',
    description: 'Interact with Harvey 25 times.',
    reward: 150,
    progress: 0,
    total: 25,
    type: 'milestone',
    completed: false
  },
  {
    id: 'q6',
    title: 'Deep Focus',
    description: 'Accumulate 1 hour of total study time.',
    reward: 300,
    progress: 0,
    total: 3600, // 3600 seconds = 1 hour
    type: 'milestone',
    completed: false
  }
];

export const updateQuestProgress = (questId: string, increment: number = 1) => {
  let quests: Quest[] = INITIAL_QUESTS;
  try {
    const saved = localStorage.getItem('echo_quest_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        quests = parsed;
      }
    }
  } catch (e) {
    console.error("Quest State Load Error:", e);
  }
  
  quests = quests.map(q => {
    if (q.id === questId && !q.completed) {
      const newProgress = Math.min(q.progress + increment, q.total);
      return {
        ...q,
        progress: newProgress,
        completed: newProgress >= q.total
      };
    }
    return q;
  });
  
  localStorage.setItem('echo_quest_state', JSON.stringify(quests));
  
  // Trigger custom event for components to listen to
  window.dispatchEvent(new CustomEvent('quest-updated', { detail: quests }));
};

export const checkModuleCompletionQuests = (completedCount: number) => {
    let quests: Quest[] = INITIAL_QUESTS;
    try {
      const saved = localStorage.getItem('echo_quest_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          quests = parsed;
        }
      }
    } catch (e) {
      console.error("Quest State Load Error in checkModule:", e);
    }
    
    quests = quests.map(q => {
        if(q.id === 'q4' && !q.completed) {
            return {
                ...q,
                progress: completedCount,
                completed: completedCount >= q.total
            }
        }
        return q;
    });
    localStorage.setItem('echo_quest_state', JSON.stringify(quests));
    window.dispatchEvent(new CustomEvent('quest-updated', { detail: quests }));
}
