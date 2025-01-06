import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { generatePromptPayPayload } from '@/lib/promptpay';

// Configure your PromptPay ID here (must be a valid Thai phone number)
const MERCHANT_ID = '0994569591'; // Replace with your actual PromptPay number

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    // Generate PromptPay payload
    const payload = generatePromptPayPayload({
      phoneNumber: MERCHANT_ID,
      amount: Number(amount),
    });

    // Generate QR code as data URL with higher error correction
    const qrCode = await QRCode.toDataURL(payload, {
      type: 'image/png',
      width: 400,
      margin: 1,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#000000',
        light: '#ffffff',
      }
    });

    return NextResponse.json({ qrCode });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}