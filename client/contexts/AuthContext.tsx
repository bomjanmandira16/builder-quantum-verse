import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'viewer';
  joinedAt: Date;
  lastActive: Date;
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
    canInvite: boolean;
    canManageUsers: boolean;
  };
}

export interface TeamMember extends User {
  invitedBy?: string;
  status: 'active' | 'pending' | 'suspended';
}

interface AuthContextType {
  currentUser: User | null;
  teamMembers: TeamMember[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  inviteTeamMember: (email: string, role: User['role']) => Promise<boolean>;
  updateUserRole: (userId: string, role: User['role']) => void;
  removeTeamMember: (userId: string) => void;
  updateProfile: (updates: Partial<User>) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Load from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('baatometrics-user');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            ...parsed,
            joinedAt: new Date(parsed.joinedAt),
            lastActive: new Date(parsed.lastActive)
          };
        } catch (error) {
          console.error('Error loading user:', error);
        }
      }
    }
    return null;
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    // Load team from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('baatometrics-team');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.map((member: any) => ({
            ...member,
            joinedAt: new Date(member.joinedAt),
            lastActive: new Date(member.lastActive)
          }));
        } catch (error) {
          console.error('Error loading team:', error);
        }
      }
    }
    return [];
  });

  const isAuthenticated = !!currentUser;

  // Save user to localStorage
  const saveUser = (user: User | null) => {
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('baatometrics-user', JSON.stringify(user));
      } else {
        localStorage.removeItem('baatometrics-user');
      }
    }
  };

  // Save team to localStorage
  const saveTeam = (team: TeamMember[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('baatometrics-team', JSON.stringify(team));
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      const user: User = {
        id: '1',
        email,
        name: email.split('@')[0].replace(/[._]/g, ' '),
        role: 'admin',
        joinedAt: new Date(),
        lastActive: new Date(),
        permissions: {
          canEdit: true,
          canDelete: true,
          canInvite: true,
          canManageUsers: true
        }
      };
      setCurrentUser(user);
      saveUser(user);
      return true;
    }
    return false;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    // Simulate Google OAuth - in real implementation this would use Google API
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate getting real Google user data
    const googleUserData = {
      email: 'bomjan.mandira@gmail.com',
      name: 'Bomjan Mandira',
      avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c', // Google profile pic
      given_name: 'Bomjan',
      family_name: 'Mandira'
    };

    const user: User = {
      id: 'google_' + Date.now(),
      email: googleUserData.email,
      name: googleUserData.name,
      avatar: googleUserData.avatar,
      role: 'admin',
      joinedAt: new Date(),
      lastActive: new Date(),
      permissions: {
        canEdit: true,
        canDelete: true,
        canInvite: true,
        canManageUsers: true
      }
    };
    setCurrentUser(user);
    saveUser(user);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    saveUser(null);
  };

  const inviteTeamMember = async (email: string, role: User['role']): Promise<boolean> => {
    if (!currentUser?.permissions.canInvite) return false;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newMember: TeamMember = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0].replace(/[._]/g, ' '),
      role,
      joinedAt: new Date(),
      lastActive: new Date(),
      invitedBy: currentUser.id,
      status: 'pending',
      permissions: {
        canEdit: role !== 'viewer',
        canDelete: role === 'admin',
        canInvite: role === 'admin',
        canManageUsers: role === 'admin'
      }
    };
    
    const updatedTeam = [...teamMembers, newMember];
    setTeamMembers(updatedTeam);
    saveTeam(updatedTeam);
    return true;
  };

  const updateUserRole = (userId: string, role: User['role']) => {
    if (!currentUser?.permissions.canManageUsers) return;
    
    const updatedTeam = teamMembers.map(member => 
      member.id === userId 
        ? { 
            ...member, 
            role,
            permissions: {
              canEdit: role !== 'viewer',
              canDelete: role === 'admin',
              canInvite: role === 'admin',
              canManageUsers: role === 'admin'
            }
          }
        : member
    );
    setTeamMembers(updatedTeam);
    saveTeam(updatedTeam);
  };

  const removeTeamMember = (userId: string) => {
    if (!currentUser?.permissions.canManageUsers) return;
    
    const updatedTeam = teamMembers.filter(member => member.id !== userId);
    setTeamMembers(updatedTeam);
    saveTeam(updatedTeam);
  };

  const updateProfile = (userId: string, updates: Partial<User>) => {
    if (userId === currentUser?.id) {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      saveUser(updatedUser);
    } else if (currentUser?.permissions.canManageUsers) {
      const updatedTeam = teamMembers.map(member =>
        member.id === userId ? { ...member, ...updates } : member
      );
      setTeamMembers(updatedTeam);
      saveTeam(updatedTeam);
    }
  };

  // Update last active time
  useEffect(() => {
    if (currentUser) {
      const interval = setInterval(() => {
        const updatedUser = { ...currentUser, lastActive: new Date() };
        setCurrentUser(updatedUser);
        saveUser(updatedUser);
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        teamMembers,
        isAuthenticated,
        login,
        loginWithGoogle,
        logout,
        inviteTeamMember,
        updateUserRole,
        removeTeamMember,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
