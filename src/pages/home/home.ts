import { WidgetSelectorPage } from './../widgetselector/widgetselector';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { DomoticzProvider } from './../../providers/domoticz.provider';
import { WeatherProvider } from './../../providers/weather.provider';

declare var StationClock;

export interface DioniczService {
  name: string;             // IP adress
  availableUIDs: Array<string>;
}


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  serviceSubscriptions: Object = {};
  serviceState: Object = {};
  serviceList: Array<DioniczService> = [];

  dashboardLayout: Object = {};

  constructor(

    public navCtrl: NavController,
    private domoticz: DomoticzProvider,
    private modalCtrl: ModalController,
    private storage: Storage,
    private weather: WeatherProvider

  ) { }


  ionViewWillEnter() {
    this.loadDashboard()
      .then(() => {
        this.setDataListners();
      })
  }

  setDataListners() {

    this.serviceSubscriptions = {};

    let servicePollers = {

      'domoticz': this.domoticz.getDomoticzPoller({
        server: 'localhost',             // IP adress
        port: '8080',              // number as a string, with no colon ('8080')
        protocol: 'http://',           // https:// or http://
        refreshdelay: 5000       // the ms to wait before a full refresh
      }),

      'weather': this.weather.getWeatherPoller()
    }


    console.log('Subscribing ', servicePollers);

    this.serviceState = {}

    // let's subscribe and store the state so we forward these changes to all components
    Object.keys(servicePollers).map(service => {

      console.log('Subscribing ', service);

      this.serviceState[service] = {};

      this.serviceSubscriptions[service] =

        servicePollers[service].subscribe(data => {
          let uid = data['_uid'];
          if (uid == undefined) uid = 'nouid';

          console.log('Setting state ', data, this.serviceState, service);
          if (this.serviceState[service]) this.serviceState[service][uid] = data
          else console.log('WTF???')
        })

    })
  }

  openWidgetSelector() {

    this.serviceList = [];

    let uidStateList = [];
    let availableUIDs = this.domoticz.getAvailableUIDs();

    availableUIDs.map(uid => {
      uidStateList.push({ uid: uid, state: this.serviceState['domoticz'][uid] })
    })

    this.serviceList.push({
      name: 'domoticz',
      availableUIDs: uidStateList
    })

    let modal = this.modalCtrl.create(WidgetSelectorPage, {
      availableServices: this.serviceList,
      currentState: this.serviceState
    })

    modal.onDidDismiss(data => {
      if (data) {
        console.log('RECEVEIVED DATA', data)
        this.dashboardLayout['widgetList'].push({ service: data['service'], uid: data['uid'] })
        //console.log('THID SB', this.serviceState[data['service']][data['uid']]);

        this.saveDashboard();
      }
    })

    modal.present({});
  }

  loadDashboard() {

    interface dioniczState {
      dashboardLayout: Object;
      serviceState: Object;
    }

    return this.storage.ready()
      .then(() => { return this.storage.get('dionicz') })
      .then(val => {
        //  let foundState: dioniczState = Object.assign({}, val);
        if (val != null) {

          console.log('loaded data', val);
          this.serviceState = val['serviceState']

          // this is awkward but necessary, as Angular updating fails
          setTimeout(() => {
            this.dashboardLayout = val['dashboardLayout'];
          }, 500);

        } else {

          this.dashboardLayout = {
            widgetList: [] // should contain {service:'', uid:''}
          };

          this.serviceState = {};
        }
      })
  }

  saveDashboard() {
    return this.storage.set('dionicz', { dashboardLayout: this.dashboardLayout, serviceState: this.serviceState });
  }

  ionViewWillLeave() {
    this.saveDashboard();
  }
}

