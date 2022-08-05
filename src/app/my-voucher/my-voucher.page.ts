import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyserviceService } from '../myservices.service';
import { Router, NavigationExtras, ActivatedRoute} from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { LoadingController, AlertController, Events, ToastController } from '@ionic/angular';

import { Location } from '@angular/common';

@Component({
  selector: 'app-my-voucher',
  templateUrl: './my-voucher.page.html',
  styleUrls: ['./my-voucher.page.scss'],
})
export class MyVoucherPage {
  base_url_image;
  bahasa; bahasa_name;
  loading; pelanggan_id;
  data = [];
  data_all = [];
  keyword;

  from;
  kode;

  constructor(
    private http: Http,
    private router: Router,
    private events: Events,
    private location: Location,
    private storage: StorageMap,
    private route: ActivatedRoute,
    private serv: MyserviceService,
    private toastCtrl: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) {
    this.base_url_image = this.serv.base_url_image;
    this.bahasa       = this.serv.bahasa;
    this.bahasa_name  = this.serv.bahasa_name;
    this.yuk();

  }
  doRefresh(event) {
    this.yuk();

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
  yuk() {
    this.loading = this.loadingController.create({
      message: 'Please Wait',
      duration: 10000
    }).then((res) => {
      this.getData();
      res.onDidDismiss().then((dis) => {
      });
    });


    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.from   = this.router.getCurrentNavigation().extras.state.from;
      }
    });
    }
  goBack() {
    if (this.from === 'konfirmasi') {
      const navigationExtras: NavigationExtras = {
        state: {
          kode    : this.kode,
        }
      };
      this.router.navigateByUrl('/konfirmasi-pesanan', navigationExtras);
    } else {
      this.location.back();
    }
  }
  ionViewWillEnter() {

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
      if (val) {
        const data: any = val;
        this.pelanggan_id = data.id;
        this.getData();
      }
    });
  }

  getSubtitle() {
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      const response = data.json();
      if (this.bahasa === 'id') {

      } else if (this.bahasa === 'en') {

      } else if (this.bahasa === 'ch') {

      }
    });
  }
  getData() {

    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('pelanggan_id', this.pelanggan_id.toString());
    body.append('token', this.serv.header_key);

    this.http.post(this.serv.base_url + 'my_voucher', body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      const response = data.json();

      if (response.status === 'Failed') {

        } else {
          this.data     = response.data;
          this.data_all = response.data;
        }
      }, error => {
        this.loadingController.dismiss();
    });
  }
  goToDetailProduk(x) {
    this.router.navigate(['/detail-produk'], { queryParams: { id : x.id } });
  }
  goToListVoucher() {
    this.router.navigateByUrl('/my-voucher');
  }
  goToLuckyShop() {
    this.router.navigateByUrl('/lucky-shop');
  }
  async gunakan(data) {
    this.kode = data;
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = data.kode;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    if (this.from === 'konfirmasi') {
      const navigationExtras: NavigationExtras = {
        state: {
          kode: this.kode.kode,
        }
      };
      this.router.navigateByUrl('/konfirmasi-pesanan', navigationExtras);
    } else {
      // alert("copied");
      const toast = await this.toastCtrl.create({
        message: 'copied',
        duration: 2000
      });
      toast.present();
    }
  }
  doSearch(evt) {
    if (evt.detail.value.length >= 4) {
      this.getDataSearch();
    } else {
      this.data = this.data_all;
    }
  }
  getDataSearch() {

  }
  toRp(val) {
    return this.serv.toRp(val);
  }
  limitText(val, limit) {
    return this.serv.limitText(val, limit);
  }
}
