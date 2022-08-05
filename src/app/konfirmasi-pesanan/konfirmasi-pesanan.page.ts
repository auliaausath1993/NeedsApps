import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyserviceService } from '../myservices.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { LoadingController, ToastController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-konfirmasi-pesanan',
  templateUrl: './konfirmasi-pesanan.page.html',
  styleUrls: ['./konfirmasi-pesanan.page.scss'],
})
export class KonfirmasiPesananPage {
  bahasa; bahasa_name;

  konfirmasi_title;
  konfirmasi_total;
  konfirmasi_gunakan;
  konfirmasi_pakai;
  konfirmasi_tulis;
  konfirmasi_selanjutnya;
  luckyshop_lihat;

  status  = 'ongoing';
  banners = [1, 1, 1, 1, 1, 1];
  list_cart = [];
  list_cart_old = [];

  pelanggan_id;
  base_url_image;

  total = 0;
  kode_voucher;
  diskon = 0;
  diskon_product = 0;
  poin = 0;

  voucherUsed = false;
  tipe = '-';

  response_voucher;
  checked;
  loading = true;

  constructor(
    private http: Http,
    private router: Router,
    private location: Location,
    private storage: StorageMap,
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
    private serv: MyserviceService,
    private loadingController: LoadingController
  ) {
    this.base_url_image = this.serv.base_url_image;
    this.bahasa       = this.serv.bahasa;
    this.bahasa_name  = this.serv.bahasa_name;

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.kode_voucher   = this.router.getCurrentNavigation().extras.state.kode;
        setTimeout( () => {
          this.useVoucher();
        }, 1200);
      }
    });

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
  ionViewWillEnter() {
  }

  myChange(val) {
    this.checked = val.detail.checked;
    if (this.checked) {
      this.total = this.total - this.poin;
    } else {
      this.total = this.total + this.poin;
    }
  }
  getSubtitle() {
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      const response = data.json();
      if (this.bahasa === 'id') {
        this.konfirmasi_title       = response.id.konfirmasi_title;
        this.konfirmasi_total       = response.id.konfirmasi_total;
        this.konfirmasi_gunakan     = response.id.konfirmasi_gunakan;
        this.konfirmasi_pakai       = response.id.konfirmasi_pakai;
        this.konfirmasi_tulis       = response.id.konfirmasi_tulis;
        this.konfirmasi_selanjutnya = response.id.konfirmasi_selanjutnya;
        this.luckyshop_lihat        = response.id.luckyshop_lihat;
      } else if (this.bahasa === 'en') {
        this.konfirmasi_title       = response.en.konfirmasi_title;
        this.konfirmasi_total       = response.en.konfirmasi_total;
        this.konfirmasi_gunakan     = response.en.konfirmasi_gunakan;
        this.konfirmasi_pakai       = response.en.konfirmasi_gunakan;
        this.konfirmasi_tulis       = response.en.konfirmasi_tulis;
        this.konfirmasi_selanjutnya = response.en.konfirmasi_selanjutnya;
        this.luckyshop_lihat        = response.en.luckyshop_lihat;
      } else if (this.bahasa === 'ch') {
        this.konfirmasi_title       = response.ch.konfirmasi_title;
        this.konfirmasi_total       = response.ch.konfirmasi_total;
        this.konfirmasi_gunakan     = response.ch.konfirmasi_gunakan;
        this.konfirmasi_pakai       = response.ch.konfirmasi_pakai;
        this.konfirmasi_tulis       = response.ch.konfirmasi_tulis;
        this.konfirmasi_selanjutnya = response.ch.konfirmasi_selanjutnya;
        this.luckyshop_lihat        = response.ch.luckyshop_lihat;
      }
    });
  }

  getData() {
    this.list_cart = [];
    this.list_cart_old = [];
    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('pelanggan_id', this.pelanggan_id.toString());
    body.append('token', this.serv.header_key);

    this.http.post(this.serv.base_url + 'get_cart', body, requestOptions)
    .subscribe(data => {
      this.loading = false;
      this.loadingController.dismiss();
      const response = data.json();

      if (response.status === 'Failed') {
          alert(response.status);
        } else {
          this.list_cart         = response.data;
          this.list_cart_old     = response.data;
          this.total    = 0;
          for (let x = 0; x < response.data.length; x++) {
            this.total += response.data[x].qty * response.data[x].produk.harga;
          }
          this.poin = response.profile.poin;
        }
      }, error => {
        this.loadingController.dismiss();
    });
  }

  useVoucher() {
    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('pelanggan_id', this.pelanggan_id);
    body.append('token', this.serv.header_key);
    body.append('kode_voucher', this.kode_voucher);

    this.http.post(this.serv.base_url + 'use_voucher', body, requestOptions)
    .subscribe(async data => {
      this.loadingController.dismiss();
      const response = data.json();
      this.response_voucher = response;

      if (response.status === 'Failed') {
          // alert(response.message);

          const toast = await this.toastCtrl.create({
            message: response.message,
            duration: 2000
          });
          toast.present();
        } else {
          this.tipe = response.tipe;
          if (response.tipe === 'invoice') {
            // if(response.data.tipe=="discount"){
            // }
            this.diskon = (response.data.value / 100) * this.total;
            this.total = this.total - this.diskon;
            this.voucherUsed = true;
            this.serv.voucher_id = response.data.id;
          } else {
            const new_cart = this.list_cart;
            let potongan = 0;
            if (response.data.type === 'percent') {
              potongan = (response.data.value / 100) * this.total;
            } else {
              potongan = (response.data.value);
            }
            const diskon = response.data.value / 100;
            let new_total = 0;
            for (let x = 0; x < new_cart.length; x++) {
              if (new_cart[x].produk_id === response.data.produk_id) {
                new_cart[x].harga = new_cart[x].harga - potongan;
                this.diskon = potongan;
                this.diskon_product += potongan * new_cart[x].qty;
              }
            }
            for (let x = 0; x < new_cart.length; x++) {
              new_cart[x].subtotal = 0;
              new_cart[x].subtotal += new_cart[x].harga * new_cart[x].qty;
              new_total += new_cart[x].subtotal;
            }
            this.list_cart = new_cart;
            this.total = new_total;
            this.voucherUsed = true;
          }
        }
      }, error => {
        this.loadingController.dismiss();
    });
  }
  cancelVoucher() {
    if (this.tipe === 'invoice') {
      this.total  = this.total + this.diskon;
      this.diskon = 0;
    } else {
      const new_cart = this.list_cart;
      let potongan = 0;
      if (this.response_voucher.data.type === 'percent') {
        potongan = (this.response_voucher.data.value / 100) * this.total;
      } else {
        potongan = (this.response_voucher.data.value);
      }
      const diskon = this.response_voucher.data.value / 100;
      let new_total = 0;
      for (let x = 0; x < new_cart.length; x++) {
        if (new_cart[x].produk_id === this.response_voucher.data.produk_id) {
          new_cart[x].harga = parseInt(new_cart[x].harga) + parseInt(potongan.toString());
          this.diskon = 0;
        }
      }
      for (let x = 0; x < new_cart.length; x++) {
        new_cart[x].subtotal = 0;
        new_cart[x].subtotal += parseInt(new_cart[x].harga) * parseInt(new_cart[x].qty);
        new_total += parseInt(new_cart[x].subtotal);
      }
      this.list_cart = new_cart;
      this.total = new_total;
      this.voucherUsed = true;
      this.diskon_product = 0;
    }
    this.voucherUsed = false;
  }
  goToDetail(x) {
    this.router.navigateByUrl('/detail-order');
  }
  goToHome() {
    this.router.navigateByUrl('/app/tabs/tab1');
  }
  goToListVoucher() {
    const navigationExtras: NavigationExtras = {
      state: {
        from    : 'konfirmasi',
      }
    };
    this.router.navigateByUrl('/my-voucher', navigationExtras);
  }
  goToPengiriman() {
    const navigationExtras: NavigationExtras = {
      state: {
        cart    : this.list_cart,
        diskon  : this.diskon,
        diskon_product  : this.diskon_product,
        tipe    : this.tipe,
        poin    : this.poin,
        checked: this.checked
      }
    };
    this.router.navigate(['/detail-pengiriman'], navigationExtras);
  }
  toRp(val) {
    return this.serv.toRp(val);
  }
}
