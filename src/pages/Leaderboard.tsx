import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Award, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock leaderboard data
const MOCK_LEADERBOARD = [
  { id: '1', name: 'Sarah Chen', points: 450, avatar: null, uploads: 90 },
  { id: '2', name: 'Michael Park', points: 380, avatar: null, uploads: 76 },
  { id: '3', name: 'Emma Wilson', points: 325, avatar: null, uploads: 65 },
  { id: '4', name: 'James Rodriguez', points: 290, avatar: null, uploads: 58 },
  { id: '5', name: 'Priya Sharma', points: 265, avatar: null, uploads: 53 },
  { id: '6', name: 'David Kim', points: 240, avatar: null, uploads: 48 },
  { id: '7', name: 'Lisa Anderson', points: 215, avatar: null, uploads: 43 },
  { id: '8', name: 'Alex Thompson', points: 190, avatar: null, uploads: 38 },
  { id: '9', name: 'Nina Patel', points: 165, avatar: null, uploads: 33 },
  { id: '10', name: 'Chris Lee', points: 140, avatar: null, uploads: 28 },
];

export default function Leaderboard() {
  const { profile } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-200/50 to-gray-300/50 border-gray-300/50';
      case 3:
        return 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30';
      default:
        return 'bg-card';
    }
  };

  const top3 = MOCK_LEADERBOARD.slice(0, 3);
  const rest = MOCK_LEADERBOARD.slice(3);

  return (
    <Layout>
      <div className="container max-w-4xl py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-4">
            <Trophy className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold mb-3">Leaderboard</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Top contributors in our community. Upload PDFs to earn points and climb the ranks!
          </p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {/* 2nd Place */}
          <div className="mt-8">
            <div className={cn("rounded-2xl p-5 border text-center", getRankStyle(2))}>
              <div className="flex justify-center mb-3">
                <Avatar className="h-16 w-16 border-2 border-gray-300">
                  <AvatarImage src={top3[1]?.avatar || undefined} />
                  <AvatarFallback className="text-lg bg-gray-200 text-gray-700">
                    {getInitials(top3[1]?.name || '')}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex justify-center mb-2">
                {getRankIcon(2)}
              </div>
              <h3 className="font-medium text-sm truncate mb-1">{top3[1]?.name}</h3>
              <p className="text-lg font-display font-bold text-foreground">{top3[1]?.points}</p>
              <p className="text-xs text-muted-foreground">points</p>
            </div>
          </div>

          {/* 1st Place */}
          <div>
            <div className={cn("rounded-2xl p-6 border text-center", getRankStyle(1))}>
              <div className="flex justify-center mb-3">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-2 border-yellow-400">
                    <AvatarImage src={top3[0]?.avatar || undefined} />
                    <AvatarFallback className="text-xl bg-yellow-100 text-yellow-700">
                      {getInitials(top3[0]?.name || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1">
                    <Star className="h-4 w-4 text-yellow-900" />
                  </div>
                </div>
              </div>
              <div className="flex justify-center mb-2">
                {getRankIcon(1)}
              </div>
              <h3 className="font-medium truncate mb-1">{top3[0]?.name}</h3>
              <p className="text-2xl font-display font-bold text-foreground">{top3[0]?.points}</p>
              <p className="text-xs text-muted-foreground">points</p>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="mt-8">
            <div className={cn("rounded-2xl p-5 border text-center", getRankStyle(3))}>
              <div className="flex justify-center mb-3">
                <Avatar className="h-16 w-16 border-2 border-amber-500">
                  <AvatarImage src={top3[2]?.avatar || undefined} />
                  <AvatarFallback className="text-lg bg-amber-100 text-amber-700">
                    {getInitials(top3[2]?.name || '')}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex justify-center mb-2">
                {getRankIcon(3)}
              </div>
              <h3 className="font-medium text-sm truncate mb-1">{top3[2]?.name}</h3>
              <p className="text-lg font-display font-bold text-foreground">{top3[2]?.points}</p>
              <p className="text-xs text-muted-foreground">points</p>
            </div>
          </div>
        </div>

        {/* Rest of Leaderboard */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-display font-semibold">Rankings</h2>
          </div>
          <div className="divide-y divide-border">
            {rest.map((user, index) => {
              const rank = index + 4;
              const isCurrentUser = user.id === profile?.id;

              return (
                <div
                  key={user.id}
                  className={cn(
                    "flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors",
                    isCurrentUser && "bg-accent/5"
                  )}
                >
                  <div className="w-8 text-center font-display font-bold text-muted-foreground">
                    {rank}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar || undefined} />
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className={cn("font-medium truncate", isCurrentUser && "text-accent")}>
                      {user.name}
                      {isCurrentUser && <span className="ml-2 text-xs text-muted-foreground">(You)</span>}
                    </p>
                    <p className="text-sm text-muted-foreground">{user.uploads} uploads</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold">{user.points}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Points Info */}
        <div className="mt-8 p-6 rounded-2xl bg-accent/5 border border-accent/20">
          <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
            <Star className="h-5 w-5 text-accent" />
            How to Earn Points
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="font-medium text-foreground">+5 points</span> — Successfully upload a PDF with complete metadata
            </li>
            <li className="flex items-center gap-2">
              <span className="font-medium text-foreground">+0 points</span> — Duplicate or incomplete uploads don't earn points
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
