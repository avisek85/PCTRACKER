export const normalizeTimeResponse = (data, timeUnit, value) => ({
    success: true,
    timeUnit,
    timeValue: value, // date/week/month/year
    totalDuration: data.reduce((sum, activity) => sum + activity.duration, 0),
    byApp: data.reduce((acc, activity) => {
      if (!acc[activity.app]) {
        acc[activity.app] = {
          totalDuration: 0,
          sessions: []
        };
      }
      acc[activity.app].totalDuration += activity.duration;
      acc[activity.app].sessions.push({
        title: activity.title,
        duration: activity.duration,
        startTime: activity.startTime,
        endTime: activity.endTime,
        date: activity.date // Added date field from the model
      });
      return acc;
    }, {})
  });