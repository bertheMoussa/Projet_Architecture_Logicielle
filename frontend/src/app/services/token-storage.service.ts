import { Injectable } from '@angular/core';
import { of } from 'rxjs';

const TOKEN_KEY = 'token';
const USERNAME_KEY = 'username';
const IS_LOGGED_IN = 'isLoggedIn';
const IS_LOGGED = 'true';
const ID_USER_KEY = 'idUser';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  private isLocalStorageAvailable(): boolean {
    try {
      localStorage.setItem('testKey', 'testValue');
      localStorage.removeItem('testKey');
      return true;
    } catch (e) {
      return false;
    }
  }

  public clear(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.clear();
    }
  }

  public save(token: string, id : string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(IS_LOGGED_IN);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USERNAME_KEY, id);
    localStorage.setItem(IS_LOGGED_IN, IS_LOGGED);
  }

  public getToken(): string {
    if (this.isLocalStorageAvailable()) {
      const token = localStorage.getItem(TOKEN_KEY);
      return token === null ? '' : token;
    } else {
      return '';
    }
  }
  public setIdUser(user: number): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(ID_USER_KEY, user.toString());
    }
  }
  public getIdUser(): number | null {
    if (this.isLocalStorageAvailable()) {
      const idUser = localStorage.getItem(ID_USER_KEY);
      return idUser !== null ? +idUser : null;
    } else {
      return null;
    }
  }
  public isLogged(): boolean {
    if (this.isLocalStorageAvailable()) {
      return Boolean(localStorage.getItem(IS_LOGGED_IN));
    } else {
      return false;
    }
  }

  public isLoggedObservable() {
    if (this.isLocalStorageAvailable()) {
      return of(Boolean(localStorage.getItem(IS_LOGGED_IN)));
    } else {
      return of(false);
    }
  }
}
