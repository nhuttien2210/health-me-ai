export type GeminiErrorResponse = {
    code: number,
    message: string,
    status: string,
    details: Array<unknown>
}

export type GeminiGeneratorPayload = {
    contents: Pick<Content, 'parts'>[]
}

export type  GeminiGeneratorResponse = {
    candidates: Candidate[]
    usageMetadata: UsageMetadata
    modelVersion: string
    responseId: string
}

export type Candidate = {
    content: Content
    finishReason: string
    index: number
}

export type Content = {
    parts: Part[]
    role: string
}

export type Part = {
    text: string
}

export type UsageMetadata = {
    promptTokenCount: number
    candidatesTokenCount: number
    totalTokenCount: number
    promptTokensDetails: PromptTokensDetail[]
    thoughtsTokenCount: number
}

export type PromptTokensDetail = {
    modality: string
    tokenCount: number
}
