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
        healthReport: undefined,

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