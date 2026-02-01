import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { UploadFormData } from '@/pages/Upload';

interface RoleStepProps {
  formData: UploadFormData;
  updateFormData: (field: keyof UploadFormData, value: 'student' | 'lecturer' | 'owner') => void;
}

export function RoleStep({ formData, updateFormData }: RoleStepProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-display font-semibold mb-2">Upload Role</h2>
        <p className="text-muted-foreground">
          Select your role for this upload. This affects verification status.
        </p>
      </div>
      <RadioGroup
        value={formData.uploadRole}
        onValueChange={(value) => updateFormData('uploadRole', value as 'student' | 'lecturer' | 'owner')}
        className="space-y-3"
      >
        <div className="flex items-start space-x-3 p-4 rounded-xl border border-border hover:border-accent/50 transition-colors cursor-pointer">
          <RadioGroupItem value="student" id="student" className="mt-1" />
          <div className="flex-1">
            <Label htmlFor="student" className="cursor-pointer font-medium">
              Student
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Upload as a student resource. Won't receive verified badge.
            </p>
          </div>
          <span className="role-badge role-badge-student">Student</span>
        </div>
        <div className="flex items-start space-x-3 p-4 rounded-xl border border-border hover:border-accent/50 transition-colors cursor-pointer">
          <RadioGroupItem value="lecturer" id="lecturer" className="mt-1" />
          <div className="flex-1">
            <Label htmlFor="lecturer" className="cursor-pointer font-medium">
              Lecturer
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Upload as a lecturer. Content will be automatically verified.
            </p>
          </div>
          <span className="role-badge role-badge-lecturer">Verified</span>
        </div>
        <div className="flex items-start space-x-3 p-4 rounded-xl border border-border hover:border-accent/50 transition-colors cursor-pointer">
          <RadioGroupItem value="owner" id="owner" className="mt-1" />
          <div className="flex-1">
            <Label htmlFor="owner" className="cursor-pointer font-medium">
              Owner / Admin
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Upload as institution owner. Content marked as official.
            </p>
          </div>
          <span className="role-badge role-badge-owner">Official</span>
        </div>
      </RadioGroup>
    </div>
  );
}
