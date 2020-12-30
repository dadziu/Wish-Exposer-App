import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Item} from '../model/item';
import {CustomHttpResponse} from '../model/custom-http-response';

@Injectable({providedIn: 'root'})
export class ItemService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getAllItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.host}/wishlist/list`);
  }

  public getItemsByUsername(username: string): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.host}/wishlist/list/${username}`);
  }

  public getItemsByUserId(userId: string): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.host}/wishlist/listByUserId/${userId}`);
  }

  public getOneItemById(id: string): Observable<Item> {
    return this.http.get<Item>(`${this.host}/wishlist/find/${id}`);
  }

  public sendList(formData: FormData): Observable<Item> {
    return this.http.post<Item>(`${this.host}/wishlist/sendList`, formData);
  }

  public addItem(formData: FormData): Observable<Item> {
    return this.http.post<Item>(`${this.host}/wishlist/addItem`, formData);
  }

  public updateItem(formData: FormData): Observable<Item> {
    return this.http.post<Item>(`${this.host}/wishlist/updateItem`, formData);
  }

  public deleteItem(itemId: string): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(`${this.host}/wishlist/delete/${itemId}`);
  }

  public createItemFormData(item: Item): FormData {
    const formData = new FormData();
    formData.append('id', item.id);
    formData.append('name', item.name);
    formData.append('description', item.description);
    formData.append('url', item.url);
    return formData;
  }
}
