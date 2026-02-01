import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { usePdfUpload } from '@/hooks/usePdfUpload';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import step components
import { CollegeStep } from '@/components/upload/CollegeStep';
import { AcademicStep } from '@/components/upload/AcademicStep';
import { SubjectStep } from '@/components/upload/SubjectStep';
import { RoleStep } from '@/components/upload/RoleStep';
import { FileUploadStep } from '@/components/upload/FileUploadStep';
import { UploadSuccess } from '@/components/upload/UploadSuccess';
import { UPLOAD_STEPS } from '@/components/upload/constants';

export interface UploadFormData {
  collegeName: string;
  collegeAddress: string;
  institutionDetails: string;
  branch: string;
  yearOfStudy: string;
  academicYear: string;
  subjectName: string;
  chapter: string;
  description: string;
  uploadRole: 'student' | 'lecturer' | 'owner';
  file: File | null;
}

export default function Upload() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadResult, setUploadResult] = useState<{
    pdfId: string;
    fileUrl: string;
    summary: string | null;
    summaryGeneratedAt: string | null;
  } | null>(null);

  const {
    upload,
    stage,
    uploadProgress,
    extractProgress,
    isExtracting,
    isSummarizing,
    error: uploadError,
    reset: resetUpload,
  } = usePdfUpload();

  const [formData, setFormData] = useState<UploadFormData>({
    collegeName: profile?.college_name || '',
    collegeAddress: profile?.college_address || '',
    institutionDetails: '',
    branch: '',
    yearOfStudy: '',
    academicYear: '',
    subjectName: '',
    chapter: '',
    description: '',
    uploadRole: profile?.role || 'student',
    file: null,
  });

  const updateFormData = (field: keyof UploadFormData, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return Boolean(formData.collegeName && formData.collegeAddress);
      case 2:
        return Boolean(formData.branch && formData.yearOfStudy && formData.academicYear);
      case 3:
        return Boolean(formData.subjectName && formData.chapter);
      case 4:
        return Boolean(formData.uploadRole);
      case 5:
        return Boolean(formData.file);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    } else {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields before proceeding.',
        variant: 'destructive',
      });
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a PDF file.',
          variant: 'destructive',
        });
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Maximum file size is 50MB.',
          variant: 'destructive',
        });
        return;
      }
      updateFormData('file', file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.file) {
      toast({
        title: 'No file selected',
        description: 'Please select a PDF file to upload.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const result = await upload({
        ...formData,
        file: formData.file,
      });

      setUploadResult(result);

      toast({
        title: 'Upload successful!',
        description: result.summary 
          ? 'Your PDF has been uploaded and summarized.'
          : 'Your PDF has been uploaded. Summary will be generated later.',
      });
    } catch (err) {
      toast({
        title: 'Upload failed',
        description: err instanceof Error ? err.message : 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  const isUploading = stage !== 'idle' && stage !== 'complete' && stage !== 'error';

  // Show success screen with PDF viewer and summary
  if (uploadResult) {
    return (
      <Layout>
        <UploadSuccess
          result={uploadResult}
          fileName={formData.file?.name || 'Document'}
          onUploadAnother={() => {
            setUploadResult(null);
            resetUpload();
            setCurrentStep(1);
            setFormData({
              collegeName: profile?.college_name || '',
              collegeAddress: profile?.college_address || '',
              institutionDetails: '',
              branch: '',
              yearOfStudy: '',
              academicYear: '',
              subjectName: '',
              chapter: '',
              description: '',
              uploadRole: profile?.role || 'student',
              file: null,
            });
          }}
          onGoHome={() => navigate('/')}
        />
      </Layout>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <CollegeStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <AcademicStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <SubjectStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <RoleStep formData={formData} updateFormData={updateFormData} />;
      case 5:
        return (
          <FileUploadStep
            formData={formData}
            updateFormData={updateFormData}
            handleFileChange={handleFileChange}
            isUploading={isUploading}
            stage={stage}
            uploadProgress={uploadProgress}
            extractProgress={extractProgress}
            isExtracting={isExtracting}
            isSummarizing={isSummarizing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container max-w-3xl py-8 lg:py-12">
        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {UPLOAD_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "step-indicator",
                      currentStep === step.id && "step-indicator-active",
                      currentStep > step.id && "step-indicator-completed",
                      currentStep < step.id && "step-indicator-pending"
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <step.icon className="h-4 w-4" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs mt-2 hidden sm:block",
                      currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                {index < UPLOAD_STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 w-8 sm:w-16 lg:w-24 mx-2",
                      currentStep > step.id ? "bg-success" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-2xl p-6 lg:p-8">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={currentStep === 1 ? () => navigate('/') : handlePrevious}
              disabled={isUploading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </Button>

            {currentStep < 5 ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!formData.file || isUploading}
                className="glow-accent"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {stage === 'extracting' && 'Extracting text...'}
                    {stage === 'uploading' && 'Uploading...'}
                    {stage === 'summarizing' && 'Generating summary...'}
                    {stage === 'saving' && 'Saving...'}
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Upload PDF
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
