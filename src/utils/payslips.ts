import { PayslipsListResponse, PayslipDownloadRequest } from '@/types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';

export const payslipsApi = {
    // Get list of payslips for the authenticated user
    async getPayslipsList(token: string): Promise<PayslipsListResponse> {
        const response = await fetch(`${BACKEND_URL}/api/v1/payslips/list`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch payslips list');
        }

        return response.json();
    },

    // Download a payslip file
    async downloadPayslip(token: string, downloadData: PayslipDownloadRequest): Promise<Blob> {
        const response = await fetch(`${BACKEND_URL}/api/v1/payslips/download`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(downloadData),
        });

        if (!response.ok) {
            throw new Error('Failed to download payslip');
        }

        return response.blob();
    },

    // Helper function to trigger file download
    async downloadAndSavePayslip(token: string, downloadData: PayslipDownloadRequest): Promise<void> {
        try {
            const blob = await this.downloadPayslip(token, downloadData);
            
            // Create a temporary URL for the blob
            const url = window.URL.createObjectURL(blob);
            
            // Create a temporary anchor element and trigger download
            const link = document.createElement('a');
            link.href = url;
            link.download = downloadData.filename;
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading payslip:', error);
            throw error;
        }
    }
};
