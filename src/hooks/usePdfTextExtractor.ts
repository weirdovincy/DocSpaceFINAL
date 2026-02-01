import { useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source using a compatible worker for pdfjs-dist v4
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface ExtractionResult {
  text: string;
  pageCount: number;
}

export function usePdfTextExtractor() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const extractText = useCallback(async (file: File): Promise<ExtractionResult> => {
    setIsExtracting(true);
    setProgress(0);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pageCount = pdf.numPages;
      let fullText = '';

      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n\n';
        setProgress(Math.round((i / pageCount) * 100));
      }

      setIsExtracting(false);
      return { text: fullText.trim(), pageCount };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to extract text from PDF';
      setError(errorMessage);
      setIsExtracting(false);
      throw new Error(errorMessage);
    }
  }, []);

  return {
    extractText,
    isExtracting,
    progress,
    error,
  };
}
