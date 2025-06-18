// src/models/TransferJob.ts
export type TransferStatus = 'pending' | 'success' | 'failed';

export interface TransferJob {
    user_id: string;
    amount: number;
    currency: string;
    destination_account: string;
    attempt_count: number;
    provider_index: number;
    status: TransferStatus;
}