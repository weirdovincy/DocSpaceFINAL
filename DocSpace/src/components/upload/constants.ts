import {
  Building2,
  GraduationCap,
  BookOpen,
  UserCircle,
  Upload as UploadIcon,
} from 'lucide-react';

export const UPLOAD_STEPS = [
  { id: 1, title: 'College', icon: Building2 },
  { id: 2, title: 'Academic', icon: GraduationCap },
  { id: 3, title: 'Subject', icon: BookOpen },
  { id: 4, title: 'Role', icon: UserCircle },
  { id: 5, title: 'Upload', icon: UploadIcon },
];

export const BRANCHES = [
  'Computer Science (CSE)',
  'Electronics & Communication (ECE)',
  'Mechanical Engineering (MECH)',
  'Civil Engineering (CIVIL)',
  'Electrical Engineering (EE)',
  'Information Technology (IT)',
  'Chemical Engineering (CHEM)',
  'Biotechnology',
  'Other',
];

export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export const ACADEMIC_YEARS = ['2024-2025', '2023-2024', '2022-2023', '2021-2022'];
