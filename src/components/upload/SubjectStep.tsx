import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { UploadFormData } from '@/pages/Upload';

interface SubjectStepProps {
  formData: UploadFormData;
  updateFormData: (field: keyof UploadFormData, value: string) => void;
}

export function SubjectStep({ formData, updateFormData }: SubjectStepProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-display font-semibold mb-2">Subject Details</h2>
        <p className="text-muted-foreground">
          Provide information about the subject and topic.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="subjectName">Subject Name *</Label>
          <Input
            id="subjectName"
            placeholder="e.g., Data Structures, Thermodynamics"
            value={formData.subjectName}
            onChange={(e) => updateFormData('subjectName', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="chapter">Chapter / Unit / Topic *</Label>
          <Input
            id="chapter"
            placeholder="e.g., Unit 3 - Binary Trees"
            value={formData.chapter}
            onChange={(e) => updateFormData('chapter', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Brief description of the content..."
            value={formData.description}
            onChange={(e) => updateFormData('description', e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
