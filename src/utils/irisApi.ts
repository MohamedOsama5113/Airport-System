export type IrisStatus = 'Allowed' | 'Banned' | 'Unknown';

export interface ApiRootResponse {
    message?: string;
    endpoints?: string[] | Record<string, string>;
    [key: string]: unknown;
}

export interface ApiHealthResponse {
    status: 'ok' | string;
    model_loaded: boolean;
    csv_loaded: boolean;
    num_classes: number;
    banned_records: number;
}

export interface PredictResponse {
    person_id: string;
    predicted_label: string;
    status: IrisStatus;
    confidence: number;
    is_banned: boolean;
    message: string;
}

const API_BASE_URL = 'https://gloriageorge14-iris-eye.hf.space';

async function parseErrorResponse(response: Response): Promise<string> {
    try {
        const payload = await response.json();
        if (payload && typeof payload === 'object') {
            const maybeMessage = (payload as { detail?: string; message?: string }).detail
                ?? (payload as { detail?: string; message?: string }).message;
            if (maybeMessage) {
                return maybeMessage;
            }
        }
    } catch {
        // Ignore JSON parsing errors and fallback to status text.
    }

    return response.statusText || 'Request failed';
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, init);

    if (!response.ok) {
        const errorMessage = await parseErrorResponse(response);
        throw new Error(`${response.status} ${errorMessage}`.trim());
    }

    return response.json() as Promise<T>;
}

export const irisApi = {
    getRoot: () => fetchJson<ApiRootResponse>('/'),
    getHealth: () => fetchJson<ApiHealthResponse>('/health'),
    predict: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        return fetchJson<PredictResponse>('/predict', {
            method: 'POST',
            body: formData,
        });
    },
};
