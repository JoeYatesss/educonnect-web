import AuthHeader from '@/components/auth/AuthHeader';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <AuthHeader />
          {children}
        </div>
      </div>
    </div>
  );
}
