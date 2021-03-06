//import { DomoticzSettingsModel } from './domoticz.provider';
import { Events } from 'ionic-angular';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeAll';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/concat';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/interval';

export interface DomoticzSettingsModel {
    server: string;             // IP adress
    port: string;               // number as a string, with no colon ('8080')
    protocol: string;           // https:// or http://
    refreshdelay: number;       // the ms to wait before a full refresh
}

@Injectable()
export class DomoticzProvider {

    private domoticzState: Object = {};
    settings: DomoticzSettingsModel;

    constructor(private http: Http, private events: Events) { };

    private doDomoticzPollForCategory(settings, url, category) {
        return this.http.get(settings.protocol +
            settings.server + ':' +
            settings.port + url)
            .timeout(3000)
            .filter(input => { return (input.ok && (input.status == 200)) })
            .map((data) => data.json())
            .filter(data => data['status'] == 'OK')
            .filter(data => data['result'])
            .map(data => data['result'])
            .mergeAll()
            .map(data => Object.assign(data, { _type: category }))
    }

    doFullRefresh() {
        this.events.publish('sync-domoticz');
    }

    getDomoticzPoller(settings: DomoticzSettingsModel) {

        function cleanToNumber(text) {
            if (text) return text.replace(/[^\d.-]/g, '')
            else return null;
        }

        this.settings = settings;

        return Observable.merge(

            Observable.create(observer => {

                // this is needed to force a refresh of the state using the Event system, possibly not the best way (add force-Observable as argument to this function)
                this.events.subscribe('sync-domoticz', () => {
                    observer.next('0');
                })
            }),

            // this is the poller timer
            Observable.timer(0, settings.refreshdelay)
        )

            // we combine all pollers into a chain of poll actions
            .switchMap(() =>

                // first search for devices
                this.doDomoticzPollForCategory(settings, '/json.htm?type=devices&used=true&order=Name', 'device')
                    .filter(data => {
                        let key = data['idx'] + data['_type'];
                        let stateItem = this.domoticzState[key] || {};
                        return data['LastUpdate'] != stateItem['LastUpdate'];
                    })
                    .map(data => {
                        data['_devicetype'] = data['Type'] == 'General' ? data['SubType'] : data['Type'];
                        data['_switched'] = (data['Data'] == 'On');
                        data['_numbervalue'] = Number(cleanToNumber(data['Data']));
                        data['_level'] = data['Level'];
                        data['_setpoint'] = Number(data['SetPoint']);
                        data['_counter'] = cleanToNumber(data['Counter']);
                        data['_counterdeliv'] = cleanToNumber(data['CounterDeliv']);
                        data['_counterdelivtoday'] = cleanToNumber(data['CounterDelivToday']);
                        data['_usage'] = cleanToNumber(data['Usage'])
                        data['_usagedeliv'] = cleanToNumber(data['UsageDeliv'])

                        return data;
                    })
                    .do(item => this.storeState(item, "device"))

                    .concat(

                    // then we'll look for plans
                    this.doDomoticzPollForCategory(settings, '/json.htm?type=plans&order=name&used=true', 'plan')
                        .filter(data => {
                            let key = data['idx'] + data['_type'];
                            let stateItem = this.domoticzState[key] || {};
                            return data['LastUpdate'] != stateItem['LastUpdate'];
                        })
                        .do(item => this.storeState(item, "plan"))
                    )

                    .concat(

                    // once that is done, we go for scenes
                    this.doDomoticzPollForCategory(settings, '/json.htm?type=scenes', 'scene')
                        .filter(data => {
                            let key = data['idx'] + data['_type'];
                            let stateItem = this.domoticzState[key] || {};
                            return data['LastUpdate'] != stateItem['LastUpdate'];
                        })
                        .do(item => this.storeState(item, "scene"))
                    )

                    .concat(

                    // we like to get the user variables as well
                    this.doDomoticzPollForCategory(settings, '/json.htm?type=command&param=getuservariables', 'uservariables')
                        .filter(data => {
                            let key = data['idx'] + data['_type'];
                            let stateItem = this.domoticzState[key] || {};
                            return data['LastUpdate'] != stateItem['LastUpdate'];
                        })
                        .do(item => this.storeState(item, "uservariables"))

                    )

                    .concat(

                    // and for the log, we cannot use the helper function
                    this.http.get(settings.protocol +
                        settings.server + ':' +
                        settings.port + '/json.htm?type=command&param=getlog')
                        .timeout(3000)
                        .filter(input => { return (input.ok && (input.status == 200)) })
                        .map((data) => data.json())
                        .filter(data => data['status'] == 'OK')
                        .filter(data => data['result'])
                        .filter(data => {
                            let key = 'log'
                            let stateItem = this.domoticzState[key] || {};
                            return data['LastLogTime'] != stateItem['LastUpdate'];
                        })
                        .map(data => Object.assign(data, { idx: 'log', _type: 'log' }))
                        .do(item => this.storeState(item, "log"))
                        .map(data => Object.assign(data, { results: [] }))

                    )

                    // and a finale enrichment of the received data
                    .map(data => Object.assign(data, { _uid: data['idx'] + data['_type'] }))
           //         .do(data => { console.log('SENDING STUFF', data, this.domoticzState) })
            )
    }

    storeState(item, type) {
        let hash = item['idx'] + type;
        this.domoticzState[hash] = Object.assign({ _type: type }, item);
    }

    getAvailableUIDs() {
        return Object.keys(this.domoticzState);
    }

    getState(UID?) {
        if (UID == undefined) return this.domoticzState
        else return this.domoticzState[UID];
    }

    hexToRgb(hex) {
        hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
        return { r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF) };
    };

    hexToHsb(hex) {
        return this.rgbToHsb(this.hexToRgb(hex));
    };

    rgbToHsb(rgb) {
        var hsb = { h: 0, s: 0, b: 0 };
        var min = Math.min(rgb.r, rgb.g, rgb.b);
        var max = Math.max(rgb.r, rgb.g, rgb.b);
        var delta = max - min;
        hsb.b = max;
        hsb.s = max != 0 ? 255 * delta / max : 0;
        if (hsb.s != 0) {
            if (rgb.r == max) hsb.h = (rgb.g - rgb.b) / delta;
            else if (rgb.g == max) hsb.h = 2 + (rgb.b - rgb.r) / delta;
            else hsb.h = 4 + (rgb.r - rgb.g) / delta;
        } else hsb.h = -1;
        hsb.h *= 60;
        if (hsb.h < 0) hsb.h += 360;
        hsb.s *= 100 / 255;
        hsb.b *= 100 / 255;
        return hsb;
    };

    getGraphs(device, popup) {
        var sensor = 'counter';
        var sensortype = device['SubType'];
        var switchtype = device['SensorUnit'];
        var txtLabelOrg = sensortype;
        var txtUnit = "?";

        if (device['Type'] == 'Rain') sensor = 'rain';
        if (device['Type'] == 'Wind') sensor = 'wind';
        if (device['SubType'] == 'Percentage' || device['SubType'] == 'Custom Sensor') {
            sensor = 'Percentage';
            txtUnit = '%';
        }
        if (device['Type'] == 'Temp' || device['Type'] == 'Temp + Humidity' || device['Type'] == 'Temp + Humidity + Baro') {
            sensor = 'temp';
            txtUnit = '°';
        }

        if (sensortype == "Gas") {
            txtUnit = "m3";
        }
        else if (sensortype == "Energy") {
            txtUnit = "W";
        }
        else if (sensortype == "Custom Sensor") {
            txtUnit = switchtype;
            sensor = "Percentage";
        }
        else if (sensortype == "Visibility") {
            txtUnit = "km";
        }
        else if (sensortype == "Radiation") {
            txtUnit = "Watt/m2";
        }
        else if (sensortype == "Pressure") {
            txtUnit = "Bar";
        }
        else if (sensortype == "Soil Moisture") {
            txtUnit = "cb";
        }
        else if (sensortype == "Leaf Wetness") {
            txtUnit = "Range";
        }
        else if ((sensortype == "Voltage") || (sensortype == "A/D")) {
            txtUnit = "mV";
        }
        else if (sensortype == "VoltageGeneral") {
            txtLabelOrg = "Voltage";
            txtUnit = "V";
        }
        else if ((sensortype == "DistanceGeneral") || (sensortype == "Distance")) {
            txtLabelOrg = "Distance";
            txtUnit = "cm";
        }
        else if (sensortype == "Sound Level") {
            txtUnit = "dB";
        }
        else if ((sensortype == "CurrentGeneral") || (sensortype == "Current")) {
            txtLabelOrg = "Current";
            txtUnit = "A";
        }
        else if (switchtype == "Weight") {
            txtUnit = "kg";
        }
        else if (sensortype == "Waterflow") {
            txtUnit = "l/min";
            sensor = "Percentage";
        }

        var txtLabel = txtLabelOrg + " (" + txtUnit + ")";
        if (sensortype == "Custom Sensor") {
            txtLabel = txtUnit;
        }

        // showGraph(device['idx'], device['Name'], txtUnit, 'initial', device['CounterToday'], false, sensor, popup);

        //	url: settings['domoticz_ip']+'/json.htm?type=graph&sensor='+sensor+'&idx='+idx+'&range='+realrange+'&time='+new Date().getTime()+'&jsoncallback=?',

    }

    ////////////////////
    toggleDevice(idx: string) {
        return this.callAPI(
            '/json.htm?type=command&param=switchlight&idx=[IDX]&switchcmd=Toggle',
            { '[IDX]': idx })
    }

    setColorBrightnessHUE(idx: string, hue: number, brightness: number) {
        return this.callAPI(
            '/json.htm?type=command&param=setcolbrightnessvalue&idx=[IDX]&hue=[HUE]&brightness=[BRIGHT]&iswhite=false',
            { '[IDX]': idx, '[BRIGHT]': brightness, '[HUE]': hue })
    }


    setColorBrightnessHEX(idx: string, hex: string) {
        return this.callAPI(
            '/json.htm?type=command&param=setcolbrightnessvalue&idx=[IDX]&hex=[HEX]&brightness=100&iswhite=false',
            { '[IDX]': idx, '[HEX]': hex })
    }

    setDeviceDimLevel(idx: string, level: number) {
        return this.callAPI(
            '/json.htm?type=command&param=switchlight&idx=[IDX]&switchcmd=Set%20Level&level=[LEVEL]',
            { '[IDX]': idx, '[LEVEL]': level })
    }

    setDeviceSetPoint(idx: string, setpoint: number) {
        return this.callAPI(
            '/json.htm?type=command&param=setsetpoint&idx=[IDX]&setpoint=[SETPOINT]',
            { '[IDX]': idx, '[SETPOINT]': setpoint })
    }

    switchDeviceOn(idx: string) {
        return this.callAPI(
            '/json.htm?type=command&param=switchlight&idx=[IDX]&switchcmd=On',
            { '[IDX]': idx })

    }

    switchDeviceOff(idx: string) {
        return this.callAPI(
            '/json.htm?type=command&param=switchlight&idx=[IDX]&switchcmd=Off',
            { '[IDX]': idx })
    }

    switchSceneOn(idx: string) {
        return this.callAPI(
            '/json.htm?type=command&param=switchscene&idx=[IDX]&switchcmd=On',
            { '[IDX]': idx })
    }

    switchSceneOff(idx: string) {
        return this.callAPI(
            '/json.htm?type=command&param=switchscene&idx=[IDX]&switchcmd=Off',
            { '[IDX]': idx })
    }

    addLog(message: string) {
        return this.callAPI(
            '/json.htm?type=command&param=addlogmessage&message=[MESSAGE]',
            { '[MESSAGE]': message });
    }


    //
    //
    // all private methods follow here
    //
    //
    private callAPI(api: string, payload: Object) {
        // do a search-replace of all the update data available and then do the HTTP request, 
        for (let key in payload)
            api = api.replace(key, payload[key]); // should do this until all occurences as gone, TODO

        return this.http.get(
            this.settings.protocol +
            this.settings.server + ':' +
            this.settings.port + api)
            .timeout(3000)
            .toPromise()
    }
}

/*
Sample Domoticz 

{
   "ActTime" : 1485936044,
   "result" : [
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "CustomImage" : 0,
         "Data" : "20.15%",
         "Description" : "",
         "Favorite" : 1,
         "HardwareID" : 1,
         "HardwareName" : "Motherboard",
         "HardwareType" : "Motherboard sensors",
         "HardwareTypeVal" : 23,
         "HaveTimeout" : false,
         "ID" : "0000044C",
         "Image" : "Computer",
         "LastUpdate" : "2017-02-01 08:00:21",
         "Name" : "Memory Usage",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : "-",
         "SubType" : "Percentage",
         "Timers" : "false",
         "Type" : "General",
         "TypeImg" : "hardware",
         "Unit" : 1,
         "Used" : 1,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "1"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "CustomImage" : 0,
         "Data" : "34.77%",
         "Description" : "",
         "Favorite" : 0,
         "HardwareID" : 1,
         "HardwareName" : "Motherboard",
         "HardwareType" : "Motherboard sensors",
         "HardwareTypeVal" : 23,
         "HaveTimeout" : false,
         "ID" : "0000044E",
         "Image" : "Computer",
         "LastUpdate" : "2017-02-01 08:00:22",
         "Name" : "HDD /boot",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : "-",
         "SubType" : "Percentage",
         "Timers" : "false",
         "Type" : "General",
         "TypeImg" : "hardware",
         "Unit" : 1,
         "Used" : 1,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "2"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "CustomImage" : 0,
         "Data" : "77.95%",
         "Description" : "",
         "Favorite" : 1,
         "HardwareID" : 1,
         "HardwareName" : "Motherboard",
         "HardwareType" : "Motherboard sensors",
         "HardwareTypeVal" : 23,
         "HaveTimeout" : false,
         "ID" : "0000044F",
         "Image" : "Computer",
         "LastUpdate" : "2017-02-01 08:00:22",
         "Name" : "Unknown",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : "-",
         "SubType" : "Percentage",
         "Timers" : "false",
         "Type" : "General",
         "TypeImg" : "hardware",
         "Unit" : 1,
         "Used" : 1,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "3"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "CustomImage" : 0,
         "Data" : "59.30%",
         "Description" : "",
         "Favorite" : 0,
         "HardwareID" : 1,
         "HardwareName" : "Motherboard",
         "HardwareType" : "Motherboard sensors",
         "HardwareTypeVal" : 23,
         "HaveTimeout" : false,
         "ID" : "00000450",
         "Image" : "Computer",
         "LastUpdate" : "2017-02-01 08:00:23",
         "Name" : "HDD /media/mnt1",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : "-",
         "SubType" : "Percentage",
         "Timers" : "false",
         "Type" : "General",
         "TypeImg" : "hardware",
         "Unit" : 1,
         "Used" : 1,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "4"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 100,
         "CustomImage" : 0,
         "Data" : "34.7 C",
         "Description" : "",
         "Favorite" : 1,
         "HardwareID" : 1,
         "HardwareName" : "Motherboard",
         "HardwareType" : "Motherboard sensors",
         "HardwareTypeVal" : 23,
         "HaveTimeout" : false,
         "ID" : "0001",
         "LastUpdate" : "2017-02-01 08:00:23",
         "Name" : "Internal Temperature",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : "-",
         "SubType" : "TFA 30.3133",
         "Temp" : 34.70,
         "Timers" : "false",
         "Type" : "Temp",
         "TypeImg" : "temperature",
         "Unit" : 1,
         "Used" : 1,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "5"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "CustomImage" : 0,
         "Data" : "21.67%",
         "Description" : "",
         "Favorite" : 0,
         "HardwareID" : 1,
         "HardwareName" : "Motherboard",
         "HardwareType" : "Motherboard sensors",
         "HardwareTypeVal" : 23,
         "HaveTimeout" : false,
         "ID" : "0000044D",
         "Image" : "Computer",
         "LastUpdate" : "2017-02-01 08:00:21",
         "Name" : "CPU_Usage",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : "-",
         "SubType" : "Percentage",
         "Timers" : "false",
         "Type" : "General",
         "TypeImg" : "hardware",
         "Unit" : 1,
         "Used" : 1,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "6"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "CustomImage" : 0,
         "Data" : "Off",
         "Description" : "",
         "Favorite" : 0,
         "HardwareID" : 2,
         "HardwareName" : "Virtual devi e",
         "HardwareType" : "Dummy (Does nothing, use for virtual switches only)",
         "HardwareTypeVal" : 15,
         "HaveDimmer" : false,
         "HaveGroupCmd" : true,
         "HaveTimeout" : false,
         "ID" : "67",
         "Image" : "Light",
         "IsSubDevice" : false,
         "LastUpdate" : "2015-11-06 18:52:16",
         "Level" : 0,
         "LevelInt" : 0,
         "MaxDimLevel" : 0,
         "Name" : "Virtual doorbell",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : 7,
         "Status" : "Off",
         "StrParam1" : "c2NyaXB0Oi8vL2hvbWUvcGkvZG9tb3RpY3ovc2NyaXB0cy9kb29yYmVsbC5waHA=",
         "StrParam2" : "",
         "SubType" : "X10",
         "SwitchType" : "On/Off",
         "SwitchTypeVal" : 0,
         "Timers" : "false",
         "Type" : "Lighting 1",
         "TypeImg" : "lightbulb",
         "Unit" : 5,
         "Used" : 1,
         "UsedByCamera" : false,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "9"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "CustomImage" : 0,
         "Data" : "On",
         "Description" : "",
         "Favorite" : 0,
         "HardwareID" : 2,
         "HardwareName" : "Virtual devi e",
         "HardwareType" : "Dummy (Does nothing, use for virtual switches only)",
         "HardwareTypeVal" : 15,
         "HaveDimmer" : false,
         "HaveGroupCmd" : true,
         "HaveTimeout" : false,
         "ID" : "69",
         "Image" : "Light",
         "IsSubDevice" : false,
         "LastUpdate" : "2017-01-08 21:03:35",
         "Level" : 0,
         "LevelInt" : 0,
         "MaxDimLevel" : 0,
         "Name" : "Shutdown Pi",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : 7,
         "Status" : "On",
         "StrParam1" : "c2NyaXB0Oi8vL2hvbWUvcGkvZG9tb3RpY3ovc2NyaXB0cy9zaHV0ZG93bi5zaA==",
         "StrParam2" : "c2NyaXB0Oi8vL2hvbWUvcGkvZG9tb3RpY3ovc2NyaXB0cy9zaHV0ZG93bi5zaA==",
         "SubType" : "X10",
         "SwitchType" : "On/Off",
         "SwitchTypeVal" : 0,
         "Timers" : "false",
         "Type" : "Lighting 1",
         "TypeImg" : "lightbulb",
         "Unit" : 7,
         "Used" : 1,
         "UsedByCamera" : false,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "12"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 100,
         "CustomImage" : 0,
         "Data" : "43.6 C",
         "Description" : "",
         "Favorite" : 1,
         "HardwareID" : 4,
         "HardwareName" : "1-Wire",
         "HardwareType" : "1-Wire (System)",
         "HardwareTypeVal" : 12,
         "HaveTimeout" : false,
         "ID" : "C5FC",
         "LastUpdate" : "2017-02-01 08:00:37",
         "Name" : "Aanvoercv",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : "-",
         "SubType" : "TFA 30.3133",
         "Temp" : 43.60,
         "Timers" : "false",
         "Type" : "Temp",
         "TypeImg" : "temperature",
         "Unit" : 252,
         "Used" : 1,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "13"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "CustomImage" : 0,
         "Data" : "On",
         "Description" : "",
         "Favorite" : 0,
         "HardwareID" : 2,
         "HardwareName" : "Virtual devi e",
         "HardwareType" : "Dummy (Does nothing, use for virtual switches only)",
         "HardwareTypeVal" : 15,
         "HaveDimmer" : false,
         "HaveGroupCmd" : true,
         "HaveTimeout" : false,
         "ID" : "72",
         "Image" : "Light",
         "IsSubDevice" : false,
         "LastUpdate" : "2017-01-29 10:24:58",
         "Level" : 0,
         "LevelInt" : 0,
         "MaxDimLevel" : 0,
         "Name" : "teller webcam",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : 7,
         "Status" : "On",
         "StrParam1" : "",
         "StrParam2" : "",
         "SubType" : "X10",
         "SwitchType" : "On/Off",
         "SwitchTypeVal" : 0,
         "Timers" : "false",
         "Type" : "Lighting 1",
         "TypeImg" : "lightbulb",
         "Unit" : 1,
         "Used" : 1,
         "UsedByCamera" : false,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "14"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "CustomImage" : 0,
         "Data" : "On",
         "Description" : "",
         "Favorite" : 0,
         "HardwareID" : 3,
         "HardwareName" : "Gpio",
         "HardwareType" : "Raspberry's GPIO port",
         "HardwareTypeVal" : 32,
         "HaveDimmer" : false,
         "HaveGroupCmd" : false,
         "HaveTimeout" : false,
         "ID" : "0",
         "Image" : "Light",
         "IsSubDevice" : false,
         "LastUpdate" : "2016-11-05 21:16:28",
         "Level" : 0,
         "LevelInt" : 0,
         "MaxDimLevel" : 0,
         "Name" : "Relay switch",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : 7,
         "Status" : "On",
         "StrParam1" : "",
         "StrParam2" : "",
         "SubType" : "Impuls",
         "SwitchType" : "On/Off",
         "SwitchTypeVal" : 0,
         "Timers" : "false",
         "Type" : "Lighting 1",
         "TypeImg" : "lightbulb",
         "Unit" : 27,
         "Used" : 1,
         "UsedByCamera" : false,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "15"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "CustomImage" : 0,
         "Data" : "Open",
         "Description" : "",
         "Favorite" : 0,
         "HardwareID" : 3,
         "HardwareName" : "Gpio",
         "HardwareType" : "Raspberry's GPIO port",
         "HardwareTypeVal" : 32,
         "HaveDimmer" : false,
         "HaveGroupCmd" : false,
         "HaveTimeout" : false,
         "ID" : "0",
         "Image" : "Light",
         "IsSubDevice" : false,
         "LastUpdate" : "2017-01-22 16:12:39",
         "Level" : 0,
         "LevelInt" : 0,
         "MaxDimLevel" : 0,
         "Name" : "Doorbell GPIO",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : "-",
         "Status" : "Open",
         "StrParam1" : "c2NyaXB0Oi8vL2hvbWUvcGkvZG9tb3RpY3ovc2NyaXB0cy9kb29yYmVsbC5waHA=",
         "StrParam2" : "c2NyaXB0Oi8vL2hvbWUvcGkvZG9tb3RpY3ovc2NyaXB0cy9kb29yYmVsbC5waHA=",
         "SubType" : "Impuls",
         "SwitchType" : "Contact",
         "SwitchTypeVal" : 2,
         "Timers" : "false",
         "Type" : "Lighting 1",
         "TypeImg" : "contact",
         "Unit" : 2,
         "Used" : 1,
         "UsedByCamera" : false,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "16"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "CustomImage" : 0,
         "Data" : "On",
         "Description" : "",
         "Favorite" : 0,
         "HardwareID" : 2,
         "HardwareName" : "Virtual devi e",
         "HardwareType" : "Dummy (Does nothing, use for virtual switches only)",
         "HardwareTypeVal" : 15,
         "HaveDimmer" : false,
         "HaveGroupCmd" : true,
         "HaveTimeout" : false,
         "ID" : "65",
         "Image" : "Light",
         "IsSubDevice" : false,
         "LastUpdate" : "2017-01-29 10:24:08",
         "Level" : 0,
         "LevelInt" : 0,
         "MaxDimLevel" : 0,
         "Name" : "Temp over 43",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : 7,
         "Status" : "On",
         "StrParam1" : "",
         "StrParam2" : "",
         "SubType" : "X10",
         "SwitchType" : "On/Off",
         "SwitchTypeVal" : 0,
         "Timers" : "false",
         "Type" : "Lighting 1",
         "TypeImg" : "lightbulb",
         "Unit" : 1,
         "Used" : 1,
         "UsedByCamera" : false,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "17"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "CustomImage" : 0,
         "Data" : "26.0",
         "Description" : "",
         "Favorite" : 0,
         "HardwareID" : 2,
         "HardwareName" : "Virtual devi e",
         "HardwareType" : "Dummy (Does nothing, use for virtual switches only)",
         "HardwareTypeVal" : 15,
         "HaveTimeout" : true,
         "ID" : "0014061",
         "LastUpdate" : "2015-11-04 20:46:05",
         "Name" : "V_Thermostat",
         "Notifications" : "false",
         "PlanID" : "2",
         "PlanIDs" : [ 2 ],
         "Protected" : false,
         "SetPoint" : "26.0",
         "ShowNotifications" : true,
         "SignalLevel" : "-",
         "SubType" : "SetPoint",
         "Timers" : "false",
         "Type" : "Thermostat",
         "TypeImg" : "override_mini",
         "Unit" : 1,
         "Used" : 1,
         "XOffset" : "279",
         "YOffset" : "32",
         "idx" : "18"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "CustomImage" : 0,
         "Data" : "65 dB",
         "Description" : "",
         "Favorite" : 1,
         "HardwareID" : 2,
         "HardwareName" : "Virtual devi e",
         "HardwareType" : "Dummy (Does nothing, use for virtual switches only)",
         "HardwareTypeVal" : 15,
         "HaveTimeout" : true,
         "ID" : "82018",
         "LastUpdate" : "2015-10-25 11:34:39",
         "Name" : "V_Volume",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : "-",
         "SubType" : "Sound Level",
         "Timers" : "false",
         "Type" : "General",
         "TypeImg" : "Speaker",
         "Unit" : 1,
         "Used" : 1,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "19"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "Counter" : "0.000",
         "CounterDeliv" : "0.000",
         "CounterDelivToday" : "0.000 kWh",
         "CounterToday" : "0.000 kWh",
         "CustomImage" : 0,
         "Data" : "0;0;0;0;0;0",
         "Description" : "",
         "Favorite" : 1,
         "HardwareID" : 2,
         "HardwareName" : "Virtual devi e",
         "HardwareType" : "Dummy (Does nothing, use for virtual switches only)",
         "HardwareTypeVal" : 15,
         "HaveTimeout" : true,
         "ID" : "82019",
         "LastUpdate" : "2015-11-04 20:48:04",
         "Name" : "V_Smartenergy",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : 10,
         "SubType" : "Energy",
         "SwitchTypeVal" : 0,
         "Timers" : "false",
         "Type" : "P1 Smart Meter",
         "TypeImg" : "counter",
         "Unit" : 1,
         "Usage" : "0 Watt",
         "UsageDeliv" : "0 Watt",
         "Used" : 1,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "20"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "CounterToday" : "0.000 kWh",
         "CustomImage" : 0,
         "Data" : "0.000 kWh",
         "Description" : "",
         "Favorite" : 1,
         "HardwareID" : 2,
         "HardwareName" : "Virtual devi e",
         "HardwareType" : "Dummy (Does nothing, use for virtual switches only)",
         "HardwareTypeVal" : 15,
         "HaveTimeout" : true,
         "ID" : "00014064",
         "LastUpdate" : "2015-11-04 20:52:52",
         "Name" : "V_Energy",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : 10,
         "SubType" : "kWh",
         "SwitchTypeVal" : 0,
         "Timers" : "false",
         "Type" : "General",
         "TypeImg" : "current",
         "Unit" : 1,
         "Usage" : "0.0 Watt",
         "Used" : 1,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "21"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "CustomImage" : 0,
         "Data" : "Hello World",
         "Description" : "",
         "Favorite" : 1,
         "HardwareID" : 2,
         "HardwareName" : "Virtual devi e",
         "HardwareType" : "Dummy (Does nothing, use for virtual switches only)",
         "HardwareTypeVal" : 15,
         "HaveTimeout" : false,
         "ID" : "82021",
         "LastUpdate" : "2015-11-04 20:55:14",
         "Name" : "hdw_Sonos",
         "Notifications" : "false",
         "PlanID" : "2",
         "PlanIDs" : [ 2 ],
         "Protected" : false,
         "ShowNotifications" : false,
         "SignalLevel" : "-",
         "SubType" : "Text",
         "Timers" : "false",
         "Type" : "General",
         "TypeImg" : "text",
         "Unit" : 1,
         "Used" : 1,
         "XOffset" : "572",
         "YOffset" : "103",
         "idx" : "22"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "CustomImage" : 0,
         "Data" : "Hello World",
         "Description" : "",
         "Favorite" : 0,
         "HardwareID" : 2,
         "HardwareName" : "Virtual devi e",
         "HardwareType" : "Dummy (Does nothing, use for virtual switches only)",
         "HardwareTypeVal" : 15,
         "HaveTimeout" : false,
         "ID" : "82022",
         "LastUpdate" : "2015-11-04 20:56:13",
         "Name" : "hdw_DateTimeNews",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : false,
         "SignalLevel" : "-",
         "SubType" : "Text",
         "Timers" : "false",
         "Type" : "General",
         "TypeImg" : "text",
         "Unit" : 1,
         "Used" : 1,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "23"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 100,
         "CustomImage" : 0,
         "Data" : "30.1 C",
         "Description" : "",
         "Favorite" : 0,
         "HardwareID" : 4,
         "HardwareName" : "1-Wire",
         "HardwareType" : "1-Wire (System)",
         "HardwareTypeVal" : 12,
         "HaveTimeout" : true,
         "ID" : "FFA2",
         "LastUpdate" : "2015-11-21 19:19:16",
         "Name" : "Unknown",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : "-",
         "SubType" : "TFA 30.3133",
         "Temp" : 30.10,
         "Timers" : "false",
         "Type" : "Temp",
         "TypeImg" : "temperature",
         "Unit" : 162,
         "Used" : 1,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "24"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "CustomImage" : 0,
         "Data" : "Auto",
         "Description" : "",
         "Favorite" : 0,
         "HardwareID" : 8,
         "HardwareName" : "Evohome",
         "HardwareType" : "Evohome via script",
         "HardwareTypeVal" : 40,
         "HaveDimmer" : false,
         "HaveGroupCmd" : false,
         "HaveTimeout" : false,
         "ID" : "92024",
         "LastUpdate" : "2016-01-14 20:38:11",
         "MaxDimLevel" : 0,
         "Name" : "Unknown",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : 10,
         "Status" : "Auto",
         "StrParam1" : "",
         "StrParam2" : "",
         "SubType" : "Evohome",
         "SwitchType" : "evohome",
         "SwitchTypeVal" : 0,
         "Timers" : "false",
         "Type" : "Heating",
         "TypeImg" : "override_mini",
         "Unit" : 0,
         "Used" : 1,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "25"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "CounterToday" : "1.725 kWh",
         "CustomImage" : 0,
         "Data" : "120.453 kWh",
         "Description" : "",
         "Favorite" : 1,
         "HardwareID" : 9,
         "HardwareName" : "Virtual devi e",
         "HardwareType" : "Winddelen",
         "HardwareTypeVal" : 57,
         "HaveTimeout" : false,
         "ID" : "00001F01",
         "LastUpdate" : "2017-02-01 08:00:39",
         "Name" : "Wind Power",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : "-",
         "SubType" : "kWh",
         "SwitchTypeVal" : 0,
         "Timers" : "false",
         "Type" : "General",
         "TypeImg" : "current",
         "Unit" : 1,
         "Usage" : "234.0 Watt",
         "Used" : 1,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "26"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "CustomImage" : 0,
         "Data" : "Set Level: 100 %, Level: 100 %",
         "Description" : "",
         "Favorite" : 1,
         "HardwareID" : 2,
         "HardwareName" : "Virtual devi e",
         "HardwareType" : "Dummy (Does nothing, use for virtual switches only)",
         "HardwareTypeVal" : 15,
         "HaveDimmer" : true,
         "HaveGroupCmd" : true,
         "HaveTimeout" : false,
         "ID" : "001406A",
         "Image" : "Light",
         "IsSubDevice" : false,
         "LastUpdate" : "2017-01-31 20:26:18",
         "Level" : 100,
         "LevelInt" : 15,
         "MaxDimLevel" : 15,
         "Name" : "Switch test Tom2",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : 7,
         "Status" : "Set Level: 100 %",
         "StrParam1" : "",
         "StrParam2" : "",
         "SubType" : "AC",
         "SwitchType" : "On/Off",
         "SwitchTypeVal" : 0,
         "Timers" : "false",
         "Type" : "Lighting 2",
         "TypeImg" : "lightbulb",
         "Unit" : 1,
         "Used" : 1,
         "UsedByCamera" : false,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "27"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "CustomImage" : 0,
         "Data" : "Set Level: 100 %, Level: 100 %",
         "Description" : "",
         "Favorite" : 1,
         "HardwareID" : 2,
         "HardwareName" : "Virtual devi e",
         "HardwareType" : "Dummy (Does nothing, use for virtual switches only)",
         "HardwareTypeVal" : 15,
         "HaveDimmer" : true,
         "HaveGroupCmd" : true,
         "HaveTimeout" : false,
         "ID" : "001406B",
         "Image" : "Light",
         "IsSubDevice" : false,
         "LastUpdate" : "2017-02-01 07:56:21",
         "Level" : 100,
         "LevelInt" : 15,
         "MaxDimLevel" : 15,
         "Name" : "Switch test Tom",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : 7,
         "Status" : "Set Level: 100 %",
         "StrParam1" : "",
         "StrParam2" : "",
         "SubType" : "AC",
         "SwitchType" : "On/Off",
         "SwitchTypeVal" : 0,
         "Timers" : "false",
         "Type" : "Lighting 2",
         "TypeImg" : "lightbulb",
         "Unit" : 1,
         "Used" : 1,
         "UsedByCamera" : false,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "28"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "CustomImage" : 0,
         "Data" : "On",
         "Description" : "",
         "Favorite" : 1,
         "HardwareID" : 2,
         "HardwareName" : "Virtual devi e",
         "HardwareType" : "Dummy (Does nothing, use for virtual switches only)",
         "HardwareTypeVal" : 15,
         "HaveDimmer" : true,
         "HaveGroupCmd" : false,
         "HaveTimeout" : false,
         "ID" : "82028",
         "Image" : "Light",
         "IsSubDevice" : false,
         "LastUpdate" : "2017-01-08 20:04:01",
         "Level" : 0,
         "LevelInt" : 0,
         "MaxDimLevel" : 100,
         "Name" : "Virtual RGB switch",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : "-",
         "Status" : "On",
         "StrParam1" : "",
         "StrParam2" : "",
         "SubType" : "RGB",
         "SwitchType" : "On/Off",
         "SwitchTypeVal" : 0,
         "Timers" : "false",
         "Type" : "Lighting Limitless/Applamp",
         "TypeImg" : "lightbulb",
         "Unit" : 1,
         "Used" : 1,
         "UsedByCamera" : false,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "29"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "CustomImage" : 0,
         "Data" : "Off",
         "Description" : "",
         "Favorite" : 0,
         "HardwareID" : 2,
         "HardwareName" : "Virtual devi e",
         "HardwareType" : "Dummy (Does nothing, use for virtual switches only)",
         "HardwareTypeVal" : 15,
         "HaveDimmer" : true,
         "HaveGroupCmd" : false,
         "HaveTimeout" : false,
         "ID" : "00082028",
         "Image" : "Light",
         "IsSubDevice" : false,
         "LastUpdate" : "2017-02-01 07:57:21",
         "Level" : 0,
         "LevelInt" : 0,
         "MaxDimLevel" : 100,
         "Name" : "APPLAMPRGB",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : "-",
         "Status" : "Off",
         "StrParam1" : "",
         "StrParam2" : "",
         "SubType" : "RGB",
         "SwitchType" : "On/Off",
         "SwitchTypeVal" : 0,
         "Timers" : "false",
         "Type" : "Lighting Limitless/Applamp",
         "TypeImg" : "lightbulb",
         "Unit" : 1,
         "Used" : 1,
         "UsedByCamera" : false,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "30"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "CustomImage" : 0,
         "Data" : "20.5",
         "Description" : "",
         "Favorite" : 1,
         "HardwareID" : 2,
         "HardwareName" : "Virtual devi e",
         "HardwareType" : "Dummy (Does nothing, use for virtual switches only)",
         "HardwareTypeVal" : 15,
         "HaveTimeout" : true,
         "ID" : "001406E",
         "LastUpdate" : "2017-01-08 20:19:19",
         "Name" : "ThermostatSetpoint",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "SetPoint" : "20.5",
         "ShowNotifications" : true,
         "SignalLevel" : "-",
         "SubType" : "SetPoint",
         "Timers" : "false",
         "Type" : "Thermostat",
         "TypeImg" : "override_mini",
         "Unit" : 1,
         "Used" : 1,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "31"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "Barometer" : 1010,
         "BatteryLevel" : 255,
         "CustomImage" : 0,
         "Data" : "0.0 C, 50 %, 1010 hPa",
         "Description" : "",
         "DewPoint" : "-9.20",
         "Favorite" : 1,
         "Forecast" : 1,
         "ForecastStr" : "Sunny",
         "HardwareID" : 2,
         "HardwareName" : "Virtual devi e",
         "HardwareType" : "Dummy (Does nothing, use for virtual switches only)",
         "HardwareTypeVal" : 15,
         "HaveTimeout" : true,
         "Humidity" : 50,
         "HumidityStatus" : "Comfortable",
         "ID" : "1406F",
         "LastUpdate" : "2017-01-08 20:19:36",
         "Name" : "TempHumBar VIrtua",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : "-",
         "SubType" : "THB1 - BTHR918, BTHGN129",
         "Temp" : 0.0,
         "Timers" : "false",
         "Type" : "Temp + Humidity + Baro",
         "TypeImg" : "temperature",
         "Unit" : 1,
         "Used" : 1,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "32"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "CustomImage" : 0,
         "Data" : "On",
         "Description" : "",
         "Favorite" : 1,
         "HardwareID" : 2,
         "HardwareName" : "Virtual devi e",
         "HardwareType" : "Dummy (Does nothing, use for virtual switches only)",
         "HardwareTypeVal" : 15,
         "HaveDimmer" : true,
         "HaveGroupCmd" : false,
         "HaveTimeout" : false,
         "ID" : "82032",
         "Image" : "Light",
         "IsSubDevice" : false,
         "LastUpdate" : "2017-01-08 20:20:08",
         "Level" : 0,
         "LevelInt" : 0,
         "MaxDimLevel" : 100,
         "Name" : "Virtual RGB switch2",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : "-",
         "Status" : "On",
         "StrParam1" : "",
         "StrParam2" : "",
         "SubType" : "RGB",
         "SwitchType" : "On/Off",
         "SwitchTypeVal" : 0,
         "Timers" : "false",
         "Type" : "Lighting Limitless/Applamp",
         "TypeImg" : "lightbulb",
         "Unit" : 1,
         "Used" : 1,
         "UsedByCamera" : false,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "33"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "CustomImage" : 0,
         "Data" : "Off",
         "Description" : "",
         "Favorite" : 1,
         "HardwareID" : 2,
         "HardwareName" : "Virtual devi e",
         "HardwareType" : "Dummy (Does nothing, use for virtual switches only)",
         "HardwareTypeVal" : 15,
         "HaveDimmer" : true,
         "HaveGroupCmd" : false,
         "HaveTimeout" : false,
         "ID" : "00082032",
         "Image" : "Light",
         "IsSubDevice" : false,
         "LastUpdate" : "2017-02-01 07:34:08",
         "Level" : 0,
         "LevelInt" : 0,
         "MaxDimLevel" : 100,
         "Name" : "LIGHT MOL",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : "-",
         "Status" : "Off",
         "StrParam1" : "",
         "StrParam2" : "",
         "SubType" : "RGB",
         "SwitchType" : "On/Off",
         "SwitchTypeVal" : 0,
         "Timers" : "false",
         "Type" : "Lighting Limitless/Applamp",
         "TypeImg" : "lightbulb",
         "Unit" : 1,
         "Used" : 1,
         "UsedByCamera" : false,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "34"
      },
      {
         "AddjMulti" : 1.0,
         "AddjMulti2" : 1.0,
         "AddjValue" : 0.0,
         "AddjValue2" : 0.0,
         "BatteryLevel" : 255,
         "CustomImage" : 0,
         "Data" : "On",
         "Description" : "",
         "Favorite" : 0,
         "HardwareID" : 2,
         "HardwareName" : "Virtual devi e",
         "HardwareType" : "Dummy (Does nothing, use for virtual switches only)",
         "HardwareTypeVal" : 15,
         "HaveDimmer" : true,
         "HaveGroupCmd" : false,
         "HaveTimeout" : false,
         "ID" : "82034",
         "Image" : "Light",
         "IsSubDevice" : false,
         "LastUpdate" : "2017-01-29 10:22:19",
         "Level" : 0,
         "LevelInt" : 0,
         "MaxDimLevel" : 100,
         "Name" : "APPLAMP",
         "Notifications" : "false",
         "PlanID" : "0",
         "PlanIDs" : [ 0 ],
         "Protected" : false,
         "ShowNotifications" : true,
         "SignalLevel" : "-",
         "Status" : "On",
         "StrParam1" : "",
         "StrParam2" : "",
         "SubType" : "RGB",
         "SwitchType" : "On/Off",
         "SwitchTypeVal" : 0,
         "Timers" : "false",
         "Type" : "Lighting Limitless/Applamp",
         "TypeImg" : "lightbulb",
         "Unit" : 1,
         "Used" : 1,
         "UsedByCamera" : false,
         "XOffset" : "0",
         "YOffset" : "0",
         "idx" : "35"
      }
   ],
   "status" : "OK",
   "title" : "Devices"
}

*/