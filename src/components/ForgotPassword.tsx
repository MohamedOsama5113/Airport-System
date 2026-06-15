import { ArrowLeft, Mail, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-600 via-blue-500 to-blue-700 flex items-start justify-center px-4 py-6 sm:items-center sm:py-4">
            <div className="w-full max-w-sm sm:max-w-md">
                <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-3xl shadow-2xl mb-4">
                        <ShieldCheck className="w-9 h-9 sm:w-11 sm:h-11 text-blue-600" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl text-white mb-2">Reset Password</h1>
                    <p className="text-blue-100">We’ll send a reset link to your email</p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-5 sm:p-8">
                    <div className="text-center mb-6 sm:mb-8">
                        <h2 className="text-xl sm:text-2xl text-gray-900 mb-2">Forgot your password?</h2>
                        <p className="text-gray-600">Enter the email used for your admin account.</p>
                    </div>

                    {sent ? (
                        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-center">
                            <p className="text-green-800 font-medium mb-1">Reset link sent</p>
                            <p className="text-sm text-green-700 wrap-break-word">
                                If an account exists for {email}, you’ll receive reset instructions shortly.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                            <div>
                                <label className="block text-sm text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@airport.com"
                                        className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3.5 sm:py-4 rounded-xl transition-all shadow-lg shadow-blue-500/30 text-base sm:text-lg"
                            >
                                Send Reset Link
                            </button>
                        </form>
                    )}

                    <button
                        type="button"
                        onClick={() => navigate('/admin/login')}
                        className="mt-5 sm:mt-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to login
                    </button>
                </div>
            </div>
        </div>
    );
}