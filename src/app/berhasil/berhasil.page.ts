import { Component, HostListener } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyserviceService } from '../myservices.service';
import { Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { LoadingController, Events, ToastController, Platform } from '@ionic/angular';
import { InAppBrowser, InAppBrowserOptions, InAppBrowserEvent } from '@ionic-native/in-app-browser/ngx';

declare var snap;

@Component({
  selector: 'app-berhasil',
  templateUrl: './berhasil.page.html',
  styleUrls: ['./berhasil.page.scss'],
})
export class BerhasilPage {
  bahasa;
  bahasa_name;
  home_input_cari;
  home_text_poin;
  home_text_lihat;
  home_text_promo;
  home_text_favorite;
  home_text_minuman;
  subtitle_back;
  subtitle_bayar;
  home_button_beli;

  produk = [];
  favorit = [];
  banners = [1, 1, 1, 1, 1, 1];
  loading;
  page = 1;
  pelanggan_id = 0;

  base_url_image;
  berhasil_title;
  berhasil_no_pesanan;
  berhasil_text_segera;
  berhasil_batas;
  berhasil_total;

  order;
  countdown;
  expired;
  timer;

  pelanggan;

  snap_token;

  constructor(
    private http: Http,
    private router: Router,
    private events: Events,
    private storage: StorageMap,
    private route: ActivatedRoute,
    private serv: MyserviceService,
    private toastCtrl: ToastController,
    private loadingController: LoadingController,
  ) {
    this.base_url_image = this.serv.base_url_image;
    this.bahasa         = this.serv.bahasa;
    this.bahasa_name    = this.serv.bahasa_name;
    this.serv.base      = 'https://needsmarket.id/';



    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.order        = this.router.getCurrentNavigation().extras.state.order;
        this.pelanggan    = this.router.getCurrentNavigation().extras.state.pelanggan;
        this.expired  = this.order.expired;
        this.setupCountdown();
      }
    });
    this.loading = this.loadingController.create({
      message: 'Please Wait',
      duration: 10000
    }).then((res) => {
      this.getSubtitle();
      // res.present();


      res.onDidDismiss().then((dis) => {
      });
    });
    this.storage.get('user').subscribe((val) => {
      const data: any = val;
      this.pelanggan_id = data.id;
    });

  }
  getToken() {
    const headers = new Headers();
    const datapost = JSON.stringify(
      {
        order_id: this.order.id,
        total: this.order.total - this.order.diskon - this.order.poin,
        email: this.pelanggan.email,
        nama: this.order.nama_customer,
        phone: this.order.telp_customer,
        alamat: this.order.alamat_customer,
      }
    );
    const link = this.serv.base + 'midtrans2/examples/snap/api-mobile.php';
    const options = new RequestOptions({ headers});
    this.http.post(link, datapost, options)
    .subscribe((data) => {
      const response = data.json();
      this.snap_token = response.snap_token;
      // this.pay();
      this.serv.payment(response.snap_token, res => {
        this.doCheckout(res);
      });
    }, error => {
    });
  }
  pay() {
    const self = this;
    snap.pay(this.snap_token, {
      gopayMode: 'deeplink',
      onSuccess(result) {
        self.doCheckout(result);
      },
      onPending(result) {
        self.doCheckout(result);
      },
      onError(result) {},
      onClose() {
        alert('You close the popup without finishing the payment !');
      },
    });
  }
  doCheckout(result) {
    // if(result.transaction_status=="settlement" || result.transaction_status=="capture"){
      const headers = new Headers();
      // headers.append("Authorization", this.serv.header_key);
      const requestOptions = new RequestOptions({ headers });
      const body = new FormData();

      body.append('order_id', this.order.id);
      // midtrans param
      if (result.payment_type === 'bank_transfer') {
        result.masked_card = result.va_numbers[0].va_number;
        result.bank        = result.va_numbers[0].bank;
      }
      body.append('transaction_id', result.transaction_id);
      body.append('redirect_url', result.redirect_url);
      body.append('gross_amount', result.gross_amount);
      body.append('payment_type', result.payment_type);
      body.append('transaction_time', result.transaction_time);
      body.append('transaction_status', result.transaction_status);
      body.append('fraud_status', result.fraud_status);
      body.append('masked_card', result.masked_card);
      body.append('bank', result.bank);
      body.append('card_type', result.card_type);


      this.http.post(this.serv.base_url + 'update_midtrans_order', body, requestOptions)
      .subscribe(data => {
        this.loadingController.dismiss();
        const response = data.json();

          // alert(response.status);
        if (response.status === 'Failed') {

          } else {
            this.order            = response.data;
            this.serv.voucher_id  = 0;
            this.backHome();
          }
        }, error => {
          this.loadingController.dismiss();
      });
    // }
  }
  @HostListener('document:ionBackButton', ['$event'])
  overrideHardwareBackAction(event: any) {
    event.detail.register(100, async () => {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
    });
  }
  ionViewDidEnter() {
    document.addEventListener('backbutton', function(e) {
      e.preventDefault();
    }, false);
  }

  getSubtitle() {
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      const response = data.json();
      if (this.bahasa === 'id') {
        this.berhasil_title            = response.id.berhasil_title;
        this.berhasil_no_pesanan       = response.id.berhasil_no_pesanan;
        this.berhasil_text_segera      = response.id.berhasil_text_segera;
        this.berhasil_batas            = response.id.berhasil_batas;
        this.berhasil_total            = response.id.berhasil_total;
        this.subtitle_back             = response.id.subtitle_back;
        this.subtitle_bayar            = response.id.subtitle_bayar;
      } else if (this.bahasa === 'en') {
        this.berhasil_title            = response.en.berhasil_title;
        this.berhasil_no_pesanan       = response.en.berhasil_no_pesanan;
        this.berhasil_text_segera      = response.en.berhasil_text_segera;
        this.berhasil_batas            = response.en.berhasil_batas;
        this.berhasil_total            = response.en.berhasil_total;
        this.subtitle_back             = response.en.subtitle_back;
        this.subtitle_bayar            = response.en.subtitle_bayar;
      } else if (this.bahasa === 'ch') {
        this.berhasil_title            = response.ch.berhasil_title;
        this.berhasil_no_pesanan       = response.ch.berhasil_no_pesanan;
        this.berhasil_text_segera      = response.ch.berhasil_text_segera;
        this.berhasil_batas            = response.ch.berhasil_batas;
        this.berhasil_total            = response.ch.berhasil_total;
        this.subtitle_back             = response.ch.subtitle_back;
        this.subtitle_bayar            = response.ch.subtitle_bayar;
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

    this.http.post(this.serv.base_url + 'get_homedata', body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      const response = data.json();

      if (response.status === 'Failed') {

        } else {
          this.banners  = response.banner;
          this.favorit  = response.favorit;
          this.produk   = response.produk;
          this.expired  = response.data.expired;
          this.events.publish('update_cart_total', response.cart, Date.now());
          this.setupCountdown();
        }
      }, error => {
        this.loadingController.dismiss();
    });
  }
  setupCountdown() {
    const compareDate = new Date();
    compareDate.setDate(this.expired);
    const self = this;
    this.timer = setInterval(function() {
      self.timeBetweenDates(compareDate);
    }, 1000);
  }
  timeBetweenDates(toDate) {
    let stringDate: string = this.expired;
    toDate = new Date(stringDate.replace(/-/g, '/'));

    const dateEntered = toDate;
    const now = new Date();
    const difference = dateEntered.getTime() - now.getTime();

    this.expired = this.expired.split('.')[0];
    stringDate = stringDate.split('.')[0];

    if (difference <= 0) {

      // Timer done
      clearInterval(this.timer);

    } else {

      let seconds = Math.floor(difference / 1000);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      hours %= 24;
      minutes %= 60;
      seconds %= 60;

      this.countdown = hours + ':' + minutes + ':' + seconds;
    }
  }
  async backHome() {
    // Terimakasih order anda sudah kami terima
    const toast = await this.toastCtrl.create({
      message: 'Terimakasih order anda sudah kami terima',
      duration: 2000,
      cssClass: 'my-toast'
    });
    toast.present();

    this.router.navigateByUrl('/app/tabs/tab1');
    setTimeout(() => {
      const navigationExtras: NavigationExtras = {
        state: {
          id : this.order.id,
        }
      };
      this.router.navigateByUrl('/detail-order', navigationExtras);
    }, 1000);
  }
  goToDetailProduk(x) {
    this.router.navigate(['/detail-produk'], { queryParams: { id : x.id } });
  }
  goToSearchPage() {
    this.router.navigateByUrl('/list-produk');
  }
  toRp(val) {
    return this.serv.toRp(val);
  }
  limitText(val, limit) {
    return this.serv.limitText(val, limit);
  }
}
