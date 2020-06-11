import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { UserInterface } from '../../interfaces/user';
import { environment } from '../../../environments/environment.prod';
import { StorageService } from '../storage/storage.service';
import { Platform } from '@ionic/angular';
import { FCM } from '@ionic-native/fcm/ngx';

const baseUrl = environment.baseUrl;
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  user: UserInterface;
  isShowingPopUp = false;

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private platform: Platform,
    private fcm: FCM,
  ) {
    this.setUpUser();
  }

  setUpUser() {
    this.user = {
      id: 0,
      username: "",
      password: "",
      email: "",
      first_name: "",
      last_name: "",
      token: "",
      guest: false
    }
  }

  loginAsGuest() {
    this.setUpUser();
    this.user.first_name = "Invitado";
    this.user.guest = true;
  }

  isGuestUser() {
    return this.user.guest;
  }

  login(username: string, password: string) {
    return new Promise((resolve, reject) => {
      this.http.post(`${apiUrl}login/`, { username, password }).subscribe((res: UserInterface) => {
        this.user.token = res.token;
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Token ${this.user.token}`
        });
        this.http.get(`${apiUrl}users/get_from_token/`, { headers }).subscribe((res: UserInterface) => {
          let token = this.user.token;
          this.user = res;
          this.user.token = token;
          this.user.guest = false;

          //luego de loguear, pido el token y lo envio al back-end
          this.fcm.getToken().then(token => {
            this.registerFcmToken(token, this.user, headers);
          }).catch(err => {
            console.log(err);
          });

          this.storage.addObject("user", { ...this.user, password });
          resolve(this.user);

        }, (res) => {
          reject(res);
        })
      }, (res) => {
        reject(res);
      })
    })
  }

  async logout() {
    await this.storage.removeObject("user");
    await this.storage.removeObject("location");
  }

  register(form) {
    console.log("SERVICE", form, form.email);
    const body = {
      username: form.email,
      password: form.password,
      email: form.email,
      first_name: form.first_name,
      last_name: form.last_name
    }
    console.log("SERV-BODY", body);
    return new Promise((resolve, reject) => {
      this.http.post(`${apiUrl}users/`, body).subscribe((response) => {
        resolve(response);
      }, (errorResponse) => {
        reject(errorResponse.error);
      });
    });
  }

  registerFcmToken(token, user, headers) {

    let body = {
      registration_id: token,
      type: 'android',
    };

    if (this.platform.is('ios')) {
      body.type = 'ios';
    }

    return new Promise((resolve, reject) => {
      this.http.post(`${apiUrl}fcm/`, body, { headers }).subscribe((response) => {
        resolve(response);
      }, (errorResponse) => {
        reject(errorResponse.error);
      })
    })
  }

  saveChanges(first_name: string, last_name: string) {
    const body = {
      first_name,
      last_name
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.user.token}`
    });
    return new Promise((resolve, reject) => {
      this.http.put(`${apiUrl}users/${this.user.id}/change/`, body, { headers })
        .subscribe(async (response: any) => {
          let returnedUser: UserInterface = response;
          this.user = { ...returnedUser, token: this.user.token }
          resolve(response);
        }, (errorResponse) => {
          reject(errorResponse.error);
        })
    })
  }

  loginGoogle() {
    console.log("G+ | User");
    // this.google.login(firebaseConfig).then(res => {
    //   console.log(res);
    //   const user_data_google = res;
    // });
  }

  loginFcbk() {
    console.log("Fcbk");
  }

  recoverPassword(email) {
    const body = { email };
    return new Promise((resolve, reject) => {
      this.http.post(`${apiUrl}recover-password/mail/`, body).subscribe((response: any) => {
        resolve(response)
      }, (errorResponse) => {
        reject(errorResponse.error)
      })
    })
  }

  checkCodeProvider(code, email){
    const body = { code, email }
    return new Promise((resolve, reject) => {
      this.http.post(`${apiUrl}recover-password/checkCode/`, body).subscribe((response: any) => {
        this.user.token = response.token;
        resolve()
      }, (errorResponse) => {
        reject(errorResponse.error)
      })
    });
  }

  set_password(email, new_password){
    const body = { new_password, email };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.user.token}`
    });

    console.log(body);
    console.log(headers);

    return new Promise((resolve, reject) => {
      this.http.post(`${apiUrl}recover-password/set_password/`, body, {headers}).subscribe((response: any) => {
        resolve();
      }, (errorResponse) => {
        reject();
      })
    })
  }

  change_password(old_password, new_password) {
    const body = { old_password, new_password };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.user.token}`
    });

    return new Promise((resolve, reject) => {
      this.http.post(`${apiUrl}recover-password/change_password/`, body, {headers}).subscribe((response: any) => {
        resolve(response);
      }, (errorResponse) => {
        reject(errorResponse.error);
      })
    })
  }

  sendCodeSms(email, phone) {
    const body = { email, phone };
    return new Promise((resolve, reject) => {
      this.http.post(`${apiUrl}verify-number-code/sms/`, body).subscribe((response: any) => {
        resolve(response)
      }, (errorResponse) => {
        reject(errorResponse.error)
      })
    })
  }

  checkCodeSms(code){
    const body = { code };
    return new Promise((resolve, reject) => {
      this.http.post(`${apiUrl}verify-number-code/checkCode/`, body).subscribe((response: any) => {
        resolve(response);
      }, (errorResponse) => {
        reject(errorResponse.error);
      })
    });
  }


}
