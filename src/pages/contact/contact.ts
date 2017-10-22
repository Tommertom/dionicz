import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as Packery from 'packery';
import * as Draggabilly from 'draggabilly';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  @ViewChild('gridPackery') gridPackery;

  draggies = [];
  pckry:any;

  constructor(public navCtrl: NavController) {

  }

  imgLoaded() {
    console.log('LOADED image');
    if (this.pckry) this.pckry.layout();
  }
 
  ionViewDidEnter() {

    setTimeout(() => {

      let elem = document.querySelector('.grid');

      this.pckry = new Packery(this.gridPackery.nativeElement, {
        itemSelector: ".grid-item",
        gutter: 10,
        columnWidth: 60
      });

      this.pckry.getItemElements().forEach(item => {
        let draggie = new Draggabilly(item, {grid: [ 20, 20 ]});
        this.pckry.bindDraggabillyEvents(draggie);
        this.draggies.push(draggie);

        draggie.enable();
        draggie.bindHandles();
      })
    }, 100);
  }

}
