// Client-side component
'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { generatePromptPayPayload } from '@/lib/promptpay';
import { Card } from './card';

// Configure your PromptPay ID here
const MERCHANT_ID = '0994569591';

interface QRCodeDisplayProps {
  amount: number;
}

export function QRCodeDisplay({ amount }: QRCodeDisplayProps) {
  const [qrCode, setQRCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const generateQR = async () => {
      try {
        // Generate PromptPay payload
        const payload = generatePromptPayPayload({
          phoneNumber: MERCHANT_ID,
          amount: amount,
        });

        // Generate QR code
        const qrDataUrl = await QRCode.toDataURL(payload, {
          type: 'image/png',
          width: 400,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        });

        setQRCode(qrDataUrl);
      } catch (err) {
        console.error('Error generating QR code:', err);
        setError('Failed to generate QR code');
      }
    };

    generateQR();
  }, [amount]);

  if (error) {
    return (
      <Card className="p-6 max-w-md mx-auto bg-destructive/10 text-destructive">
        <p className="text-center">{error}</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-2xl font-semibold">฿{amount.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">via PromptPay</p>
        </div>
        {qrCode && (
          <div className="flex justify-center">
            <img
              src={qrCode}
              alt="PromptPay QR Code"
              className="max-w-full h-auto"
            />
          </div>
        )}
      </div>
    </Card>
  );
}