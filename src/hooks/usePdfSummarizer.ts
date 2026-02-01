import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SummaryResult {
  summary: string;
  generatedAt: string;
  model: string;
}

export function usePdfSummarizer() {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summarize = useCallback(async (pdfText: string, fileName?: string): Promise<SummaryResult> => {
    setIsSummarizing(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('summarize-pdf', {
        body: { pdfText, fileName },
      });

      if (fnError) {
        throw new Error(fnError.message || 'Failed to generate summary');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setIsSummarizing(false);
      return {
        summary: data.summary,
        generatedAt: data.generatedAt,
        model: data.model,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate summary';
      setError(errorMessage);
      setIsSummarizing(false);
      throw new Error(errorMessage);
    }
  }, []);

  return {
    summarize,
    isSummarizing,
    error,
  };
}
