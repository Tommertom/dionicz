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

        function cleanToNumber(text) {
            if (text) return text.replace(/[^\d.-]/g, '')
            else return null;
        }

        this.data = Object.assign({}, this.payload);

        console.log('PAYLOAD ' + this.payload['Name'] + ' ' + this.payload['idx'], this.payload)

        // let's normalise the data received
        this.data['_devicetype'] = this.payload['Type'] == 'General' ? this.payload['SubType'] : this.payload['Type'];

        this.data['_switched'] = (this.payload['Data'] == 'On');

        this.data['_numbervalue'] = Number(cleanToNumber(this.payload['Data']));

        this.data['_level'] = this.payload['Level'];
        this.data['_setpoint'] = Number(this.payload['SetPoint']);

        this.data['_counter'] = cleanToNumber(this.payload['Counter']);
        this.data['_counterdeliv'] = cleanToNumber(this.payload['CounterDeliv']);
        this.data['_counterdelivtoday'] = cleanToNumber(this.payload['CounterDelivToday']);
        this.data['_usage'] = cleanToNumber(this.payload['Usage'])
        this.data['_usagedeliv'] = cleanToNumber(this.payload['UsageDeliv'])

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