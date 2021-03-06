import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-card-code',
  templateUrl: './card-code.component.html',
  styleUrls: ['./card-code.component.scss'],
})
export class CardCodeComponent implements OnInit {

  @Input() id;
  @Input() user;

  inactiveBtn = true;

  constructor(
    private popOverCtrl: PopoverController
  ) { }

  ngOnInit() {}

  goToCode(){
    let code = (document.getElementById('code') as HTMLInputElement).value;
    console.log(code);
    if(code === null || code === ""){
      console.log("Codigo vacio", code);
    } else {
      this.popOverCtrl.dismiss({
        code: code
      });
    }
  }

  changeCode() {
    let code = (document.getElementById('code') as HTMLInputElement).value;
    if(code.length > 2){
      this.inactiveBtn = false;
    } else {
      this.inactiveBtn = true;
    }
  }

  async DismissClick() {
    await this.popOverCtrl.dismiss({code: null});
  }


}
