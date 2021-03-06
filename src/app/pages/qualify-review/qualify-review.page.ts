import { Component, OnInit } from '@angular/core';
import { restaurant } from 'src/app/interfaces/restaurant';
import { Router } from '@angular/router';
import { NativeTransitionOptions, NativePageTransitions } from '@ionic-native/native-page-transitions/ngx';


@Component({
  selector: 'app-qualify-review',
  templateUrl: './qualify-review.page.html',
  styleUrls: ['./qualify-review.page.scss'],
})
export class QualifyReviewPage implements OnInit {

  restaurant:restaurant;

  score_categories = {
    comida: 0,
    ambiente: 0,
    servicio: 0
  }


  constructor(
    private route: Router,
    private nativePageTransitions: NativePageTransitions
  ) { }

  ngOnInit() {
    this.restaurant = this.route.getCurrentNavigation().extras.state.data;

    let comida = this.restaurant.qualifications.filter(qualy => qualy.score_category.name.toLowerCase() === 'comida');
    let ambiente = this.restaurant.qualifications.filter(qualy => qualy.score_category.name.toLowerCase() === 'ambiente');
    let servicio = this.restaurant.qualifications.filter(qualy => qualy.score_category.name.toLowerCase() === 'servicio');

    comida = comida.map(qualy => qualy.score);
    ambiente = ambiente.map(qualy => qualy.score);
    servicio = servicio.map(qualy => qualy.score);

    let count_comida = comida.length;
    let count_ambiente = ambiente.length;
    let count_servicio = servicio.length;

    let result_comida = comida.reduce((back, curr) => {return back + curr}, 0) / count_comida;
    let result_ambiente = ambiente.reduce((back, curr) => {return back + curr}, 0) / count_ambiente;
    let result_servicio = servicio.reduce((back, curr) => {return back + curr}, 0) / count_servicio;

    this.score_categories.comida = result_comida;
    this.score_categories.ambiente = result_ambiente;
    this.score_categories.servicio = result_servicio;

  }

  ionViewWillLeave(){
    //this.transitionAnimation()
  }

  transitionAnimation(){
    let options: NativeTransitionOptions = {
      direction: 'left',
      duration: 500,
      slowdownfactor: 3,
      slidePixels: 20,
      iosdelay: 100,
      androiddelay: 150,
      fixedPixelsTop: 0,
      fixedPixelsBottom: 60
     }
    this.nativePageTransitions.slide(options)
      .then(onSuccess => console.log(onSuccess))
      .catch(onError => console.log(onError,'error'));
  }



}
