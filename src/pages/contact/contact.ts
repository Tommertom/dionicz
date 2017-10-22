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

  constructor(public navCtrl: NavController) {

  }


  ionViewDidEnter() {

    setTimeout(() => {

      let elem = document.querySelector('.grid');

      let pckry = new Packery(this.gridPackery.nativeElement, {
        itemSelector: ".grid-item",
        gutter: 10,
        columnWidth: 60
      });

      pckry.getItemElements().forEach(item => {
        let draggie = new Draggabilly(item, {grid: [ 20, 20 ]});
        pckry.bindDraggabillyEvents(draggie);
        this.draggies.push(draggie);

        draggie.enable();
        draggie.bindHandles();
        //draggie.unbindHandles();

        //draggie.disable();
        //draggie.unbindHandles();
      })

      /*
           for (let i = 0; i < this.draggies.length; i++)
            {
                this.draggies[i].enable();
               this.draggies[i].bindHandles();
            }
      */


    }, 100);
  }

}
