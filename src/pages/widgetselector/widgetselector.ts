import { Component, ViewChild } from '@angular/core';
import { NavParams, ToastController, Events, ViewController, Platform, ActionSheetController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-widgetselector',
  templateUrl: 'widgetselector.html'
})
export class WidgetSelectorPage {

  availableServices: Array<Object> = [];
  //currentState: Object = {};

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private events: Events,
    private toastCtrl: ToastController,
    private platform: Platform
  ) { }

  ionViewWillEnter() {
    this.availableServices = this.navParams.get('availableServices') || [];
    //  this.currentState = this.navParams.get('currentState') || [];

    console.log('RECEIVED STUFF', this.availableServices)
  }

  closeReport() {
    this.viewCtrl.dismiss(null);
  }

  itemClicked(service, uid) {
    this.viewCtrl.dismiss({ service: service, uid: uid });
  }

}


