import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  FileText, 
  Calendar, 
  User, 
  CheckCircle2,
  ChevronRight,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const BRANCHES = [
  'All Branches',
  'Computer Science (CSE)',
  'Electronics & Communication (ECE)',
  'Mechanical Engineering (MECH)',
  'Civil Engineering (CIVIL)',
  'Electrical Engineering (EE)',
  'Information Technology (IT)',
];

const YEARS = ['All Years', '1st Year', '2nd Year', '3rd Year', '4th Year'];

// Mock data for demonstration
const MOCK_PDFS = [
  {
    id: '1',
    title: 'Data Structures - Binary Trees Complete Guide',
    subject: 'Data Structures',
    chapter: 'Unit 3 - Binary Trees',
    branch: 'Computer Science (CSE)',
    year: '2nd Year',
    uploadedBy: 'Dr. Smith',
    uploadRole: 'lecturer',
    uploadDate: '2024-01-15',
    isVerified: true,
  },
  {
    id: '2',
    title: 'Thermodynamics Lecture Notes',
    subject: 'Thermodynamics',
    chapter: 'Chapter 5 - Heat Engines',
    branch: 'Mechanical Engineering (MECH)',
    year: '2nd Year',
    uploadedBy: 'John Doe',
    uploadRole: 'student',
    uploadDate: '2024-01-10',
    isVerified: false,
  },
  {
    id: '3',
    title: 'Digital Electronics - Combinational Circuits',
    subject: 'Digital Electronics',
    chapter: 'Unit 2 - Logic Gates',
    branch: 'Electronics & Communication (ECE)',
    year: '1st Year',
    uploadedBy: 'Prof. Johnson',
    uploadRole: 'owner',
    uploadDate: '2024-01-08',
    isVerified: true,
  },
];

export default function Find() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredPDFs = MOCK_PDFS.filter((pdf) => {
    const matchesSearch =
      pdf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pdf.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pdf.chapter.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBranch = selectedBranch === 'All Branches' || pdf.branch === selectedBranch;
    const matchesYear = selectedYear === 'All Years' || pdf.year === selectedYear;
    const matchesVerified = !verifiedOnly || pdf.isVerified;

    return matchesSearch && matchesBranch && matchesYear && matchesVerified;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'lecturer':
        return <span className="role-badge role-badge-lecturer">Lecturer</span>;
      case 'owner':
        return <span className="role-badge role-badge-owner">Official</span>;
      default:
        return <span className="role-badge role-badge-student">Student</span>;
    }
  };

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-72 border-r border-border p-6 bg-card/50">
          <div className="sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-display font-semibold">Filters</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Branch / Stream</Label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger>
                    <SelectValue />
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
                <Label>Year</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue />
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

              <div className="flex items-center justify-between">
                <Label htmlFor="verified-only" className="cursor-pointer">
                  Verified only
                </Label>
                <Switch
                  id="verified-only"
                  checked={verifiedOnly}
                  onCheckedChange={setVerifiedOnly}
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setSelectedBranch('All Branches');
                  setSelectedYear('All Years');
                  setVerifiedOnly(false);
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="container py-8">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by title, subject, or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-lg rounded-xl"
                />
              </div>

              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                className="lg:hidden mt-4"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* Mobile Filters Panel */}
            {showFilters && (
              <div className="lg:hidden mb-6 p-4 rounded-xl border border-border bg-card animate-slide-down">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Filters</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger>
                      <SelectValue placeholder="Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRANCHES.map((branch) => (
                        <SelectItem key={branch} value={branch}>
                          {branch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="verified-only-mobile">Verified only</Label>
                    <Switch
                      id="verified-only-mobile"
                      checked={verifiedOnly}
                      onCheckedChange={setVerifiedOnly}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-muted-foreground">
                Found <span className="font-medium text-foreground">{filteredPDFs.length}</span> resources
              </p>
            </div>

            {/* PDF Grid */}
            {filteredPDFs.length > 0 ? (
              <div className="grid gap-4">
                {filteredPDFs.map((pdf) => (
                  <div
                    key={pdf.id}
                    className="group glass-card glass-card-hover rounded-xl p-5 cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 p-3 rounded-xl bg-accent/10">
                        <FileText className="h-6 w-6 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-medium text-lg mb-1 group-hover:text-accent transition-colors">
                              {pdf.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {pdf.subject} • {pdf.chapter}
                            </p>
                          </div>
                          {pdf.isVerified && (
                            <div className="verified-badge shrink-0">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Verified
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" />
                            {pdf.uploadedBy}
                            {getRoleBadge(pdf.uploadRole)}
                          </div>
                          <span className="hidden sm:inline">•</span>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(pdf.uploadDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No resources found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
