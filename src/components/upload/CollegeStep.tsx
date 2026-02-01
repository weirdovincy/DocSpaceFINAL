import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { UploadFormData } from '@/pages/Upload';

interface CollegeStepProps {
  formData: UploadFormData;
  updateFormData: (field: keyof UploadFormData, value: string) => void;
}

export function CollegeStep({ formData, updateFormData }: CollegeStepProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-display font-semibold mb-2">College Information</h2>
        <p className="text-muted-foreground">
          Enter your institution details for proper classification.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="collegeName">College Name *</Label>
          <Input
            id="collegeName"
            placeholder="e.g., MIT, Stanford University"
            value={formData.collegeName}
            onChange={(e) => updateFormData('collegeName', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="collegeAddress">College Address *</Label>
          <Input
            id="collegeAddress"
            placeholder="City, State, Country"
            value={formData.collegeAddress}
            onChange={(e) => updateFormData('collegeAddress', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="institutionDetails">Additional Details (Optional)</Label>
          <Textarea
            id="institutionDetails"
            placeholder="Any additional institution information..."
            value={formData.institutionDetails}
            onChange={(e) => updateFormData('institutionDetails', e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
