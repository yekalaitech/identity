import {
  UserManager,
  UserManagerSettings,
  User,
  WebStorageStateStore,
  InMemoryWebStorage,
  Profile,
} from 'oidc-client';

import { StorageService } from './storage.service';

export interface AuthConfig {
  authority: string;
  client_id: string;
  redirect_uri: string;
  post_logout_redirect_uri: string;
  response_type: string;
  scope: string;
}

export class AuthService {
  private storageService = new StorageService();
  private manager: UserManager;
  public static __instance: AuthService;
  // tslint:disable-next-line: variable-name
  private _user: User = null;
  private constructor(
    private authConfig: AuthConfig
  ) {
    this.manager = new UserManager(this.getClientSettings());
    this.manager.events.addUserLoaded((user: User) => {
      this._user = user;
    });
  }

  get user(): User {
    return this._user;
  }

  static getInstance() {
    return AuthService.__instance;
  }
  static createInstance(authConfig: AuthConfig) {
    AuthService.__instance = new AuthService(authConfig)
    return AuthService.__instance;
  }

  isLoggedIn(): boolean {
    return this._user != null && !this._user.expired;
  }
  getClaims(): Profile {
    return this._user.profile;
  }
  getAuthorizationHeaderValue(): string {
    if (this._user) {
      return `${this._user.token_type} ${this._user.access_token}`;
    } else {
      return undefined;
    }
  }
  async logout(): Promise<void> {
    await this.manager.signoutRedirect();
  }
  async startAuthentication(redirectUri: string): Promise<void> {
    this.storageService.set('returnUrl', redirectUri);
    await this.manager.signinRedirect();
  }
  async completeAuthentication() {
    this._user = await this.manager.signinRedirectCallback();
    const returnUrl = await this.storageService.get("returnUrl");
    this.storageService.remove("returnUrl");
    return {
      user: this._user,
      returnUrl
    };
  }

  getClientSettings(): UserManagerSettings {
    return {
      authority: this.authConfig.authority,
      client_id: this.authConfig.client_id,
      redirect_uri: this.authConfig.redirect_uri,
      post_logout_redirect_uri: this.authConfig.post_logout_redirect_uri,
      response_type: this.authConfig.response_type,
      scope: this.authConfig.scope,
      loadUserInfo: true,
      automaticSilentRenew: true,
      silent_redirect_uri: 'https://localhost:3011/silent-refresh.html',
      userStore: new WebStorageStateStore({
        store: new InMemoryWebStorage(),
      }),
    };
  }
}
