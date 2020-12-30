import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {User} from '../model/user';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  public host = environment.apiUrl;
  private token: string;
  private loggedInUsername: string;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {
  }

  public login(user: User): Observable<HttpResponse<User>> { // whole HttpResponse is needed, because headers (with Jwt-Token) is needed
    return this.http.post<User>
    (`${this.host}/user/login`, user, {observe: 'response'}); // passing to this url, user object(body), whole response back needed
  }

  public register(user: User): Observable<User> { // user inputted, expecting User or error response
    return this.http.post<User>
    (`${this.host}/user/register`, user); // only user object needed (without full response)
  }

  public logOut(): void {
    this.token = null;
    this.loggedInUsername = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
  }

  public saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token); // token: 'asdfaskdnfaskg'
  }

  public addUserToLocalCache(user: User): void {
    localStorage.setItem('user', JSON.stringify(user)); // all object to string
  }

  public getUserFromLocalCache(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  public loadToken(): void {
    this.token = localStorage.getItem('token'); // change it to harder string (do not call token -> token)
  }

  public getToken(): string {
    return this.token;
  }

  // library installed: npm i @auth0/angular-jwt
  public isUserLoggedIn(): boolean {
    this.loadToken();
    if (this.token != null && this.token !== '') {
      if (this.jwtHelper.decodeToken(this.token).sub != null || '') { // subject is a username (I set it in backend)
        if (!this.jwtHelper.isTokenExpired(this.token)) {
          this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
          return true;
        }
      }
    } else {
      this.logOut();
      return false;
    }
  }
}
