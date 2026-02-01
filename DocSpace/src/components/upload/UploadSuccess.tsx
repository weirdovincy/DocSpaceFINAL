import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { 
  CheckCircle2, 
  FileText, 
  Brain, 
  Calendar,
  Upload,
  Home,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';

interface UploadSuccessProps {
  result: {
    pdfId: string;
    fileUrl: string;
    summary: string | null;
    summaryGeneratedAt: string | null;
  };
  fileName: string;
  onUploadAnother: () => void;
  onGoHome: () => void;
}

export function UploadSuccess({ result, fileName, onUploadAnother, onGoHome }: UploadSuccessProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'preview'>('summary');

  return (
    <div className="h-[calc(100vh-4rem)]">
      {/* Success Header */}
      <div className="bg-success/10 border-b border-success/20 px-6 py-4">
        <div className="container max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-success/20">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-lg">Upload Successful!</h1>
              <p className="text-sm text-muted-foreground">
                {fileName} • +5 points earned
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onUploadAnother}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Another
            </Button>
            <Button size="sm" onClick={onGoHome}>
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>
        </div>
      </div>

      {/* Split Panel View */}
      <ResizablePanelGroup direction="horizontal" className="h-[calc(100%-4.5rem)]">
        {/* Left Panel - PDF Preview */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium truncate">{fileName}</span>
            </div>
            <div className="flex-1 bg-muted/20">
              <iframe
                src={result.fileUrl}
                className="w-full h-full"
                title="PDF Preview"
              />
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Panel - AI Summary */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
              <Brain className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">AI Summary</span>
              <Sparkles className="h-3 w-3 text-accent ml-1" />
            </div>
            
            <ScrollArea className="flex-1 p-6">
              {result.summary ? (
                <div className="space-y-4">
                  {/* Generated timestamp */}
                  {result.summaryGeneratedAt && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pb-4 border-b">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Generated on {format(new Date(result.summaryGeneratedAt), 'PPP \'at\' p')}
                      </span>
                      <span className="ml-auto px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs">
                        Gemini AI
                      </span>
                    </div>
                  )}

                  {/* Summary content with markdown-like rendering */}
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {result.summary.split('\n').map((line, index) => {
                      if (line.startsWith('## ')) {
                        return (
                          <h2 key={index} className="text-lg font-display font-semibold mt-6 mb-3 text-foreground">
                            {line.replace('## ', '')}
                          </h2>
                        );
                      }
                      if (line.startsWith('- ')) {
                        return (
                          <li key={index} className="text-muted-foreground ml-4">
                            {line.replace('- ', '')}
                          </li>
                        );
                      }
                      if (line.trim() === '') {
                        return <br key={index} />;
                      }
                      return (
                        <p key={index} className="text-muted-foreground leading-relaxed">
                          {line}
                        </p>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="p-4 rounded-full bg-warning/10 mb-4">
                    <AlertCircle className="h-8 w-8 text-warning" />
                  </div>
                  <h3 className="font-medium mb-2">Summary Pending</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    The AI summary couldn't be generated immediately. It will be available shortly.
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
