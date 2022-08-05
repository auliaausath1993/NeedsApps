import { StorageMap } from '@ngx-pwa/local-storage';
import { LoadingController, Events } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyserviceService } from '../myservices.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-tabs4',
  templateUrl: './tabs4.page.html',
  styleUrls: ['./tabs4.page.scss'],
})
export class Tabs4Page {
  bahasa; bahasa_name;
  menu4; keranjang_text_hapus; order_text_diproses; order_text_selesai; order_text_diorder;

  status  = 'ongoing';
  banners = [1, 1, 1, 1, 1, 1];
  list    = [];
  pelanggan_id;

  showSkeleton = true;

  constructor(
    private http: Http,
    private router: Router,
    private events: Events,
    private storage: StorageMap,
    private serv: MyserviceService,
    private loadingController: LoadingController
  ) {
    this.bahasa       = this.serv.bahasa;
    this.bahasa_name  = this.serv.bahasa_name;
  }
  ionViewWillEnter() {
    this.yuk();
  }
  doRefresh(event) {
    this.yuk();

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
  yuk() {
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
    this.storage.get('user').subscribe((val) => {
      const data: any = val;
      this.pelanggan_id = data.id;
      this.getData();
    });
  }
  segmentChanged(val) {
    this.status = val.detail.value;
    this.getData();
  }
  getSubtitle() {
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      const response = data.json();
      if (this.bahasa === 'id') {
        this.menu4                = response.id.menu4;
        this.keranjang_text_hapus = response.id.keranjang_text_hapus;
        this.order_text_diproses  = response.id.order_text_diproses;
        this.order_text_selesai   = response.id.order_text_selesai;
        this.order_text_diorder   = response.id.order_text_diorder;
      } else if (this.bahasa === 'en') {
        this.menu4                = response.en.menu4;
        this.keranjang_text_hapus = response.en.keranjang_text_hapus;
        this.order_text_diproses  = response.en.order_text_diproses;
        this.order_text_selesai   = response.en.order_text_selesai;
        this.order_text_diorder   = response.en.order_text_diorder;
      } else if (this.bahasa === 'ch') {
        this.menu4                = response.ch.menu4;
        this.keranjang_text_hapus = response.ch.keranjang_text_hapus;
        this.order_text_diproses  = response.ch.order_text_diproses;
        this.order_text_selesai   = response.ch.order_text_selesai;
        this.order_text_diorder   = response.ch.order_text_diorder;
      }
    });
  }
  getData() {
    this.list = [];
    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('pelanggan_id', this.pelanggan_id);
    body.append('token', this.serv.header_key);
    body.append('status', this.status);

    this.http.post(this.serv.base_url + 'list_order', body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      const response = data.json();
      if (response.status === 'Failed') {
          alert(response.status);
          this.showSkeleton = false;
        } else {
          this.list         = response.data;
          this.showSkeleton = false;
        }
      }, error => {
        this.loadingController.dismiss();
    });
  }

  goToDetail(x) {
    const navigationExtras: NavigationExtras = {
      state: {
        id : x.id,
      }
    };
    this.router.navigateByUrl('/detail-order', navigationExtras);
  }
  goToHome() {
    this.router.navigateByUrl('/app/tabs/tab1');
  }
  toRp(val) {
    return this.serv.toRp(val);
  }
}
