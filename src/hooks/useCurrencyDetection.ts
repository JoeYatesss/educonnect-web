'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { API_URL } from '@/lib/constants';

export interface CurrencyData {
  detected_country: string;
  detected_country_name: string;
  detected_currency: string;
  preferred_currency: string | null;
  effective_currency: string;
  price_amount: number;
  price_formatted: string;
  available_currencies: string[];
}

interface UseCurrencyDetectionResult {
  currencyData: CurrencyData | null;
  priceFormatted: string;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const DEFAULT_PRICE = '$14.99';

export function useCurrencyDetection(): UseCurrencyDetectionResult {
  const [currencyData, setCurrencyData] = useState<CurrencyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrency = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/v1/payments/detect-currency`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setCurrencyData(data);
      } else {
        setError('Failed to detect currency');
      }
    } catch (err) {
      setError('Error detecting currency');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrency();
  }, [fetchCurrency]);

  return {
    currencyData,
    priceFormatted: currencyData?.price_formatted || DEFAULT_PRICE,
    loading,
    error,
    refetch: fetchCurrency,
  };
}

export default useCurrencyDetection;
