import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { 
  Upload, 
  Search, 
  FileText, 
  CheckCircle2, 
  Trophy, 
  Star,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  const { profile } = useAuth();

  const stats = [
    {
      label: 'PDFs Uploaded',
      value: '0',
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/5',
    },
    {
      label: 'Verified PDFs',
      value: '0',
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/5',
    },
    {
      label: 'Your Points',
      value: profile?.points?.toString() || '0',
      icon: Star,
      color: 'text-warning',
      bgColor: 'bg-warning/5',
    },
    {
      label: 'Your Rank',
      value: '#—',
      icon: Trophy,
      color: 'text-accent',
      bgColor: 'bg-accent/5',
    },
  ];

  return (
    <Layout>
      <div className="container py-8 lg:py-12">
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-display font-bold mb-2">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-muted-foreground text-lg">
            Ready to share or discover academic resources?
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card group hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="text-2xl lg:text-3xl font-display font-bold mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Upload PDF Card */}
          <Link to="/upload" className="group">
            <div className="action-card action-card-primary h-full">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <Upload className="w-full h-full" />
              </div>
              <div className="relative z-10">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm mb-4">
                    <Upload className="h-7 w-7" />
                  </div>
                </div>
                <h3 className="text-2xl font-display font-bold mb-3">
                  Upload PDF
                </h3>
                <p className="text-white/80 mb-6 leading-relaxed">
                  Share academic resources with your community. Earn 5 points for each verified upload.
                </p>
                <div className="flex items-center gap-2 text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                  Start uploading
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Find PDF Card */}
          <Link to="/find" className="group">
            <div className="action-card h-full border border-border/50">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                <Search className="w-full h-full" />
              </div>
              <div className="relative z-10">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-4">
                    <Search className="h-7 w-7 text-accent" />
                  </div>
                </div>
                <h3 className="text-2xl font-display font-bold mb-3">
                  Find PDF
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Discover verified academic resources. Filter by branch, year, and subject.
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-accent group-hover:gap-3 transition-all">
                  Browse resources
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-xl font-display font-semibold mb-4">Recent Activity</h2>
          <div className="glass-card rounded-2xl p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              No recent activity yet. Start by uploading your first PDF!
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
