import { Dumbbell } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const Layout = ({ children, title }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800 safe-area-top">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Gym Tracker</h1>
              {title && (
                <p className="text-xs text-gray-400">{title}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 pb-safe-bottom">
        {children}
      </main>

      <footer className="border-t border-gray-800 py-4">
        <p className="text-center text-xs text-gray-500">
          Foco: Ganho de massa muscular e fortalecimento das costas
        </p>
      </footer>
    </div>
  );
};
