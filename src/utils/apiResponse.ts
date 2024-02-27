import { Response } from 'express';

// Define a standard format for successful responses
interface SuccessResponse {
  success: boolean;
  data: any;
}

// Helper function to send successful responses
export function sendSuccessResponse(res: Response, data: any): void {
  const response: SuccessResponse = {
    success: true,
    data: data
  };
  res.json(response);
}
