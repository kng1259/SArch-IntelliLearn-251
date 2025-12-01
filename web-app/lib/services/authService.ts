import { jwtDecode } from 'jwt-decode';

const KEYCLOAK_URL = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8083';
const KEYCLOAK_REALM = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'intellilearn';
const KEYCLOAK_CLIENT_ID = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'nginx';
const KEYCLOAK_CLIENT_SECRET = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET || 'w5upehqrRr3xTL57IRAX0Vn5U6zGitbr';

const TOKEN_ENDPOINT = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;
const USERINFO_ENDPOINT = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/userinfo`;
const LOGOUT_ENDPOINT = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/logout`;

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
}

export interface DecodedToken {
  exp: number;
  iat: number;
  auth_time: number;
  jti: string;
  iss: string;
  aud: string | string[];
  sub: string;
  typ: string;
  azp: string;
  session_state: string;
  acr: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [key: string]: {
      roles: string[];
    };
  };
  scope: string;
  sid: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}

export interface UserInfo {
  sub: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
  roles: string[];
}

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    // Load tokens from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token');
      this.refreshToken = localStorage.getItem('refresh_token');
      const expiry = localStorage.getItem('token_expiry');
      this.tokenExpiry = expiry ? parseInt(expiry, 10) : null;
    }
  }

  /**
   * Login with username and password
   */
  async login(username: string, password: string): Promise<UserInfo> {
    try {
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('client_id', KEYCLOAK_CLIENT_ID);
      formData.append('client_secret', KEYCLOAK_CLIENT_SECRET);
      formData.append('username', username);
      formData.append('password', password);
      formData.append('scope', 'openid profile email');

      const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error_description || 'Login failed');
      }

      const tokenData: TokenResponse = await response.json();
      this.setTokens(tokenData);

      // Get user info
      const userInfo = await this.getUserInfo();
      return userInfo;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('grant_type', 'refresh_token');
      formData.append('client_id', KEYCLOAK_CLIENT_ID);
      formData.append('client_secret', KEYCLOAK_CLIENT_SECRET);
      formData.append('refresh_token', this.refreshToken);

      const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        this.clearTokens();
        return false;
      }

      const tokenData: TokenResponse = await response.json();
      this.setTokens(tokenData);
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearTokens();
      return false;
    }
  }

  /**
   * Get user information from Keycloak
   */
  async getUserInfo(): Promise<UserInfo> {
    const token = await this.getValidToken();
    if (!token) {
      throw new Error('No valid token available');
    }

    try {
      const response = await fetch(USERINFO_ENDPOINT, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userInfo = await response.json();
      
      // Decode token to get roles
      const decoded = this.decodeToken(token);
      const roles = decoded?.realm_access?.roles || [];

      return {
        ...userInfo,
        roles,
      };
    } catch (error) {
      console.error('Get user info error:', error);
      throw error;
    }
  }

  /**
   * Logout and clear tokens
   */
  async logout(): Promise<void> {
    if (this.refreshToken) {
      try {
        const formData = new URLSearchParams();
        formData.append('client_id', KEYCLOAK_CLIENT_ID);
        formData.append('client_secret', KEYCLOAK_CLIENT_SECRET);
        formData.append('refresh_token', this.refreshToken);

        await fetch(LOGOUT_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    this.clearTokens();
  }

  /**
   * Get valid access token (refresh if expired)
   */
  async getValidToken(): Promise<string | null> {
    if (!this.accessToken) {
      return null;
    }

    // Check if token is expired
    if (this.isTokenExpired()) {
      const refreshed = await this.refreshAccessToken();
      if (!refreshed) {
        return null;
      }
    }

    return this.accessToken;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.accessToken && !this.isTokenExpired();
  }

  /**
   * Check if token is expired
   */
  private isTokenExpired(): boolean {
    if (!this.tokenExpiry) {
      return true;
    }
    // Add 60 second buffer to refresh before actual expiry
    return Date.now() >= (this.tokenExpiry - 60000);
  }

  /**
   * Decode JWT token
   */
  decodeToken(token: string): DecodedToken | null {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  }

  /**
   * Get user ID from token
   */
  getUserId(): string | null {
    if (!this.accessToken) {
      return null;
    }
    const decoded = this.decodeToken(this.accessToken);
    return decoded?.sub || null;
  }

  /**
   * Get user roles from token
   */
  getUserRoles(): string[] {
    if (!this.accessToken) {
      return [];
    }
    const decoded = this.decodeToken(this.accessToken);
    return decoded?.realm_access?.roles || [];
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }

  /**
   * Check if user is a tutor
   */
  isTutor(): boolean {
    return this.hasRole('TUTOR') || this.hasRole('ADMIN');
  }

  /**
   * Check if user is a student
   */
  isStudent(): boolean {
    return this.hasRole('STUDENT');
  }

  /**
   * Set tokens in memory and localStorage
   */
  private setTokens(tokenData: TokenResponse): void {
    this.accessToken = tokenData.access_token;
    this.refreshToken = tokenData.refresh_token;
    this.tokenExpiry = Date.now() + (tokenData.expires_in * 1000);

    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', tokenData.access_token);
      localStorage.setItem('refresh_token', tokenData.refresh_token);
      localStorage.setItem('token_expiry', this.tokenExpiry.toString());
    }
  }

  /**
   * Clear tokens from memory and localStorage
   */
  private clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token_expiry');
      localStorage.removeItem('tutorId'); // Clear tutor ID as well
    }
  }

  /**
   * Get current access token (without validation/refresh)
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;
