import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyserviceService } from '../myservices.service';
import { Router, NavigationExtras} from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { LoadingController, AlertController, Events } from '@ionic/angular';

@Component({
  selector: 'app-lucky-shop',
  templateUrl: './lucky-shop.page.html',
  styleUrls: ['./lucky-shop.page.scss'],
})
export class LuckyShopPage {
  bahasa; bahasa_name;
  home_button_beli;

  produk = [];
  favorit = [];
  banners = [1, 1, 1, 1, 1, 1];
  loading;
  page = 1;
  pelanggan_id = 0;
  poin = 0;
  data;

  base_url_image;
  luckyshop_tap;
  luckyshop_keranjang;
  luckyshop_kesempatan;
  luckyshop_text;
  luckyshop_lihat;
  luckyshop_message_error;
  luckyshop_selamat;
  luckyshop_nama_voucher;

  count_kesempatan = 0;
  isAnimated = false;
  showPopup = false;

  constructor(
    private http: Http,
    private router: Router,
    private events: Events,
    private storage: StorageMap,
    private serv: MyserviceService,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) {
    this.base_url_image = this.serv.base_url_image;
    this.bahasa       = this.serv.bahasa;
    this.bahasa_name  = this.serv.bahasa_name;

    this.loading = this.loadingController.create({
      message: 'Please Wait',
      duration: 10000
    }).then((res) => {
      this.getData();
      res.onDidDismiss().then((dis) => {
      });
    });

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
      }
      this.getData();
    });
  }

  getSubtitle() {
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      const response = data.json();
      if (this.bahasa === 'id') {
        this.luckyshop_tap        = response.id.luckyshop_tap;
        this.luckyshop_keranjang  = response.id.luckyshop_keranjang;
        this.luckyshop_kesempatan = response.id.luckyshop_kesempatan;
        this.luckyshop_text       = response.id.luckyshop_text;
        this.luckyshop_lihat      = response.id.luckyshop_lihat;
        this.luckyshop_message_error = response.id.luckyshop_message_error;
        this.luckyshop_selamat = response.id.luckyshop_selamat;
        this.luckyshop_nama_voucher = response.id.luckyshop_nama_voucher;
      } else if (this.bahasa === 'en') {
        this.luckyshop_tap        = response.en.luckyshop_tap;
        this.luckyshop_keranjang  = response.en.luckyshop_keranjang;
        this.luckyshop_kesempatan = response.en.luckyshop_kesempatan;
        this.luckyshop_text       = response.en.luckyshop_text;
        this.luckyshop_lihat      = response.en.luckyshop_lihat;
        this.luckyshop_message_error = response.en.luckyshop_message_error;
        this.luckyshop_selamat = response.en.luckyshop_selamat;
        this.luckyshop_nama_voucher = response.en.luckyshop_nama_voucher;
      } else if (this.bahasa === 'ch') {
        this.luckyshop_tap        = response.ch.luckyshop_tap;
        this.luckyshop_keranjang  = response.ch.luckyshop_keranjang;
        this.luckyshop_kesempatan = response.ch.luckyshop_kesempatan;
        this.luckyshop_text       = response.ch.luckyshop_text;
        this.luckyshop_lihat      = response.ch.luckyshop_lihat;
        this.luckyshop_message_error = response.ch.luckyshop_message_error;
        this.luckyshop_selamat = response.ch.luckyshop_selamat;
        this.luckyshop_nama_voucher = response.ch.luckyshop_nama_voucher;
      }
    });
  }
  getData() {

    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('page', this.page.toString());
    body.append('pelanggan_id', this.pelanggan_id.toString());
    body.append('token', this.serv.header_key);

    this.http.post(this.serv.base_url + 'get_profile', body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      const response = data.json();

      if (response.status === 'Failed') {

        } else {
          this.data = response.data;
          this.count_kesempatan = response.data[0].luckydraw;
        }
      }, error => {
        this.loadingController.dismiss();
    });
  }
  animate() {
    if (this.count_kesempatan > 0) {
      this.isAnimated = true;

      this.doLuckyDraw();
    } else {
      alert(this.luckyshop_message_error);
    }
  }
  doLuckyDraw() {
    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('pelanggan_id', this.pelanggan_id.toString());
    body.append('token', this.serv.header_key);

    this.http.post(this.serv.base_url + 'do_luckydraw', body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      const response = data.json();

      if (response.status === 'Failed') {
          alert(this.luckyshop_message_error);
        } else {
          setTimeout( () => {
            this.isAnimated = false;
            this.showPopup = true;
            this.luckyshop_nama_voucher = response.data.nama;
          }, 2000);
        }
      }, error => {
        this.loadingController.dismiss();
    });
  }
  dismissPopup() {
    this.showPopup = false;
    this.getData();
  }
  goToDetailProduk(x) {
    this.router.navigate(['/detail-produk'], { queryParams: { id : x.id } });
  }
  goToListVoucher() {
    // this.router.navigateByUrl("/my-voucher");
    const navigationExtras: NavigationExtras = {
      state: {
        from    : 'lucky-shop',
      }
    };
    this.router.navigateByUrl('/my-voucher', navigationExtras);
  }
  goToLuckyShop() {
    this.router.navigateByUrl('/lucky-shop');
  }
  toRp(val) {
    return this.serv.toRp(val);
  }
  limitText(val, limit) {
    return this.serv.limitText(val, limit);
  }
}
