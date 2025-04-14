
// Stress detection API calls
export const stressApi = {
  detectStress: async (imageData: string | File, source: string, notes?: string) => {
    // Mock stress detection
    console.log('Stress detection called with source:', source);
    
    // Simulate random stress level
    const levels = ['low', 'medium', 'high', 'severe'];
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];
    const randomScore = Math.floor(Math.random() * 100);
    
    return {
      data: {
        record_id: `mock-record-${Date.now()}`,
        result: {
          stress_level: randomLevel,
          stress_score: randomScore,
          confidence: 0.85
        }
      }
    };
  },
  
  getHistory: async (userId?: string, limit?: number) => {
    // Mock stress history
    console.log('Getting stress history for user:', userId, 'limit:', limit);
    
    const mockHistory = [];
    const count = limit || 5;
    const levels = ['low', 'medium', 'high', 'severe'];
    
    for (let i = 0; i < count; i++) {
      mockHistory.push({
        id: `history-${i}`,
        user_id: userId || '1',
        level: levels[Math.floor(Math.random() * levels.length)],
        score: Math.floor(Math.random() * 100),
        timestamp: new Date(Date.now() - i * 86400000).toISOString(),
        source: i % 2 === 0 ? 'image' : 'realtime',
        notes: i % 3 === 0 ? 'Some notes about this reading' : null
      });
    }
    
    return { data: mockHistory };
  },
  
  getTrend: async (userId?: string, days: number = 7) => {
    // Mock trend data
    console.log('Getting trend data for user:', userId, 'days:', days);
    
    const mockTrend = [];
    for (let i = 0; i < days; i++) {
      mockTrend.push({
        date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
        avg_score: 40 + Math.floor(Math.random() * 40),
        max_score: 60 + Math.floor(Math.random() * 40)
      });
    }
    
    return { data: mockTrend };
  }
};
