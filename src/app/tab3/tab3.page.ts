import { StorageMap } from '@ngx-pwa/local-storage';
import { LoadingController, Events, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyserviceService } from '../myservices.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  bahasa; bahasa_name;
  menu3; keranjang_text_hapus;

  banners = [1, 1, 1, 1, 1, 1];
  list_cart = [];

  pelanggan_id;
  base_url_image;

  total = 0;
  showSkeleton = true;

  constructor(
    private http: Http,
    private router: Router,
    private events: Events,
    private storage: StorageMap,
    private serv: MyserviceService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.base_url_image = this.serv.base_url_image;
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
        this.storage.get('bahasa_name').subscribe((res) => {
          if (res) {
            this.bahasa_name = res;
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
  getSubtitle() {
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      const response = data.json();
      if (this.bahasa === 'id') {
        this.menu3                = response.id.menu3;
        this.keranjang_text_hapus = response.id.keranjang_text_hapus;
      } else if (this.bahasa === 'en') {
        this.menu3                = response.en.menu3;
        this.keranjang_text_hapus = response.en.keranjang_text_hapus;
      } else if (this.bahasa === 'ch') {
        this.menu3                = response.ch.menu3;
        this.keranjang_text_hapus = response.ch.keranjang_text_hapus;
      }
    });
  }

  getData() {
    // this.list_cart = [];
    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('pelanggan_id', this.pelanggan_id);
    body.append('token', this.serv.header_key);

    this.http.post(this.serv.base_url + 'get_cart', body, requestOptions)
    .subscribe(data => {
      const response = data.json();
      this.total = 0;
      if (response.status === 'Failed') {
          alert(response.status);
          this.showSkeleton = false;
        } else {
          let count = 0;
          this.list_cart         = response.data;
          for (let x = 0; x < response.data.length; x++) {
            this.total += response.data[x].produk.harga * response.data[x].qty;
            count += response.data[x].qty;
          }
          this.showSkeleton = false;
          this.events.publish('update_cart_total', count, Date.now());
        }
      });
  }
  async tambah(data) {
    const loading = await this.loadingController.create({ message: 'Please Wait' });
    await loading.present();
    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('data', data.id);
    body.append('qty', data.qty);
    body.append('produk_id', data.produk_id);
    body.append('pelanggan_id', this.pelanggan_id);
    body.append('token', this.serv.header_key);

    this.http.post(this.serv.base_url + 'tambah', body, requestOptions)
    .subscribe(res => {
      loading.dismiss();
      const response = res.json();

      if (response.status === 'Failed') {
          alert(response.message);
        } else {
          this.getData();
        }
      }, error => {
        loading.dismiss();
    });
  }
  async kurang(data) {
    if (data.qty <= 1) {
      const alert = await this.alertController.create({
        header: 'Delete ' + data.nama + '  ?',
        message: 'Delete ' + data.nama + '  ?',
        buttons: [
          {
            text: 'Cancel',
            cssClass: 'btn-red',
            role: 'cancel'
          }, {
            text: 'Ok',
            cssClass: 'btn-green',
            handler: () => {
              this.doKurang(data);
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.doKurang(data);
    }
  }
  async doKurang(data) {
    const loading = await this.loadingController.create({ message: 'Please Wait' });
    await loading.present();
    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('data', data.id);
    body.append('pelanggan_id', this.pelanggan_id);
    body.append('token', this.serv.header_key);

    this.http.post(this.serv.base_url + 'kurang', body, requestOptions)
    .subscribe(res => {
      loading.dismiss();
      const response = res.json();

      if (response.status === 'Failed') {
          alert(response.status);
        } else {
          this.getData();
        }
      }, error => {
        loading.dismiss();
    });
  }
  async hapus(data) {
    const alert = await this.alertController.create({
      header: 'Delete ' + data.nama + ' ?',
      message: 'Delete ' + data.nama + '  ?',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'btn-red',
        }, {
          text: 'Ok',
          cssClass: 'btn-green',
          handler: () => {
            this.goHapus(data);
          }
        }
      ]
    });

    await alert.present();
  }
  async goHapus(data) {
    const loading = await this.loadingController.create({ message: 'Please Wait' });
    await loading.present();
    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('data', data.id);
    body.append('pelanggan_id', this.pelanggan_id);
    body.append('token', this.serv.header_key);

    this.http.post(this.serv.base_url + 'hapus_cart', body, requestOptions)
    .subscribe(res => {
      loading.dismiss();
      const response = res.json();

      if (response.status === 'Failed') {
          alert(response.status);
        } else {
          this.getData();
        }
      }, error => {
        loading.dismiss();
    });
  }

  goToHome() {
    this.router.navigateByUrl('/app/tabs/tab1');
  }
  belanjaSekarang() {
    this.router.navigateByUrl('/app/tabs/tab1');
  }
  goCheckout() {
    this.router.navigateByUrl('/konfirmasi-pesanan');
  }
  toRp(val) {
    return this.serv.toRp(val);
  }
  limitText(val, limit) {
    return this.serv.limitText(val, limit);
  }
}
