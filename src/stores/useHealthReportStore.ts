import ENDPOINTS from '@/constants/endpoints';
import type { DataCollect } from '@/models/data-collect';
import type { HealthReport } from '@/models/entities/health-report';
import type { GeminiGeneratorPayload, GeminiGeneratorResponse } from '@/models/gemini-http';
import cleanJSONParse from '@/utils/clean-json';
import { geminiHttpRequest } from '@/utils/http-request';
import { createHealthReportPrompt } from '@/utils/prompts';
import { create } from 'zustand';

type HealthReportStoreStates = {
    collectedData: DataCollect | undefined;
    loading: boolean;
    healthReport: HealthReport | undefined
}

type HealthReportStoreActions = {
    onGenerateReport: (data: DataCollect) => Promise<void>;
    onCancelReport: () => void;
    clearReport: () => void
}

let abortController: AbortController;

const useHealthReportStore = create<HealthReportStoreStates & HealthReportStoreActions>((set) => {
    return {
        //states
        collectedData: undefined,
        loading: false,
        healthReport: {
  "summary": {
    "name": "John Doe",
    "age": 34,
    "height": 175,
    "currentWeight": 85,
    "goalWeight": 70,
    "bmi": 27.8,
    "bmiCategory": "Overweight",
    "healthSummary": "Your BMI of 27.8 indicates you are slightly overweight. With consistent 60 minutes of daily exercise and a calorie-controlled diet, you can safely reach your goal weight within 12 weeks. Your overall cardiovascular and metabolic health can significantly improve by following this plan."
  },

  "exerciseCalendar": [
    { "day": "Monday", "activity": "Cardio (Running)", "duration": "45 min", "caloriesBurned": 400 },
    { "day": "Tuesday", "activity": "Strength Training (Full Body)", "duration": "60 min", "caloriesBurned": 450 },
    { "day": "Wednesday", "activity": "Yoga / Stretching", "duration": "30 min", "caloriesBurned": 150 },
    { "day": "Thursday", "activity": "Cardio (Cycling)", "duration": "45 min", "caloriesBurned": 380 },
    { "day": "Friday", "activity": "Strength Training (Upper Body)", "duration": "60 min", "caloriesBurned": 460 },
    { "day": "Saturday", "activity": "Cardio (Swimming)", "duration": "40 min", "caloriesBurned": 350 },
    { "day": "Sunday", "activity": "Rest / Light Stretching", "duration": "20 min", "caloriesBurned": 80 }
  ],

  "timeline": {
    "currentProgress": 20,
    "weeksToGoal": 9.6,
    "message": "You are 20% toward your goal weight. Stay consistent with exercise and nutrition to reach your goal in about 9–10 more weeks."
  },

  "charts": {
    "nutritionBreakdown": {
      "dailyCalories": 2200,
      "macros": [
        { "type": "Protein", "percentage": 30 },
        { "type": "Carbs", "percentage": 45 },
        { "type": "Fat", "percentage": 25 }
      ],
      "recommendation": "Maintain a moderate calorie deficit (~500 kcal/day) with balanced macronutrients. Focus on lean protein (chicken, fish, tofu), complex carbs (oats, brown rice), and healthy fats (olive oil, nuts). Stay hydrated with at least 2.5 liters of water daily."
    },
    "exerciseEffort": [
      { "day": "Mon", "caloriesBurned": 400, "durationMin": 45 },
      { "day": "Tue", "caloriesBurned": 450, "durationMin": 60 },
      { "day": "Wed", "caloriesBurned": 150, "durationMin": 30 },
      { "day": "Thu", "caloriesBurned": 380, "durationMin": 45 },
      { "day": "Fri", "caloriesBurned": 460, "durationMin": 60 },
      { "day": "Sat", "caloriesBurned": 350, "durationMin": 40 },
    ],
    "weightProgress": {
      "goalWeeks": 12,
      "targetLoss": 15,
      "progressData": [
        { "week": 0, "weight": 85 },
        { "week": 2, "weight": 82.5 },
        { "week": 4, "weight": 80 },
        { "week": 6, "weight": 78 },
        { "week": 8, "weight": 76 },
        { "week": 10, "weight": 73.5 },
        { "week": 12, "weight": 70 }
      ]
    },
    "activityComposition": [
      { "type": "Cardio", "value": 40 },
      { "type": "Strength", "value": 35 },
      { "type": "Stretching", "value": 15 },
      { "type": "Rest", "value": 10 }
    ],
    "bodyComposition": [
      { "type": "Muscle", "value": 40 },
      { "type": "Fat", "value": 25 },
      { "type": "Water", "value": 45 },
      { "type": "Bone", "value": 10 }
    ]
  },
},

        //actions
        onGenerateReport: async (data) => {
            abortController = new AbortController();
            try {
                set({ collectedData: data })
                set({ loading: true })
                const response = await geminiHttpRequest<GeminiGeneratorResponse, GeminiGeneratorPayload>({
                    method: 'POST',
                    endpoint: ENDPOINTS['GEMINI_2.5_FLASH'],
                    body: {
                        contents: [
                            {
                                parts: [
                                    {
                                        text: createHealthReportPrompt(data)
                                    }
                                ]
                            }
                        ]
                    },
                    signal: abortController.signal
                })
                set({ healthReport: cleanJSONParse(response.candidates[0].content.parts[0].text) })
            } catch (error) {
                throw error;
            } finally {
                set({ loading: false })
            }
        },
        onCancelReport: () => {
            abortController.abort(new Error('Canceled report generation'));
        },
        clearReport: () => {
            set({ healthReport: undefined })
        }
    }
})

export default useHealthReportStore;