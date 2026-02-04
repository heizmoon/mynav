import { Dashboard } from '@/components/Dashboard';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center pt-20">
      <h1 className="sr-only">My Nexus Navigation</h1>
      <Dashboard />
    </main>
  );
}
