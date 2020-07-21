import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { StorageService } from '../storage/storage.service';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  reservations:any[] = [];

  constructor(
    public http: HttpClient,
    public storage: StorageService
  ) {
  }

  protected getURL(data) {
    return `reservations/?restaurant=${data.resto.id}&date=${data.date}&hour=${data.hour}`;
  }

  protected getURLUser() {
    return 'reservations/by_user/';
  }

  protected process_get(response): void {
    this.reservations = response;
  }

  get(params:any, url=false){
    let url_api = "";
    let data = {
      user: params.user,
      resto: params.resto,
      date: params.date,
      hour: params.hour
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `token ${data.user.token}`
    });

    return new Promise((resolve , reject) => {

      if(url === false){
        url_api = `${apiUrl}${this.getURL(data)}`;
      } else {
        url_api = `${apiUrl}${this.getURLUser()}`;
      }
      console.log("URL-GET-RESERVES", url_api);
      this.http.get(url_api, { headers }).subscribe((response:any) => {
        this.process_get(response)
        resolve(response)
      }),( err => {
        reject(err);
      });
    });
  }

  post(data){
    const body = {
      client: data.user.id,
      restaurant_id: data.restaurant_id,
      diners: data.diners,
      reservation_date: data.reservation_date,
      reservation_hour: data.reservation_hour,
      comments: data.comments,
      motive: data.motive,
      products: data.products,
      menus: data.menus
    };

    console.log("BODY-SAVE", body);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `token ${data.user.token}`
    });

    return new Promise((resolve, reject) => {
      this.http.post(`${apiUrl}reservations/`, body, {headers}).subscribe((response: any) => {
        resolve(response);
      }, (errorResponse) => {
        reject(errorResponse);
      })
    })
  }

  cancel(data){
    console.log("data-service-reserve", data);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `token ${data.user.token}`
    });

    console.log("head-service-reserve", headers);

    return new Promise((resolve , reject) => {
      this.http.put(`${apiUrl}reservations/${data.id}/cancel/`, null, { headers }).subscribe((response:any) => {
        console.log("RES-SERV-RES", response);
        this.process_get(response)
        resolve(response)
      }),( err => {
        console.log("ERR-SERV-RES", err);
        reject(err);
      });
    });
  }

  protected addHeaders(headers){
    //do nothing by default
  }

}
