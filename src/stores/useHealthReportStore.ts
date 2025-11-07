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

const abortControllers: Record<string, AbortController> = {};

const useHealthReportStore = create<HealthReportStoreStates & HealthReportStoreActions>((set) => {
    return {
        //states
        collectedData: undefined,
        loading: false,
        healthReport: undefined,

        //actions
        onGenerateReport: async (data) => {
            abortControllers[ENDPOINTS['GEMINI_2.5_FLASH']] = new AbortController();
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
                    signal: abortControllers[ENDPOINTS['GEMINI_2.5_FLASH']].signal
                })
                set({ healthReport: cleanJSONParse(response.candidates[0].content.parts[0].text) })
            } catch (error) {
                throw error;
            } finally {
                set({ loading: false })
            }
        },
        onCancelReport: () => {
            abortControllers[ENDPOINTS['GEMINI_2.5_FLASH']].abort(new Error('Canceled report generation'));
            delete abortControllers[ENDPOINTS['GEMINI_2.5_FLASH']];
        },
        clearReport: () => {
            set({ healthReport: undefined })
        }
    }
})

export default useHealthReportStore;