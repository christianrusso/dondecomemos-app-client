import { Component, OnInit, Input } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { PopoverController, NavController } from '@ionic/angular';
import { CardCodeComponent } from '../card-code/card-code.component';


@Component({
  selector: 'app-credit-card-list',
  templateUrl: './credit-card-list.component.html',
  styleUrls: ['./credit-card-list.component.scss'],
})
export class CreditCardListComponent implements OnInit {

  @Input() user;
  @Input() cards;

  constructor(
    private navCtrl: NavController,
    private popoverController: PopoverController,
    private popoverController2: PopoverController
  ) { }

  ngOnInit() { }

  addCard(){
    let navigationExtras: NavigationExtras = { state: { user: this.user, card: null } };
    this.navCtrl.navigateForward(['/credit-card-add'], navigationExtras);
    // dissmis el popup
    this.DismissClick();
  }

  editCard(card) {
    let navigationExtras: NavigationExtras = { state: { user: this.user, card: card } };
    this.navCtrl.navigateForward(['/credit-card-add'], navigationExtras);
    // dissmis el popup
    this.DismissClick();
  }

  async DismissClick() {
    await this.popoverController.dismiss();
  }


  async presentCardCode(ev: any, card:any) {
    const cardCodePop = await this.popoverController2.create({
      component: CardCodeComponent,
      cssClass: 'cardcodeclass',
      event: ev,
      translucent: true,
      backdropDismiss: false,
      componentProps: {
        id: null,
        user: this.user
      }
    });
    await cardCodePop.present();

    const { data } = await cardCodePop.onDidDismiss();
    await this.popoverController2.dismiss({ code: data.code });
    await this.popoverController.dismiss({ code: data.code, card: card });
  }







}
