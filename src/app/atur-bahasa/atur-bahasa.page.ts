import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyserviceService } from '../myservices.service';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { LoadingController, AlertController, Events } from '@ionic/angular';

@Component({
  selector: 'app-atur-bahasa',
  templateUrl: './atur-bahasa.page.html',
  styleUrls: ['./atur-bahasa.page.scss'],
})
export class AturBahasaPage implements OnInit {

  bahasa;
  bahasa_name;
  aturbahasa_update;

  constructor(
    private http: Http,
    private router: Router,
    private events: Events,
    private storage: StorageMap,
    private serv: MyserviceService,
    private alertController: AlertController,
    private loadingController: LoadingController, ) { }

  ngOnInit() {
    this.storage.get('bahasa').subscribe((data) => {
      if (data) {
        this.bahasa = data;
        this.storage.get('bahasa_name').subscribe((data) => {
          if (data) {
            this.bahasa_name = data;
            this.getSubtitle();
          }
        });
      } else {
        this.bahasa         = this.serv.bahasa;
        this.bahasa_name    = this.serv.bahasa_name;
        this.storage.set('bahasa', this.bahasa).subscribe(() => {
          this.storage.set('bahasa_name', this.bahasa_name).subscribe(() => {
            this.getSubtitle();
          });
        });
      }
    });
  }

  getSubtitle() {
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      const response = data.json();
      if (this.bahasa === 'id') {
        this.aturbahasa_update            = response.id.aturbahasa_update;
      } else if (this.bahasa === 'en') {
        this.aturbahasa_update            = response.en.aturbahasa_update;
      } else if (this.bahasa === 'ch') {
        this.aturbahasa_update            = response.ch.aturbahasa_update;
      }
    });
  }
  update() {
    this.storage.set('bahasa', this.bahasa).subscribe(() => {
      if (this.bahasa === 'id') {
        this.bahasa_name = 'Bahasa';
      }
      if (this.bahasa === 'en') {
        this.bahasa_name = 'English';
      }
      this.storage.set('bahasa_name', this.bahasa_name).subscribe(() => {
        this.events.publish('language_changed', true, Date.now());
        this.router.navigateByUrl('app/tabs/tab5');
      });
    });
  }
}
