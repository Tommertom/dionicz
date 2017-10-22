import { NavParams, ViewController } from 'ionic-angular';
import { Input, Component } from '@angular/core';

import { WidgetComponent } from './../widget/widget.component';
import { DomoticzProvider } from './../../providers/domoticz.provider';

@Component({
    selector: 'domoticz-device-widget',
    templateUrl: 'domoticzdevicewidget.component.html',

})
export class DomitczDeviceWidgetComponent { //extends WidgetComponent

    @Input() payload: Object;
    // raw: string = "";

    data: Object = {};

    canToggle: boolean = false;
    hasDimmer: boolean = false;
    hasColorPicker: boolean = false;
    showData: boolean = false;
    hasSetPoint: boolean = false;
    isEnergy: boolean = false;
    isTempHumBaro: boolean = false;
    isWindPower: boolean = false;

    constructor(private domoticz: DomoticzProvider) { }

    ngAfterContentInit() {

        this.data = Object.assign({}, this.payload);

        // and configure the UI elements
        this.canToggle =
            (this.payload['Type'] == 'Lighting Limitless/Applamp') ||
            (this.payload['SwitchType'] == 'On/Off');


        this.isWindPower = (this.payload['SubType'] == 'kWh') && (this.payload['Usage']) && (this.payload['CounterToday'])
        this.hasDimmer = (this.payload['HaveDimmer'] == true) && (this.payload['SubType'] != 'AC')
        this.hasColorPicker = (this.payload['SubType'] == 'RGB');
        this.hasSetPoint = (this.payload['SubType'] == 'SetPoint')
        this.isEnergy = this.payload['Type'] == 'P1 Smart Meter';
        this.isTempHumBaro = this.payload['Type'] == 'Temp + Humidity + Baro';

        this.showData = (this.canToggle == false) &&
            (this.hasDimmer == false) &&
            (this.hasColorPicker == false) &&
            (this.isTempHumBaro == false) &&
            (this.isWindPower == false) &&
            (this.isEnergy == false);
    }

    toggleSwitch() {
        if (this.data['_switched'])
            this.domoticz.switchDeviceOn(this.payload['idx'])
        else this.domoticz.switchDeviceOff(this.payload['idx'])
    }

    changeLevel(level) {
        //     this.domoticz.setDeviceDimLevel(this.payload['idx'], this.data['_level']);
    }

    setColor(color) {
        this.domoticz.setColorBrightnessHEX(this.payload['idx'], color);
    }

    changeSetPoint(level) {
        this.domoticz.setDeviceSetPoint(this.payload['idx'], level);
    }

    changeBrigthnessLevel(level) {

    }
}