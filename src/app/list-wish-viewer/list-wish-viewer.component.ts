import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Item} from '../model/item';
import {ItemService} from '../service/item.service';
import {User} from '../model/user';
import {UserService} from '../service/user.service';

@Component({
  selector: 'app-list-wish-viewer',
  templateUrl: './list-wish-viewer.component.html',
  styleUrls: ['./list-wish-viewer.component.css']
})
export class ListWishViewerComponent implements OnInit {

  constructor(private itemService: ItemService, private userService: UserService, private route: ActivatedRoute) { }

  public items: Item[];
  public user: User;
  public pathIdSubscription: any;
  public pathId: string;

  ngOnInit(): void {
    this.pathIdSubscription = this.route.params.subscribe(params => {
      this.pathId = params.pathId;
    });
    this.getWishListByUserId();
    this.getUserByUserId();
  }

  public getWishListByUserId(): void {
    this.itemService.getItemsByUserId(this.pathId).subscribe(
      (response: Item[]) => {
        this.items = response;
      });
  }

  public getUserByUserId(): void {
    this.userService.getUserByUserId(this.pathId).subscribe(
      (response: User) => {
        this.user = response;
      });
  }

}
