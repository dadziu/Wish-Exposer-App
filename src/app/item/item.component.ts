import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../service/authentication.service';
import {User} from '../model/user';
import {ItemService} from '../service/item.service';
import {Item} from '../model/item';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {CustomHttpResponse} from '../model/custom-http-response';
import {BehaviorSubject} from 'rxjs';
import {UserComponent} from '../user/user.component';
import {Router} from '@angular/router';
import {UserService} from '../service/user.service';
import {NotificationService} from '../service/notification.service';
import {stringify} from '@angular/compiler/src/util';
import {NotificationType} from '../enum/notification-type.enum';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService, private itemService: ItemService, private router: Router,
              private userService: UserService, private notificationService: NotificationService, private formBuilder: FormBuilder) {
  }

  private titleSubject = new BehaviorSubject<string>('Items');
  public titleAction$ = this.titleSubject.asObservable(); // listener of titleSubject
  public user: User; // represents logged in user
  public items: Item[];
  public editItem: Item;
  public userComponent: UserComponent;
  public isDynamicList = false;
  public submitted = false;
  public sendForm: FormGroup;

  private static clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
    this.editItem = new Item();
    this.getItemsForCurrentUser(true);
    this.userComponent = new UserComponent(this.router, this.authenticationService, this.userService, this.notificationService);
    this.sendForm = this.formBuilder.group({
      email: ['', Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]
    });
  }

  get email(): any {
    return this.sendForm.get('email');
  }

  public changeTitle(title: string): void {
    this.titleSubject.next(title);
  }

  // public getAllItems(): void {
  //   this.itemService.getAllItems().subscribe(
  //     (response: Item[]) => {
  //       this.items = response;
  //     });
  // }

  public getItemsForCurrentUser(showNotification: boolean): void {
    this.itemService.getItemsByUsername(this.user.username).subscribe(
      (response: Item[]) => {
        this.items = response;
        if (showNotification) {
          this.sendNotification(NotificationType.SUCCESS, `${response.length} item(s) loaded successfully.`);
        }
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
      });
    this.submitted = false;
  }

  public sendList(): void {
    ItemComponent.clickButton('sendListButton');
  }

  public onSendList(): void {
    this.submitted = true;
    if (this.sendForm.invalid) {
      return;
    }
    const formData = new FormData();
    formData.append('username', this.user.username);
    formData.append('items', JSON.stringify(this.items));
    formData.append('email', JSON.stringify(this.sendForm.value));
    formData.append('isDynamicList', stringify(this.isDynamicList));
    this.itemService.sendList(formData).subscribe(
      (response) => {
        this.sendNotification(NotificationType.SUCCESS, 'Wishlist send successfully');
        ItemComponent.clickButton('closeSendListModalButton');
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
      });
  }

  public addItem(): void {
    ItemComponent.clickButton('addItemSaveButton');
  }

  public onAddNewItem(userForm: NgForm): void {
    const formData = new FormData();
    formData.append('username', this.user.username);
    formData.append('item', JSON.stringify(userForm.value));
    this.itemService.addItem(formData).subscribe(
      (response) => {
        ItemComponent.clickButton('closeAddItemModalButton');
        userForm.resetForm();
        this.sendNotification(NotificationType.SUCCESS, `${response.name} added successfully`);
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
      });
  }

  public updateItem(editItem: Item): void {
    this.editItem = editItem;
    ItemComponent.clickButton('openItemEdit');
  }

  public onUpdateItem(): void {
    const formData = this.itemService.createItemFormData(this.editItem);
    this.itemService.updateItem(formData).subscribe(
      (response: Item) => {
        ItemComponent.clickButton('closeEditItemModalButton');
        this.sendNotification(NotificationType.SUCCESS, `${response.name} added successfully`);
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
      }
    );
  }

  public deleteItem(editItem: Item): void {
    this.editItem = editItem;
    ItemComponent.clickButton('openItemDelete');
  }

  public onDeleteItem(): void {
    this.itemService.deleteItem(this.editItem.id).subscribe(
      (response: CustomHttpResponse) => {
        this.sendNotification(NotificationType.SUCCESS, response.message);
        ItemComponent.clickButton('closeDeleteItemModalButton');
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
      }
    );
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }
}
