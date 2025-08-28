'use client';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold tracking-tight">Sales Pulse</h1>
            <div className="hidden sm:block text-sm text-muted-foreground">
              Dashboard
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{user.username}</span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign out</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}