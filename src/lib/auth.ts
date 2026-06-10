import Cookies from 'js-cookie';

export type UserRole = 'ADMIN' | 'VENDOR' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export const setAuthSession = (token: string, user: User) => {
  // Set tokens in secure cookies (expires in 7 days)
  Cookies.set('vellure_token', token, { expires: 7, secure: true, sameSite: 'strict' });
  Cookies.set('vellure_user', JSON.stringify(user), { expires: 7, secure: true, sameSite: 'strict' });
};

export const clearAuthSession = () => {
  Cookies.remove('vellure_token');
  Cookies.remove('vellure_user');
};

export const getAuthUser = (): User | null => {
  const userStr = Cookies.get('vellure_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!Cookies.get('vellure_token');
};

export const getRedirectPath = (role: UserRole): string => {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'VENDOR':
      return '/vendor/dashboard';
    default:
      return '/';
  }
};
