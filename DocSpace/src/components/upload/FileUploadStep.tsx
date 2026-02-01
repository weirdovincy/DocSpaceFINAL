import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload as UploadIcon, FileText, Loader2, Brain, CloudUpload, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UploadFormData } from '@/pages/Upload';

interface FileUploadStepProps {
  formData: UploadFormData;
  updateFormData: (field: keyof UploadFormData, value: File | null) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  stage: string;
  uploadProgress: number;
  extractProgress: number;
  isExtracting: boolean;
  isSummarizing: boolean;
}

export function FileUploadStep({
  formData,
  updateFormData,
  handleFileChange,
  isUploading,
  stage,
  uploadProgress,
  extractProgress,
  isExtracting,
  isSummarizing,
}: FileUploadStepProps) {
  const getStageIcon = () => {
    switch (stage) {
      case 'extracting':
        return <FileText className="h-12 w-12 text-accent animate-pulse" />;
      case 'uploading':
        return <CloudUpload className="h-12 w-12 text-accent animate-pulse" />;
      case 'summarizing':
        return <Brain className="h-12 w-12 text-accent animate-pulse" />;
      case 'saving':
        return <Save className="h-12 w-12 text-accent animate-pulse" />;
      default:
        return <Loader2 className="h-12 w-12 text-accent animate-spin" />;
    }
  };

  const getStageLabel = () => {
    switch (stage) {
      case 'extracting':
        return 'Extracting text from PDF...';
      case 'uploading':
        return 'Uploading file to storage...';
      case 'summarizing':
        return 'AI is generating summary...';
      case 'saving':
        return 'Saving metadata...';
      default:
        return 'Processing...';
    }
  };

  const getProgress = () => {
    if (stage === 'extracting') return extractProgress;
    return uploadProgress;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-display font-semibold mb-2">Upload PDF</h2>
        <p className="text-muted-foreground">
          Select your PDF file. Maximum size: 50MB.
        </p>
      </div>

      {!isUploading ? (
        <div className="space-y-4">
          <label
            htmlFor="file-upload"
            className={cn(
              "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all",
              formData.file
                ? "border-accent bg-accent/5"
                : "border-border hover:border-accent/50 hover:bg-muted/50"
            )}
          >
            {formData.file ? (
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-xl bg-accent/10 mb-3">
                  <FileText className="h-8 w-8 text-accent" />
                </div>
                <p className="font-medium text-foreground">{formData.file.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-xl bg-muted mb-3">
                  <UploadIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="font-medium">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground mt-1">PDF only (max 50MB)</p>
              </div>
            )}
            <input
              id="file-upload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {formData.file && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateFormData('file', null)}
            >
              Remove file
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6 py-8">
          <div className="flex flex-col items-center">
            {getStageIcon()}
            <p className="font-medium mt-4 mb-2">{getStageLabel()}</p>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              {stage === 'summarizing' 
                ? 'Our AI is reading your document and creating a comprehensive summary.'
                : 'Please wait while we process your file.'}
            </p>
          </div>
          <Progress value={getProgress()} className="h-2" />
          <p className="text-center text-sm text-muted-foreground">{getProgress()}% complete</p>
        </div>
      )}
    </div>
  );
}
