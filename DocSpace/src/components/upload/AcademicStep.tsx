import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BRANCHES, YEARS, ACADEMIC_YEARS } from './constants';
import type { UploadFormData } from '@/pages/Upload';

interface AcademicStepProps {
  formData: UploadFormData;
  updateFormData: (field: keyof UploadFormData, value: string) => void;
}

export function AcademicStep({ formData, updateFormData }: AcademicStepProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-display font-semibold mb-2">Academic Classification</h2>
        <p className="text-muted-foreground">
          Select the academic details for this resource.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Branch / Stream *</Label>
          <Select
            value={formData.branch}
            onValueChange={(value) => updateFormData('branch', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              {BRANCHES.map((branch) => (
                <SelectItem key={branch} value={branch}>
                  {branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Year of Study *</Label>
          <Select
            value={formData.yearOfStudy}
            onValueChange={(value) => updateFormData('yearOfStudy', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Academic Year *</Label>
          <Select
            value={formData.academicYear}
            onValueChange={(value) => updateFormData('academicYear', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select academic year" />
            </SelectTrigger>
            <SelectContent>
              {ACADEMIC_YEARS.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
