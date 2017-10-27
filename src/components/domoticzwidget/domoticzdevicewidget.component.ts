import { Observable } from 'rxjs/Observable';
import { NavParams, ViewController } from 'ionic-angular';
import { Input, Component, OnChanges, SimpleChanges } from '@angular/core';

import { WidgetComponent } from './../widget/widget.component';
import { DomoticzProvider } from './../../providers/domoticz.provider';

@Component({
    selector: 'domoticz-device-widget',
    templateUrl: 'domoticzdevicewidget.component.html'
})
export class DomitczDeviceWidgetComponent { //extends WidgetComponent

    @Input() state: Object;

    mystate: Object;

    canToggle: boolean = false;
    hasDimmer: boolean = false;
    hasColorPicker: boolean = false;
    showData: boolean = false;
    hasSetPoint: boolean = false;
    isEnergy: boolean = false;
    isTempHumBaro: boolean = false;
    isWindPower: boolean = false;

    inDomoticzAction: boolean = false;

    constructor(private domoticz: DomoticzProvider) { }

    ngOnChanges(changes: SimpleChanges) {
        if (!this.inDomoticzAction) {
            if (changes['state']) {
                this.mystate = changes['state']['currentValue'];
                this.setUICapabilities(this.mystate);
            }
        }
    }

    setUICapabilities(state) {
        // and configure the UI elements
        this.canToggle =
            (state['Type'] == 'Lighting Limitless/Applamp') ||
            (state['SwitchType'] == 'On/Off');

        this.isWindPower = (state['SubType'] == 'kWh') && (state['Usage']) && (state['CounterToday'])
        this.hasDimmer = (state['SubType'] != 'AC') //(state['HaveDimmer'] == true) &&
        this.hasColorPicker = (state['SubType'] == 'RGB');
        this.hasSetPoint = (state['SubType'] == 'SetPoint')
        this.isEnergy = state['Type'] == 'P1 Smart Meter';
        this.isTempHumBaro = state['Type'] == 'Temp + Humidity + Baro';

        this.showData = (this.canToggle == false) &&
            (this.hasDimmer == false) &&
            (this.hasColorPicker == false) &&
            (this.isTempHumBaro == false) &&
            (this.isWindPower == false) &&
            (this.isEnergy == false);
    }

    ngAfterContentInit() {
       // console.log('DomitczDeviceWidgetComponent ngAfterContentInit', this.mystate)
        this.mystate = this.state;
        this.setUICapabilities(this.mystate);
    }

    toggleSwitch() {
        this.inDomoticzAction = true;

        if (this.mystate['_switched'])
            this.domoticz.switchDeviceOn(this.mystate['idx'])
                .then(_ => { this.inDomoticzAction = false })

        else this.domoticz.switchDeviceOff(this.mystate['idx'])
            .then(_ => { this.inDomoticzAction = false })
    }

    changeLevel(level) {
        //     this.domoticz.setDeviceDimLevel(this.mystate['idx'], this.data['_level']);
    }

    setColor(color) {
        this.inDomoticzAction = true;
        this.domoticz.setColorBrightnessHEX(this.mystate['idx'], color)
            .then(_ => { this.inDomoticzAction = false })

    }

    changeSetPoint(level) {
        this.inDomoticzAction = true;
        this.domoticz.setDeviceSetPoint(this.mystate['idx'], level)
            .then(_ => { this.inDomoticzAction = false })
    }

    changeBrigthnessLevel(level) {

    }

    consoleWrite() {
        console.log('STATE', this.mystate);
    }
}