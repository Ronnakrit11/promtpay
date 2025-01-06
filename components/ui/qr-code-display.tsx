'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface QRCodeDisplayProps {
  amount: number;
}

export function QRCodeDisplay({ amount }: QRCodeDisplayProps) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateQR = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/generate-qr', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate QR code');
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        setQrCode(data.qrCode);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate QR code');
      } finally {
        setLoading(false);
      }
    };

    generateQR();
  }, [amount]);

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Scan to Pay</h2>
          <p className="text-2xl font-bold text-primary">
            ฿{amount.toFixed(2)}
          </p>
        </div>
        
        <div className="flex items-center justify-center min-h-[400px]">
          {loading && (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Generating QR code...
              </p>
            </div>
          )}
          
          {error && (
            <div className="text-center text-destructive">
              <p>{error}</p>
              <p className="text-sm mt-2">Please try again later</p>
            </div>
          )}
          
          {!loading && !error && qrCode && (
            <img
              src={qrCode}
              alt="PromptPay QR Code"
              className="max-w-full h-auto"
              width={400}
              height={400}
            />
          )}
        </div>
      </div>
    </Card>
  );
}