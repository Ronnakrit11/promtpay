// PromptPay QR Code generation utility
import generatePayload from 'promptpay-qr';

export interface PromptPayConfig {
  phoneNumber: string;
  amount: number;
}

export const generatePromptPayQR = ({ phoneNumber, amount }: PromptPayConfig) => {
  try {
    return generatePayload(phoneNumber, { amount });
  } catch (error) {
    console.error('Error generating PromptPay payload:', error);
    throw new Error('Failed to generate PromptPay QR code');
  }
};