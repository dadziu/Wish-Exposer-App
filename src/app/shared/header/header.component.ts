import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../service/authentication.service';
import {User} from '../../model/user';
import {Router} from '@angular/router';

// UNUSED CLASS
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  public user: User; // represents logged in user

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
  }

  public onLogOut(): void {
    this.authenticationService.logOut();
    this.router.navigate(['/login']);
  }

}
