/*
https://api.wunderground.com/api/
*/

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

import * as XML from 'pixl-xml';

@Injectable()
export class WeatherProvider {


    private providerState: Object = {};

    constructor(private http: Http, private events: Events) {
        let newsinput;
        try {
            newsinput = XML.parse(this.getTestData());
        }
        catch (err) {
        }
        console.log('NEWSINPUT', newsinput)
    };

    getAvailableUIDs() {
    }


    doFullRefresh() {
        this.events.publish('sync-weather');
    }


    getProviderPoller() {

    }

    getWeatherPoller() {

        return Observable.merge(

            Observable.create(observer => {
                this.events.subscribe('sync-weather', () => {
                    observer.next('0');
                })
            }),

            Observable.timer(0, 1000)
        )
            .switchMap(() =>
                this.http.get('xml.buienradar.nl')
            )
    }

    storeState(item, type) {
        let hash = item['idx'] + type;
        this.providerState[hash] = Object.assign({ _type: type }, item);
    }

    getState() {
        return this.providerState;
    }

    doneWeatherService() {
        //  this.doRefresh = false;
        //    this.isInitialised = false;
    }

    getTestData() {


        return `
        <buienradarnl>
<weergegevens>
<titel>www.buienradar.nl - actuele weersinformatie</titel>
<link>http://www.buienradar.nl</link>
<omschrijving>Publieke weersinformatie feed</omschrijving>
<language>nl-nl</language>
<copyright>
(C)opyright 2005 - 2017 Buienradar B.V. Alle rechten voorbehouden
</copyright>
<gebruik>
Deze feed mag vrij worden gebruikt onder voorwaarde van bronvermelding buienradar.nl inclusief een hyperlink naar https://www.buienradar.nl. Aan de feed kunnen door gebruikers of andere personen geen rechten worden ontleend.
</gebruik>
<image>
<titel>buienradar.nl</titel>
<link>http://www.buienradar.nl/</link>
<url>
http://www.buienradar.nl/resources/images/logor.svg
</url>
<width>950</width>
<height>78</height>
</image>
<actueel_weer>
<weerstations>
<weerstation id="6391">
<stationcode>6391</stationcode>
<stationnaam regio="Venlo">Meetstation Arcen</stationnaam>
<lat>51.50</lat>
<lon>6.20</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>74</luchtvochtigheid>
<temperatuurGC>10.8</temperatuurGC>
<windsnelheidMS>1.77</windsnelheidMS>
<windsnelheidBF>2</windsnelheidBF>
<windrichtingGR>185</windrichtingGR>
<windrichting>Z</windrichting>
<luchtdruk>-</luchtdruk>
<zichtmeters>-</zichtmeters>
<windstotenMS>3.3</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>9.7</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6391
</url>
<latGraden>51.83</latGraden>
<lonGraden>6.33</lonGraden>
</weerstation>
<weerstation id="6275">
<stationcode>6275</stationcode>
<stationnaam regio="Arnhem">Meetstation Arnhem</stationnaam>
<lat>52.07</lat>
<lon>5.88</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>71</luchtvochtigheid>
<temperatuurGC>11.3</temperatuurGC>
<windsnelheidMS>4.51</windsnelheidMS>
<windsnelheidBF>3</windsnelheidBF>
<windrichtingGR>189</windrichtingGR>
<windrichting>Z</windrichting>
<luchtdruk>1015.17</luchtdruk>
<zichtmeters>29700</zichtmeters>
<windstotenMS>6</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>10.5</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6275
</url>
<latGraden>52.11</latGraden>
<lonGraden>6.47</lonGraden>
</weerstation>
<weerstation id="6249">
<stationcode>6249</stationcode>
<stationnaam regio="Berkhout">Meetstation Berkhout</stationnaam>
<lat>52.65</lat>
<lon>4.98</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>79</luchtvochtigheid>
<temperatuurGC>10.2</temperatuurGC>
<windsnelheidMS>4.02</windsnelheidMS>
<windsnelheidBF>3</windsnelheidBF>
<windrichtingGR>216</windrichtingGR>
<windrichting>ZW</windrichting>
<luchtdruk>-</luchtdruk>
<zichtmeters>25800</zichtmeters>
<windstotenMS>5.5</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>9.6</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6249
</url>
<latGraden>53.08</latGraden>
<lonGraden>5.64</lonGraden>
</weerstation>
<weerstation id="6308">
<stationcode>6308</stationcode>
<stationnaam regio="Cadzand">Meetstation Cadzand</stationnaam>
<lat>51.38</lat>
<lon>3.38</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>-</luchtvochtigheid>
<temperatuurGC>-</temperatuurGC>
<windsnelheidMS>7.16</windsnelheidMS>
<windsnelheidBF>4</windsnelheidBF>
<windrichtingGR>216</windrichtingGR>
<windrichting>-</windrichting>
<luchtdruk>-</luchtdruk>
<zichtmeters>-</zichtmeters>
<windstotenMS>-</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>-</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6308
</url>
<latGraden>51.64</latGraden>
<lonGraden>3.64</lonGraden>
</weerstation>
<weerstation id="6260">
<stationcode>6260</stationcode>
<stationnaam regio="Utrecht">Meetstation De Bilt</stationnaam>
<lat>52.10</lat>
<lon>5.18</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>72</luchtvochtigheid>
<temperatuurGC>10.7</temperatuurGC>
<windsnelheidMS>3.44</windsnelheidMS>
<windsnelheidBF>3</windsnelheidBF>
<windrichtingGR>206</windrichtingGR>
<windrichting>ZZW</windrichting>
<luchtdruk>1015.03</luchtdruk>
<zichtmeters>32900</zichtmeters>
<windstotenMS>5.6</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>9.8</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6260
</url>
<latGraden>52.17</latGraden>
<lonGraden>5.31</lonGraden>
</weerstation>
<weerstation id="6235">
<stationcode>6235</stationcode>
<stationnaam regio="Den Helder">Meetstation Den Helder</stationnaam>
<lat>52.92</lat>
<lon>4.78</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>81</luchtvochtigheid>
<temperatuurGC>12.9</temperatuurGC>
<windsnelheidMS>6.22</windsnelheidMS>
<windsnelheidBF>4</windsnelheidBF>
<windrichtingGR>229</windrichtingGR>
<windrichting>ZW</windrichting>
<luchtdruk>1013.44</luchtdruk>
<zichtmeters>14100</zichtmeters>
<windstotenMS>8.8</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>12.1</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6235
</url>
<latGraden>53.53</latGraden>
<lonGraden>5.31</lonGraden>
</weerstation>
<weerstation id="6370">
<stationcode>6370</stationcode>
<stationnaam regio="Eindhoven">Meetstation Eindhoven</stationnaam>
<lat>51.45</lat>
<lon>5.42</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>72</luchtvochtigheid>
<temperatuurGC>10.4</temperatuurGC>
<windsnelheidMS>1.83</windsnelheidMS>
<windsnelheidBF>2</windsnelheidBF>
<windrichtingGR>188</windrichtingGR>
<windrichting>Z</windrichting>
<luchtdruk>1016.02</luchtdruk>
<zichtmeters>29800</zichtmeters>
<windstotenMS>3.8</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>9.3</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6370
</url>
<latGraden>51.75</latGraden>
<lonGraden>5.69</lonGraden>
</weerstation>
<weerstation id="6377">
<stationcode>6377</stationcode>
<stationnaam regio="Weert">Meetstation Ell</stationnaam>
<lat>51.20</lat>
<lon>5.77</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>84</luchtvochtigheid>
<temperatuurGC>9.1</temperatuurGC>
<windsnelheidMS>1.54</windsnelheidMS>
<windsnelheidBF>1</windsnelheidBF>
<windrichtingGR>161</windrichtingGR>
<windrichting>ZZO</windrichting>
<luchtdruk>-</luchtdruk>
<zichtmeters>18300</zichtmeters>
<windstotenMS>2</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>7.8</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6377
</url>
<latGraden>51.33</latGraden>
<lonGraden>6.28</lonGraden>
</weerstation>
<weerstation id="6321">
<stationcode>6321</stationcode>
<stationnaam regio="Noordzee">Meetstation Euro platform</stationnaam>
<lat>52.00</lat>
<lon>3.28</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>-</luchtvochtigheid>
<temperatuurGC>-</temperatuurGC>
<windsnelheidMS>10.25</windsnelheidMS>
<windsnelheidBF>5</windsnelheidBF>
<windrichtingGR>219</windrichtingGR>
<windrichting>-</windrichting>
<luchtdruk>-</luchtdruk>
<zichtmeters>-</zichtmeters>
<windstotenMS>-</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>-</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6321
</url>
<latGraden>52.00</latGraden>
<lonGraden>3.47</lonGraden>
</weerstation>
<weerstation id="6350">
<stationcode>6350</stationcode>
<stationnaam regio="Gilze Rijen">Meetstation Gilze Rijen</stationnaam>
<lat>51.57</lat>
<lon>4.93</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>80</luchtvochtigheid>
<temperatuurGC>8.5</temperatuurGC>
<windsnelheidMS>2.82</windsnelheidMS>
<windsnelheidBF>2</windsnelheidBF>
<windrichtingGR>185</windrichtingGR>
<windrichting>Z</windrichting>
<luchtdruk>1015.75</luchtdruk>
<zichtmeters>23000</zichtmeters>
<windstotenMS>3.4</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>7.3</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6350
</url>
<latGraden>51.94</latGraden>
<lonGraden>5.56</lonGraden>
</weerstation>
<weerstation id="6283">
<stationcode>6283</stationcode>
<stationnaam regio="Oost-Overijssel">Meetstation Groenlo-Hupsel</stationnaam>
<lat>52.07</lat>
<lon>6.65</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>77</luchtvochtigheid>
<temperatuurGC>10.7</temperatuurGC>
<windsnelheidMS>2.72</windsnelheidMS>
<windsnelheidBF>2</windsnelheidBF>
<windrichtingGR>190</windrichtingGR>
<windrichting>Z</windrichting>
<luchtdruk>-</luchtdruk>
<zichtmeters>-</zichtmeters>
<windstotenMS>4.4</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>9.3</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6283
</url>
<latGraden>52.11</latGraden>
<lonGraden>7.08</lonGraden>
</weerstation>
<weerstation id="6280">
<stationcode>6280</stationcode>
<stationnaam regio="Groningen">Meetstation Groningen</stationnaam>
<lat>53.13</lat>
<lon>6.58</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>83</luchtvochtigheid>
<temperatuurGC>10.2</temperatuurGC>
<windsnelheidMS>4.35</windsnelheidMS>
<windsnelheidBF>3</windsnelheidBF>
<windrichtingGR>207</windrichtingGR>
<windrichting>ZZW</windrichting>
<luchtdruk>1013.69</luchtdruk>
<zichtmeters>16500</zichtmeters>
<windstotenMS>5.8</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="qq" zin="Zwaar bewolkt en regen">
https://www.buienradar.nl/resources/images/icons/weather/30x30/qq.png
</icoonactueel>
<temperatuur10cm>9.6</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6280
</url>
<latGraden>53.22</latGraden>
<lonGraden>6.97</lonGraden>
</weerstation>
<weerstation id="6315">
<stationcode>6315</stationcode>
<stationnaam regio="Oost-Zeeland">Meetstation Hansweert</stationnaam>
<lat>51.45</lat>
<lon>4.00</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>-</luchtvochtigheid>
<temperatuurGC>-</temperatuurGC>
<windsnelheidMS>7.92</windsnelheidMS>
<windsnelheidBF>4</windsnelheidBF>
<windrichtingGR>239</windrichtingGR>
<windrichting>-</windrichting>
<luchtdruk>-</luchtdruk>
<zichtmeters>-</zichtmeters>
<windstotenMS>-</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>-</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6315
</url>
<latGraden>51.75</latGraden>
<lonGraden>4.00</lonGraden>
</weerstation>
<weerstation id="6278">
<stationcode>6278</stationcode>
<stationnaam regio="Zwolle">Meetstation Heino</stationnaam>
<lat>52.43</lat>
<lon>6.27</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>75</luchtvochtigheid>
<temperatuurGC>11.2</temperatuurGC>
<windsnelheidMS>1.93</windsnelheidMS>
<windsnelheidBF>2</windsnelheidBF>
<windrichtingGR>201</windrichtingGR>
<windrichting>ZZW</windrichting>
<luchtdruk>-</luchtdruk>
<zichtmeters>-</zichtmeters>
<windstotenMS>3</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>10.3</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6278
</url>
<latGraden>52.72</latGraden>
<lonGraden>6.44</lonGraden>
</weerstation>
<weerstation id="6356">
<stationcode>6356</stationcode>
<stationnaam regio="Gorinchem">Meetstation Herwijnen</stationnaam>
<lat>51.87</lat>
<lon>5.15</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>75</luchtvochtigheid>
<temperatuurGC>10.2</temperatuurGC>
<windsnelheidMS>3.75</windsnelheidMS>
<windsnelheidBF>3</windsnelheidBF>
<windrichtingGR>204</windrichtingGR>
<windrichting>ZZW</windrichting>
<luchtdruk>1015.21</luchtdruk>
<zichtmeters>-</zichtmeters>
<windstotenMS>6.3</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="aa" zin="Vrijwel onbewolkt (zonnig/helder)">
https://www.buienradar.nl/resources/images/icons/weather/30x30/aa.png
</icoonactueel>
<temperatuur10cm>9.3</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6356
</url>
<latGraden>52.44</latGraden>
<lonGraden>5.25</lonGraden>
</weerstation>
<weerstation id="6330">
<stationcode>6330</stationcode>
<stationnaam regio="Hoek van Holland">Meetstation Hoek van Holland</stationnaam>
<lat>51.98</lat>
<lon>4.10</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>73</luchtvochtigheid>
<temperatuurGC>11.3</temperatuurGC>
<windsnelheidMS>7.61</windsnelheidMS>
<windsnelheidBF>4</windsnelheidBF>
<windrichtingGR>210</windrichtingGR>
<windrichting>ZZW</windrichting>
<luchtdruk>1015.42</luchtdruk>
<zichtmeters>-</zichtmeters>
<windstotenMS>10</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>11.0</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6330
</url>
<latGraden>52.64</latGraden>
<lonGraden>4.17</lonGraden>
</weerstation>
<weerstation id="6279">
<stationcode>6279</stationcode>
<stationnaam regio="Hoogeveen">Meetstation Hoogeveen</stationnaam>
<lat>52.73</lat>
<lon>6.52</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>76</luchtvochtigheid>
<temperatuurGC>10.7</temperatuurGC>
<windsnelheidMS>5.58</windsnelheidMS>
<windsnelheidBF>4</windsnelheidBF>
<windrichtingGR>199</windrichtingGR>
<windrichting>ZZW</windrichting>
<luchtdruk>1014.22</luchtdruk>
<zichtmeters>20800</zichtmeters>
<windstotenMS>7.8</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>1</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>10.1</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6279
</url>
<latGraden>53.22</latGraden>
<lonGraden>6.86</lonGraden>
</weerstation>
<weerstation id="6251">
<stationcode>6251</stationcode>
<stationnaam regio="Wadden">Meetstation Hoorn Terschelling</stationnaam>
<lat>53.38</lat>
<lon>5.35</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>92</luchtvochtigheid>
<temperatuurGC>11.9</temperatuurGC>
<windsnelheidMS>5.67</windsnelheidMS>
<windsnelheidBF>4</windsnelheidBF>
<windrichtingGR>229</windrichtingGR>
<windrichting>ZW</windrichting>
<luchtdruk>1012.68</luchtdruk>
<zichtmeters>12400</zichtmeters>
<windstotenMS>7.5</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>11.5</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6251
</url>
<latGraden>53.64</latGraden>
<lonGraden>5.58</lonGraden>
</weerstation>
<weerstation id="6258">
<stationcode>6258</stationcode>
<stationnaam regio="Enkhuizen-Lelystad">Meetstation Houtribdijk</stationnaam>
<lat>52.65</lat>
<lon>5.40</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>-</luchtvochtigheid>
<temperatuurGC>-</temperatuurGC>
<windsnelheidMS>9.42</windsnelheidMS>
<windsnelheidBF>5</windsnelheidBF>
<windrichtingGR>216</windrichtingGR>
<windrichting>ZW</windrichting>
<luchtdruk>-</luchtdruk>
<zichtmeters>-</zichtmeters>
<windstotenMS>10.9</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>-</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6258
</url>
<latGraden>53.08</latGraden>
<lonGraden>5.67</lonGraden>
</weerstation>
<weerstation id="6285">
<stationcode>6285</stationcode>
<stationnaam regio="Schiermonnikoog">Meetstation Huibertgat</stationnaam>
<lat>53.57</lat>
<lon>6.40</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>-</luchtvochtigheid>
<temperatuurGC>-</temperatuurGC>
<windsnelheidMS>-</windsnelheidMS>
<windsnelheidBF>0</windsnelheidBF>
<windrichtingGR>0</windrichtingGR>
<windrichting>-</windrichting>
<luchtdruk>-</luchtdruk>
<zichtmeters>-</zichtmeters>
<windstotenMS>-</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>-</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6285
</url>
<latGraden>53.94</latGraden>
<lonGraden>6.67</lonGraden>
</weerstation>
<weerstation id="6209">
<stationcode>6209</stationcode>
<stationnaam regio="IJmond">Meetstation IJmond</stationnaam>
<lat>52.47</lat>
<lon>4.52</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>-</luchtvochtigheid>
<temperatuurGC>-</temperatuurGC>
<windsnelheidMS>9.92</windsnelheidMS>
<windsnelheidBF>5</windsnelheidBF>
<windrichtingGR>215</windrichtingGR>
<windrichting>-</windrichting>
<luchtdruk>-</luchtdruk>
<zichtmeters>-</zichtmeters>
<windstotenMS>-</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>-</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6209
</url>
<latGraden>52.78</latGraden>
<lonGraden>4.86</lonGraden>
</weerstation>
<weerstation id="6225">
<stationcode>6225</stationcode>
<stationnaam regio="IJmuiden">Meetstation IJmuiden</stationnaam>
<lat>52.47</lat>
<lon>4.57</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>-</luchtvochtigheid>
<temperatuurGC>-</temperatuurGC>
<windsnelheidMS>9.83</windsnelheidMS>
<windsnelheidBF>5</windsnelheidBF>
<windrichtingGR>220</windrichtingGR>
<windrichting>ZW</windrichting>
<luchtdruk>-</luchtdruk>
<zichtmeters>-</zichtmeters>
<windstotenMS>11.7</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>-</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6225
</url>
<latGraden>52.78</latGraden>
<lonGraden>4.94</lonGraden>
</weerstation>
<weerstation id="6277">
<stationcode>6277</stationcode>
<stationnaam regio="Noord-Groningen">Meetstation Lauwersoog</stationnaam>
<lat>53.42</lat>
<lon>6.20</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>86</luchtvochtigheid>
<temperatuurGC>10.7</temperatuurGC>
<windsnelheidMS>6.68</windsnelheidMS>
<windsnelheidBF>4</windsnelheidBF>
<windrichtingGR>209</windrichtingGR>
<windrichting>ZZW</windrichting>
<luchtdruk>-</luchtdruk>
<zichtmeters>-</zichtmeters>
<windstotenMS>9.6</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>10.0</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6277
</url>
<latGraden>53.69</latGraden>
<lonGraden>6.33</lonGraden>
</weerstation>
<weerstation id="6320">
<stationcode>6320</stationcode>
<stationnaam regio="Goeree">Meetstation LE Goeree</stationnaam>
<lat>51.93</lat>
<lon>3.67</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>-</luchtvochtigheid>
<temperatuurGC>-</temperatuurGC>
<windsnelheidMS>10.28</windsnelheidMS>
<windsnelheidBF>5</windsnelheidBF>
<windrichtingGR>268</windrichtingGR>
<windrichting>-</windrichting>
<luchtdruk>-</luchtdruk>
<zichtmeters>-</zichtmeters>
<windstotenMS>-</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>-</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6320
</url>
<latGraden>52.56</latGraden>
<lonGraden>4.11</lonGraden>
</weerstation>
<weerstation id="6270">
<stationcode>6270</stationcode>
<stationnaam regio="Leeuwarden">Meetstation Leeuwarden</stationnaam>
<lat>53.22</lat>
<lon>5.77</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>85</luchtvochtigheid>
<temperatuurGC>10.4</temperatuurGC>
<windsnelheidMS>4.33</windsnelheidMS>
<windsnelheidBF>3</windsnelheidBF>
<windrichtingGR>216</windrichtingGR>
<windrichting>ZW</windrichting>
<luchtdruk>1013.12</luchtdruk>
<zichtmeters>15400</zichtmeters>
<windstotenMS>6.5</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>9.8</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6270
</url>
<latGraden>53.36</latGraden>
<lonGraden>6.28</lonGraden>
</weerstation>
<weerstation id="6269">
<stationcode>6269</stationcode>
<stationnaam regio="Lelystad">Meetstation Lelystad</stationnaam>
<lat>52.45</lat>
<lon>5.53</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>75</luchtvochtigheid>
<temperatuurGC>10.9</temperatuurGC>
<windsnelheidMS>4.9</windsnelheidMS>
<windsnelheidBF>3</windsnelheidBF>
<windrichtingGR>207</windrichtingGR>
<windrichting>ZZW</windrichting>
<luchtdruk>1014.33</luchtdruk>
<zichtmeters>23900</zichtmeters>
<windstotenMS>6.2</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="aa" zin="Vrijwel onbewolkt (zonnig/helder)">
https://www.buienradar.nl/resources/images/icons/weather/30x30/aa.png
</icoonactueel>
<temperatuur10cm>9.1</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6269
</url>
<latGraden>52.75</latGraden>
<lonGraden>5.89</lonGraden>
</weerstation>
<weerstation id="6348">
<stationcode>6348</stationcode>
<stationnaam regio="West-Utrecht">Meetstation Lopik-Cabauw</stationnaam>
<lat>51.97</lat>
<lon>4.93</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>80</luchtvochtigheid>
<temperatuurGC>9.6</temperatuurGC>
<windsnelheidMS>4.16</windsnelheidMS>
<windsnelheidBF>3</windsnelheidBF>
<windrichtingGR>194</windrichtingGR>
<windrichting>ZZW</windrichting>
<luchtdruk>1015.2</luchtdruk>
<zichtmeters>24400</zichtmeters>
<windstotenMS>5</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>8.4</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6348
</url>
<latGraden>52.61</latGraden>
<lonGraden>5.56</lonGraden>
</weerstation>
<weerstation id="6380">
<stationcode>6380</stationcode>
<stationnaam regio="Maastricht">Meetstation Maastricht</stationnaam>
<lat>50.92</lat>
<lon>5.78</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>75</luchtvochtigheid>
<temperatuurGC>10.4</temperatuurGC>
<windsnelheidMS>3.46</windsnelheidMS>
<windsnelheidBF>3</windsnelheidBF>
<windrichtingGR>187</windrichtingGR>
<windrichting>Z</windrichting>
<luchtdruk>1016.88</luchtdruk>
<zichtmeters>29900</zichtmeters>
<windstotenMS>5.5</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>8.4</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6380
</url>
<latGraden>51.53</latGraden>
<lonGraden>6.31</lonGraden>
</weerstation>
<weerstation id="6273">
<stationcode>6273</stationcode>
<stationnaam regio="Noordoostpolder">Meetstation Marknesse</stationnaam>
<lat>52.70</lat>
<lon>5.88</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>76</luchtvochtigheid>
<temperatuurGC>10.7</temperatuurGC>
<windsnelheidMS>4.16</windsnelheidMS>
<windsnelheidBF>3</windsnelheidBF>
<windrichtingGR>207</windrichtingGR>
<windrichting>ZZW</windrichting>
<luchtdruk>-</luchtdruk>
<zichtmeters>22700</zichtmeters>
<windstotenMS>5.8</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>10.0</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6273
</url>
<latGraden>53.17</latGraden>
<lonGraden>6.47</lonGraden>
</weerstation>
<weerstation id="6286">
<stationcode>6286</stationcode>
<stationnaam regio="Oost-Groningen">Meetstation Nieuw Beerta</stationnaam>
<lat>53.20</lat>
<lon>7.15</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>83</luchtvochtigheid>
<temperatuurGC>10.3</temperatuurGC>
<windsnelheidMS>4.82</windsnelheidMS>
<windsnelheidBF>3</windsnelheidBF>
<windrichtingGR>218</windrichtingGR>
<windrichting>ZW</windrichting>
<luchtdruk>-</luchtdruk>
<zichtmeters>-</zichtmeters>
<windstotenMS>6.6</windstotenMS>
<regenMMPU>0.2</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="qq" zin="Zwaar bewolkt en regen">
https://www.buienradar.nl/resources/images/icons/weather/30x30/qq.png
</icoonactueel>
<temperatuur10cm>9.9</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6286
</url>
<latGraden>53.33</latGraden>
<lonGraden>7.25</lonGraden>
</weerstation>
<weerstation id="6312">
<stationcode>6312</stationcode>
<stationnaam regio="Oosterschelde">Meetstation Oosterschelde</stationnaam>
<lat>51.77</lat>
<lon>3.62</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>-</luchtvochtigheid>
<temperatuurGC>-</temperatuurGC>
<windsnelheidMS>9.68</windsnelheidMS>
<windsnelheidBF>5</windsnelheidBF>
<windrichtingGR>220</windrichtingGR>
<windrichting>-</windrichting>
<luchtdruk>-</luchtdruk>
<zichtmeters>-</zichtmeters>
<windstotenMS>-</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>-</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6312
</url>
<latGraden>52.28</latGraden>
<lonGraden>4.03</lonGraden>
</weerstation>
<weerstation id="6344">
<stationcode>6344</stationcode>
<stationnaam regio="Rotterdam">Meetstation Rotterdam</stationnaam>
<lat>51.95</lat>
<lon>4.45</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>73</luchtvochtigheid>
<temperatuurGC>10.7</temperatuurGC>
<windsnelheidMS>4.16</windsnelheidMS>
<windsnelheidBF>3</windsnelheidBF>
<windrichtingGR>207</windrichtingGR>
<windrichting>ZZW</windrichting>
<luchtdruk>1015.25</luchtdruk>
<zichtmeters>26300</zichtmeters>
<windstotenMS>6.7</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="aa" zin="Vrijwel onbewolkt (zonnig/helder)">
https://www.buienradar.nl/resources/images/icons/weather/30x30/aa.png
</icoonactueel>
<temperatuur10cm>9.6</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6344
</url>
<latGraden>52.58</latGraden>
<lonGraden>4.75</lonGraden>
</weerstation>
<weerstation id="6343">
<stationcode>6343</stationcode>
<stationnaam regio="Rotterdam Haven">Meetstation Rotterdam Geulhaven</stationnaam>
<lat>51.88</lat>
<lon>4.32</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>-</luchtvochtigheid>
<temperatuurGC>-</temperatuurGC>
<windsnelheidMS>5.09</windsnelheidMS>
<windsnelheidBF>3</windsnelheidBF>
<windrichtingGR>197</windrichtingGR>
<windrichting>ZZW</windrichting>
<luchtdruk>-</luchtdruk>
<zichtmeters>-</zichtmeters>
<windstotenMS>8.7</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>-</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6343
</url>
<latGraden>52.47</latGraden>
<lonGraden>4.53</lonGraden>
</weerstation>
<weerstation id="6316">
<stationcode>6316</stationcode>
<stationnaam regio="Schaar">Meetstation Schaar</stationnaam>
<lat>51.65</lat>
<lon>3.70</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>-</luchtvochtigheid>
<temperatuurGC>-</temperatuurGC>
<windsnelheidMS>9.26</windsnelheidMS>
<windsnelheidBF>5</windsnelheidBF>
<windrichtingGR>258</windrichtingGR>
<windrichting>-</windrichting>
<luchtdruk>-</luchtdruk>
<zichtmeters>-</zichtmeters>
<windstotenMS>-</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>-</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6316
</url>
<latGraden>52.08</latGraden>
<lonGraden>4.17</lonGraden>
</weerstation>
<weerstation id="6240">
<stationcode>6240</stationcode>
<stationnaam regio="Amsterdam">Meetstation Schiphol</stationnaam>
<lat>52.30</lat>
<lon>4.77</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>75</luchtvochtigheid>
<temperatuurGC>10.3</temperatuurGC>
<windsnelheidMS>5.46</windsnelheidMS>
<windsnelheidBF>3</windsnelheidBF>
<windrichtingGR>204</windrichtingGR>
<windrichting>ZZW</windrichting>
<luchtdruk>1014.5</luchtdruk>
<zichtmeters>27500</zichtmeters>
<windstotenMS>7.3</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="aa" zin="Vrijwel onbewolkt (zonnig/helder)">
https://www.buienradar.nl/resources/images/icons/weather/30x30/aa.png
</icoonactueel>
<temperatuur10cm>9.1</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6240
</url>
<latGraden>52.50</latGraden>
<lonGraden>5.28</lonGraden>
</weerstation>
<weerstation id="6324">
<stationcode>6324</stationcode>
<stationnaam regio="Midden-Zeeland">Meetstation Stavenisse</stationnaam>
<lat>51.60</lat>
<lon>4.00</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>-</luchtvochtigheid>
<temperatuurGC>-</temperatuurGC>
<windsnelheidMS>5.66</windsnelheidMS>
<windsnelheidBF>4</windsnelheidBF>
<windrichtingGR>232</windrichtingGR>
<windrichting>-</windrichting>
<luchtdruk>-</luchtdruk>
<zichtmeters>-</zichtmeters>
<windstotenMS>-</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>-</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6324
</url>
<latGraden>52.00</latGraden>
<lonGraden>4.00</lonGraden>
</weerstation>
<weerstation id="6267">
<stationcode>6267</stationcode>
<stationnaam regio="West-Friesland">Meetstation Stavoren</stationnaam>
<lat>52.88</lat>
<lon>5.38</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>81</luchtvochtigheid>
<temperatuurGC>10.7</temperatuurGC>
<windsnelheidMS>5.17</windsnelheidMS>
<windsnelheidBF>3</windsnelheidBF>
<windrichtingGR>210</windrichtingGR>
<windrichting>ZZW</windrichting>
<luchtdruk>-</luchtdruk>
<zichtmeters>20300</zichtmeters>
<windstotenMS>7.3</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>10.0</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6267
</url>
<latGraden>53.47</latGraden>
<lonGraden>5.64</lonGraden>
</weerstation>
<weerstation id="6331">
<stationcode>6331</stationcode>
<stationnaam regio="Tholen">Meetstation Tholen</stationnaam>
<lat>51.52</lat>
<lon>4.13</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>-</luchtvochtigheid>
<temperatuurGC>-</temperatuurGC>
<windsnelheidMS>8.13</windsnelheidMS>
<windsnelheidBF>5</windsnelheidBF>
<windrichtingGR>228</windrichtingGR>
<windrichting>-</windrichting>
<luchtdruk>-</luchtdruk>
<zichtmeters>-</zichtmeters>
<windstotenMS>-</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>-</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6331
</url>
<latGraden>51.86</latGraden>
<lonGraden>4.22</lonGraden>
</weerstation>
<weerstation id="6290">
<stationcode>6290</stationcode>
<stationnaam regio="Twente">Meetstation Twente</stationnaam>
<lat>52.27</lat>
<lon>6.90</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>72</luchtvochtigheid>
<temperatuurGC>11.1</temperatuurGC>
<windsnelheidMS>4.33</windsnelheidMS>
<windsnelheidBF>3</windsnelheidBF>
<windrichtingGR>200</windrichtingGR>
<windrichting>ZZW</windrichting>
<luchtdruk>1015.3</luchtdruk>
<zichtmeters>29600</zichtmeters>
<windstotenMS>5.9</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>10.3</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6290
</url>
<latGraden>52.44</latGraden>
<lonGraden>7.50</lonGraden>
</weerstation>
<weerstation id="6313">
<stationcode>6313</stationcode>
<stationnaam regio="West-Zeeland">Meetstation Vlakte aan de Raan</stationnaam>
<lat>51.50</lat>
<lon>3.25</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>-</luchtvochtigheid>
<temperatuurGC>-</temperatuurGC>
<windsnelheidMS>9.96</windsnelheidMS>
<windsnelheidBF>5</windsnelheidBF>
<windrichtingGR>265</windrichtingGR>
<windrichting>-</windrichting>
<luchtdruk>-</luchtdruk>
<zichtmeters>-</zichtmeters>
<windstotenMS>-</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>-</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6313
</url>
<latGraden>51.83</latGraden>
<lonGraden>3.42</lonGraden>
</weerstation>
<weerstation id="6242">
<stationcode>6242</stationcode>
<stationnaam regio="Vlieland">Meetstation Vlieland</stationnaam>
<lat>53.25</lat>
<lon>4.92</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>86</luchtvochtigheid>
<temperatuurGC>12.9</temperatuurGC>
<windsnelheidMS>9.11</windsnelheidMS>
<windsnelheidBF>5</windsnelheidBF>
<windrichtingGR>240</windrichtingGR>
<windrichting>WZW</windrichting>
<luchtdruk>1012.76</luchtdruk>
<zichtmeters>14500</zichtmeters>
<windstotenMS>10.7</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>12.4</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6242
</url>
<latGraden>53.42</latGraden>
<lonGraden>5.53</lonGraden>
</weerstation>
<weerstation id="6310">
<stationcode>6310</stationcode>
<stationnaam regio="Vlissingen">Meetstation Vlissingen</stationnaam>
<lat>51.45</lat>
<lon>3.60</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>74</luchtvochtigheid>
<temperatuurGC>11.3</temperatuurGC>
<windsnelheidMS>6.27</windsnelheidMS>
<windsnelheidBF>4</windsnelheidBF>
<windrichtingGR>205</windrichtingGR>
<windrichting>ZZW</windrichting>
<luchtdruk>1015.68</luchtdruk>
<zichtmeters>25700</zichtmeters>
<windstotenMS>7.8</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>10.3</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6310
</url>
<latGraden>51.75</latGraden>
<lonGraden>4.00</lonGraden>
</weerstation>
<weerstation id="6375">
<stationcode>6375</stationcode>
<stationnaam regio="Uden">Meetstation Volkel</stationnaam>
<lat>51.65</lat>
<lon>5.70</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>74</luchtvochtigheid>
<temperatuurGC>10.8</temperatuurGC>
<windsnelheidMS>3.01</windsnelheidMS>
<windsnelheidBF>2</windsnelheidBF>
<windrichtingGR>203</windrichtingGR>
<windrichting>ZZW</windrichting>
<luchtdruk>1015.91</luchtdruk>
<zichtmeters>32500</zichtmeters>
<windstotenMS>4.1</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>9.7</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6375
</url>
<latGraden>52.08</latGraden>
<lonGraden>6.17</lonGraden>
</weerstation>
<weerstation id="6215">
<stationcode>6215</stationcode>
<stationnaam regio="Voorschoten">Meetstation Voorschoten</stationnaam>
<lat>52.12</lat>
<lon>4.43</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>72</luchtvochtigheid>
<temperatuurGC>10.5</temperatuurGC>
<windsnelheidMS>4.9</windsnelheidMS>
<windsnelheidBF>3</windsnelheidBF>
<windrichtingGR>212</windrichtingGR>
<windrichting>ZZW</windrichting>
<luchtdruk>1014.95</luchtdruk>
<zichtmeters>42000</zichtmeters>
<windstotenMS>7</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="aa" zin="Vrijwel onbewolkt (zonnig/helder)">
https://www.buienradar.nl/resources/images/icons/weather/30x30/aa.png
</icoonactueel>
<temperatuur10cm>9.9</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6215
</url>
<latGraden>52.19</latGraden>
<lonGraden>4.72</lonGraden>
</weerstation>
<weerstation id="6319">
<stationcode>6319</stationcode>
<stationnaam regio="Terneuzen">Meetstation Westdorpe</stationnaam>
<lat>51.23</lat>
<lon>3.83</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>66</luchtvochtigheid>
<temperatuurGC>11.0</temperatuurGC>
<windsnelheidMS>4.06</windsnelheidMS>
<windsnelheidBF>3</windsnelheidBF>
<windrichtingGR>183</windrichtingGR>
<windrichting>Z</windrichting>
<luchtdruk>1015.88</luchtdruk>
<zichtmeters>44700</zichtmeters>
<windstotenMS>5.8</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>9.9</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6319
</url>
<latGraden>51.39</latGraden>
<lonGraden>4.39</lonGraden>
</weerstation>
<weerstation id="6248">
<stationcode>6248</stationcode>
<stationnaam regio="Hoorn">Meetstation Wijdenes</stationnaam>
<lat>52.63</lat>
<lon>5.17</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>-</luchtvochtigheid>
<temperatuurGC>-</temperatuurGC>
<windsnelheidMS>3.93</windsnelheidMS>
<windsnelheidBF>3</windsnelheidBF>
<windrichtingGR>225</windrichtingGR>
<windrichting>ZW</windrichting>
<luchtdruk>-</luchtdruk>
<zichtmeters>-</zichtmeters>
<windstotenMS>6.1</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>-</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6248
</url>
<latGraden>53.06</latGraden>
<lonGraden>5.28</lonGraden>
</weerstation>
<weerstation id="6257">
<stationcode>6257</stationcode>
<stationnaam regio="Wijk aan Zee">Meetstation Wijk aan Zee</stationnaam>
<lat>52.50</lat>
<lon>4.60</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>73</luchtvochtigheid>
<temperatuurGC>12.6</temperatuurGC>
<windsnelheidMS>-</windsnelheidMS>
<windsnelheidBF>0</windsnelheidBF>
<windrichtingGR>0</windrichtingGR>
<windrichting>-</windrichting>
<luchtdruk>-</luchtdruk>
<zichtmeters>-</zichtmeters>
<windstotenMS>-</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>11.9</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6257
</url>
<latGraden>52.83</latGraden>
<lonGraden>5.00</lonGraden>
</weerstation>
<weerstation id="6340">
<stationcode>6340</stationcode>
<stationnaam regio="Woensdrecht">Meetstation Woensdrecht</stationnaam>
<lat>51.45</lat>
<lon>4.33</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>57</luchtvochtigheid>
<temperatuurGC>12.0</temperatuurGC>
<windsnelheidMS>3.71</windsnelheidMS>
<windsnelheidBF>3</windsnelheidBF>
<windrichtingGR>215</windrichtingGR>
<windrichting>ZW</windrichting>
<luchtdruk>1015.92</luchtdruk>
<zichtmeters>43800</zichtmeters>
<windstotenMS>7.1</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>10.9</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6340
</url>
<latGraden>51.75</latGraden>
<lonGraden>4.56</lonGraden>
</weerstation>
<weerstation id="6239">
<stationcode>6239</stationcode>
<stationnaam regio="Noordzee">Meetstation Zeeplatform F-3</stationnaam>
<lat>54.85</lat>
<lon>4.73</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>83</luchtvochtigheid>
<temperatuurGC>12.8</temperatuurGC>
<windsnelheidMS>12.87</windsnelheidMS>
<windsnelheidBF>6</windsnelheidBF>
<windrichtingGR>0</windrichtingGR>
<windrichting>-</windrichting>
<luchtdruk>1009.3</luchtdruk>
<zichtmeters>19000</zichtmeters>
<windstotenMS>17.6</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>-</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6239
</url>
<latGraden>55.42</latGraden>
<lonGraden>5.22</lonGraden>
</weerstation>
<weerstation id="6252">
<stationcode>6252</stationcode>
<stationnaam regio="Noordzee">Meetstation Zeeplatform K13</stationnaam>
<lat>53.22</lat>
<lon>3.22</lon>
<datum>11/01/2017 23:10:00</datum>
<luchtvochtigheid>-</luchtvochtigheid>
<temperatuurGC>-</temperatuurGC>
<windsnelheidMS>10.35</windsnelheidMS>
<windsnelheidBF>5</windsnelheidBF>
<windrichtingGR>246</windrichtingGR>
<windrichting>-</windrichting>
<luchtdruk>-</luchtdruk>
<zichtmeters>-</zichtmeters>
<windstotenMS>-</windstotenMS>
<regenMMPU>-</regenMMPU>
<zonintensiteitWM2>-</zonintensiteitWM2>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<temperatuur10cm>-</temperatuur10cm>
<url>
http://www.buienradar.nl/nederland/weerbericht/weergrafieken/6252
</url>
<latGraden>53.36</latGraden>
<lonGraden>3.36</lonGraden>
</weerstation>
</weerstations>
<buienindex>
<waardepercentage>6</waardepercentage>
<datum>11/01/2017 23:15:00</datum>
</buienindex>
<buienradar>
<url>
<![CDATA[
<iframe src="http://www.buienradar.nl/xmlradar.aspx" width="400" height="70" marginwidth="0" marginheight="0" hspace="0" vspace="0" frameborder="0" scrolling="no"></iframe>
]]>
</url>
<urlbackup>
<![CDATA[
<iframe src="http://www.buienradar.nl/xmlradar.aspx" width="400" height="70" marginwidth="0" marginheight="0" hspace="0" vspace="0" frameborder="0" scrolling="no"></iframe>
]]>
</urlbackup>
<icoonactueel ID="cc" zin="Zwaar bewolkt">
https://www.buienradar.nl/resources/images/icons/weather/30x30/cc.png
</icoonactueel>
<zonopkomst>11/01/2017 07:34:00</zonopkomst>
<zononder>11/01/2017 17:12:00</zononder>
<aantalonweer>0</aantalonweer>
<aantalhagel>0</aantalhagel>
</buienradar>
</actueel_weer>
<verwachting_meerdaags>
<url>
http://www.buienradar.nl/nederland/verwachtingen/5-daagse-verwachting
</url>
<urlbackup>
http://www.buienradar.nl/nederland/verwachtingen/5-daagse-verwachting
</urlbackup>
<tekst_middellang periode="donderdag 2 november 2017 tot maandag 6 november 2017">
Vrijdag nog droog maar later op zaterdag en op zondag regen. Na het weekeinde opnieuw droog met geleidelijk meer zon. Zaterdag nog vrij zacht maar vanaf zondag geleidelijk wat kouder.
</tekst_middellang>
<tekst_lang periode="dinsdag 7 november 2017 tot zaterdag 11 november 2017">
De kans op een rustig en droog weertype bedraagt ca. 60%, de kans op wisselvalliger weertype bedraagt ca. 40%. De temperaturen liggen over het algemeen rond of iets onder normaal.
</tekst_lang>
<dag-plus1>
<datum>donderdag 2 nov 2017</datum>
<dagweek>do</dagweek>
<kanszon>40</kanszon>
<kansregen>40</kansregen>
<minmmregen>0</minmmregen>
<maxmmregen>2</maxmmregen>
<mintemp>7</mintemp>
<mintempmax>7</mintempmax>
<maxtemp>13</maxtemp>
<maxtempmax>13</maxtempmax>
<windrichting>NW</windrichting>
<windkracht>3</windkracht>
<icoon ID="f">
https://www.buienradar.nl/resources/images/icons/weather/30x30/f.png
</icoon>
<sneeuwcms>0</sneeuwcms>
</dag-plus1>
<dag-plus2>
<datum>vrijdag 3 nov 2017</datum>
<dagweek>vr</dagweek>
<kanszon>20</kanszon>
<kansregen>10</kansregen>
<minmmregen>0</minmmregen>
<maxmmregen>0</maxmmregen>
<mintemp>5</mintemp>
<mintempmax>5</mintempmax>
<maxtemp>12</maxtemp>
<maxtempmax>12</maxtempmax>
<windrichting>Z</windrichting>
<windkracht>2</windkracht>
<icoon ID="c">
https://www.buienradar.nl/resources/images/icons/weather/30x30/c.png
</icoon>
<sneeuwcms>0</sneeuwcms>
</dag-plus2>
<dag-plus3>
<datum>zaterdag 4 nov 2017</datum>
<dagweek>za</dagweek>
<kanszon>10</kanszon>
<kansregen>80</kansregen>
<minmmregen>1</minmmregen>
<maxmmregen>5</maxmmregen>
<mintemp>6</mintemp>
<mintempmax>8</mintempmax>
<maxtemp>13</maxtemp>
<maxtempmax>14</maxtempmax>
<windrichting>Z</windrichting>
<windkracht>3</windkracht>
<icoon ID="q">
https://www.buienradar.nl/resources/images/icons/weather/30x30/q.png
</icoon>
<sneeuwcms>0</sneeuwcms>
</dag-plus3>
<dag-plus4>
<datum>zondag 5 nov 2017</datum>
<dagweek>zo</dagweek>
<kanszon>30</kanszon>
<kansregen>80</kansregen>
<minmmregen>3</minmmregen>
<maxmmregen>7</maxmmregen>
<mintemp>7</mintemp>
<mintempmax>9</mintempmax>
<maxtemp>9</maxtemp>
<maxtempmax>10</maxtempmax>
<windrichting>NW</windrichting>
<windkracht>4</windkracht>
<icoon ID="f">
https://www.buienradar.nl/resources/images/icons/weather/30x30/f.png
</icoon>
<sneeuwcms>0</sneeuwcms>
</dag-plus4>
<dag-plus5>
<datum>maandag 6 nov 2017</datum>
<dagweek>ma</dagweek>
<kanszon>40</kanszon>
<kansregen>20</kansregen>
<minmmregen>0</minmmregen>
<maxmmregen>0</maxmmregen>
<mintemp>3</mintemp>
<mintempmax>6</mintempmax>
<maxtemp>10</maxtemp>
<maxtempmax>11</maxtempmax>
<windrichting>N</windrichting>
<windkracht>3</windkracht>
<icoon ID="b">
https://www.buienradar.nl/resources/images/icons/weather/30x30/b.png
</icoon>
<sneeuwcms>0</sneeuwcms>
</dag-plus5>
</verwachting_meerdaags>
<verwachting_vandaag>
<url>http://www.buienradar.nl/nederland/weerbericht</url>
<urlbackup>http://www.buienradar.nl/nederland/weerbericht</urlbackup>
<titel>November zacht van start</titel>
<tijdweerbericht>Opgesteld op woensdag 1 nov 2017 om 06:00</tijdweerbericht>
<samenvatting>
November begint vrij zacht, maar vanaf zondag wordt het frisser. Het is eerst nog wat wisselvallig, vooral in het weekend. Maar vanaf maandag wordt droger en zonniger.
</samenvatting>
<tekst>
November begint vrij zacht, maar vanaf zondag wordt het frisser. Het is eerst nog wat wisselvallig, vooral in het weekend. Maar vanaf maandag wordt droger en zonniger.Vanavond trekt de regen in het noorden geleidelijk weg en klaart het vanuit het westen en zuiden op. Vannacht koelt het in de opklaringen in het zuiden af naar 6 graden. In het noordwesten liggen de minima rond 11 graden. Aan het einde van de nacht verschijnt in het noorden weer bewolking en een paar lichte buien. De zuidwestenwind waait matig en aan zee eerst nog vrij krachtig. Morgen begint in het zuiden met redelijk wat zonneschijn, maar vanuit het noorden trekt een gebied met bewolking en een beetje regen over het land. Daarachter wordt het wisselend bewolkt en komt met name in het noorden nog een bui voor. Het blijft zacht met een temperatuur van ongeveer 13 graden. In de middag wordt de matige wind noordwestelijk.De dagen erna blijft het nog even zacht. Vrijdag is een droge dag met soms wat zon en een middagtemperatuur van ongeveer 12 graden. In het weekend is het wisselvallig met zaterdag in de loop van de dag vanuit het westen regen en op zondag verspreid buien. Zaterdag wordt het nog 12 tot 14 graden, maar op zondag blijft het kwik steken op een graaf of 10. Begin volgende week komt er meer zon en blijft het droog. In de middag wordt het een graad of 10 en de nachten worden een stuk kouder met een grote kans op vorst aan de grond.
</tekst>
<formattedtekst>
November begint vrij zacht, maar vanaf zondag wordt het frisser. Het is eerst nog wat wisselvallig, vooral in het weekend. Maar vanaf maandag wordt droger en zonniger.Vanavond trekt de regen in het noorden geleidelijk weg en klaart het vanuit het westen en zuiden op. Vannacht koelt het in de opklaringen in het zuiden af naar 6 graden. In het noordwesten liggen de minima rond 11 graden. Aan het einde van de nacht verschijnt in het noorden weer bewolking en een paar lichte buien. De zuidwestenwind waait matig en aan zee eerst nog vrij krachtig. Morgen begint in het zuiden met redelijk wat zonneschijn, maar vanuit het noorden trekt een gebied met bewolking en een beetje regen over het land. Daarachter wordt het wisselend bewolkt en komt met name in het noorden nog een bui voor. Het blijft zacht met een temperatuur van ongeveer 13 graden. In de middag wordt de matige wind noordwestelijk.De dagen erna blijft het nog even zacht. Vrijdag is een droge dag met soms wat zon en een middagtemperatuur van ongeveer 12 graden. In het weekend is het wisselvallig met zaterdag in de loop van de dag vanuit het westen regen en op zondag verspreid buien. Zaterdag wordt het nog 12 tot 14 graden, maar op zondag blijft het kwik steken op een graaf of 10. Begin volgende week komt er meer zon en blijft het droog. In de middag wordt het een graad of 10 en de nachten worden een stuk kouder met een grote kans op vorst aan de grond.
</formattedtekst>
</verwachting_vandaag>
</weergegevens>
</buienradarnl>
        
        `;
    }
}

