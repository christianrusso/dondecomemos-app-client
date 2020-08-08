import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users/user.service';
import { NavController, AlertController } from '@ionic/angular';
import { restaurant } from 'src/app/interfaces/restaurant';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { LoaderService } from '../../services/loader/loader.service';
import { StorageService } from '../../services/storage/storage.service';
import { ToastService } from '../../services/toast/toast.service';
import { UserInterface } from 'src/app/interfaces/user';
import { NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit {

  isGuest = true;

  resto_favs: any[] = [];
  favorites: any[] = [];
  spinnFavorite = true;
  user:UserInterface;

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private storage: StorageService,
    private userService: UsersService,
    private favService: FavoritesService,
    private loader: LoaderService,
    private toastCtrl: ToastService
  ) {
    console.log("constructor");
  }

  ngOnInit() {
    console.log("INIT");
    this.storage.getObject("favorites").then(res => {
      if(res){
        this.favorites = res;
      }
    });
  }

  loadData(){
    this.user = this.userService.user;
    if(this.user.guest){
      this.isGuest = true;
    } else {
      this.isGuest = false;
      // this.loader.display("Cargando favoritos...");
      setTimeout(() => {
        this.favService.get(this.user.id).then((res:any) => {
          // this.loader.hide();
          this.resto_favs = res;
          this.storage.addObject("favorites", res);
          this.spinnFavorite = false;
        }).catch(err => {
          // this.loader.hide();
          this.spinnFavorite = false;
          console.log('err-get-favs', err);
        });
      }, 800);
    }
  }

  ionViewWillEnter() {
    this.spinnFavorite = true;
    this.user = this.userService.user;
    if(this.user.guest){
      this.isGuest = true;
    } else {
      this.isGuest = false;
      setTimeout(() => {
        this.favService.get(this.user.id).then((res:any) => {
          this.resto_favs = res;
          this.storage.addObject("favorites", res);
          this.spinnFavorite = false;
        }).catch(err => {
          this.spinnFavorite = false;
          console.log('err-get-favs', err);
        });
      }, 800);
    }
  }

  removeFav(fav_id:number) {
    this.showAlert(fav_id);
  }

  async showAlert(id:number) {

    let alert = await this.alertCtrl.create({
      header: 'Eliminar de favoritos',
      message:"¿Seguro quiere eliminar al restaurante de Favoritos?",
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.storage.getObject("favorites").then(res => {
              this.favService.delete(id).then((res:any) => {
                let id_fav_resto = this.favorites.filter(fav => fav.id !== id);
                this.storage.addObject("favorites", id_fav_resto);
                this.resto_favs = this.resto_favs.filter(fav_resto => fav_resto.id !== id);
                this.toastCtrl.show("Eliminado de Favoritos");
              });
            }).catch(err => {
              console.log('err', err);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  login() {
    this.navCtrl.navigateForward(['/login']);
  }

  register() {
    this.navCtrl.navigateForward(['/register']);
  }

  details(resto:restaurant) {
    let params: NavigationExtras = {state: {data: resto, call: 'favorite'}};
    this.navCtrl.navigateForward(['/restaurant/details'], params);
  }

  loginGoogle() {
    console.log('g+');
  // this.google.login({})
  //     .then(res => console.log(res))
  //     .catch(err => console.error(err));
  }

  loginFcbk() {
    console.log('fcbk');
  }

}
