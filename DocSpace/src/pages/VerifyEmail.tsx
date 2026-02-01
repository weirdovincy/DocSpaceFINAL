import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { FileText, Loader2, Mail, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VerifyEmail() {
    const { user, sendVerificationEmail, signOut } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleResend = async () => {
        setIsLoading(true);
        const { error } = await sendVerificationEmail();
        setIsLoading(false);

        if (error) {
            toast({
                title: 'Error sending email',
                description: error.message,
                variant: 'destructive',
            });
            return;
        }

        toast({
            title: 'Email Sent',
            description: 'Verification email has been resent. Please check your inbox and spam folder.',
        });
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="w-full max-w-md space-y-8 text-center">
                <div className="flex justify-center mb-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                        <Mail className="h-10 w-10 text-primary" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-display font-bold">Verify your email</h1>
                    <p className="text-muted-foreground text-lg">
                        We sent a verification link to <span className="font-medium text-foreground">{user.email}</span>
                    </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg text-sm text-left space-y-3">
                    <div className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                        <span>Check your spam or junk folder if you don't see the email.</span>
                    </div>
                    <div className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                        <span>Click the link in the email to verify your account.</span>
                    </div>
                    <div className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                        <span>Once verified, refresh this page or log in again.</span>
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <Button
                        onClick={handleResend}
                        className="w-full"
                        size="lg"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            'Resend Verification Email'
                        )}
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full"
                    >
                        Back to Login
                    </Button>
                </div>
            </div>
        </div>
    );
}
