import { Component, OnInit, ViewChild } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyserviceService } from '../myservices.service';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { LoadingController, AlertController, Events, IonInput, ToastController, IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-list-produk',
  templateUrl: './list-produk.page.html',
  styleUrls: ['./list-produk.page.scss'],
})
export class ListProdukPage {
  bahasa; bahasa_name;
  home_button_beli;
  home_input_cari;

  produk = [];
  produk_all = [];
  favorit = [];
  banners = [1, 1, 1, 1, 1, 1];
  loading;
  page = 1;

  keyword = '';
  kategori;
  id;
  base_url_image;

  pelanggan_id;

  qty1 = [];
  qty1Dibeli = [];

  cabang_id = 1;
  toast;
  isLoading = true;

  @ViewChild('input', null)  inputElement: IonInput;
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;


  constructor(
    private http: Http,
    private router: Router,
    private events: Events,
    private storage: StorageMap,
    private route: ActivatedRoute,
    private serv: MyserviceService,
    private toastCtrl: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) {
    this.bahasa       = this.serv.bahasa;
    this.bahasa_name  = this.serv.bahasa_name;
    this.base_url_image = this.serv.base_url_image;
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
      this.getSubtitle();
      res.present();


      this.storage.get('user').subscribe((val) => {
        if (val) {
          const data: any = val;
          this.pelanggan_id = data.id;
        }
        this.kategori = this.route
          .queryParams
          .subscribe(params => {
            // Defaults to 0 if no query param provided.
            this.id = +params.data || 0;
            this.getData();
        });
      });



      res.onDidDismiss().then((dis) => {
      });
    });
  }
  getThumb(val) {
    return val.replace('upload/', 'upload/');
  }
  ngAfterViewInit() {
      setTimeout(() => {
        // this.inputElement.setFocus();
    }, 1200);
  }
  getSubtitle() {
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      const response = data.json();
      if (this.bahasa === 'id') {
        this.home_input_cari            = response.id.home_input_cari;
        this.home_button_beli           = response.id.home_button_beli;
      } else if (this.bahasa === 'en') {
        this.home_input_cari            = response.en.home_input_cari;
        this.home_button_beli           = response.en.home_button_beli;
      } else if (this.bahasa === 'ch') {
        this.home_input_cari            = response.ch.home_input_cari;
        this.home_button_beli           = response.ch.home_button_beli;
      }
    });
  }
  doSearch(evt) {
    if (evt.detail.value.length >= 4) {
      this.getDataSearch();
    } else {
      this.produk = this.produk_all;
    }
  }
  loadData(evt) {
    this.page += 1;

    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('kategori', this.id);
    body.append('page', this.page.toString());
    body.append('token', this.serv.header_key);
    body.append('pelanggan_id', this.pelanggan_id);
    if (this.keyword !== ' ') {
      body.append('keyword', this.keyword.toString());
    }

    this.http.post(this.serv.base_url + 'get_list_produk', body, requestOptions)
    .subscribe(data => {
      // this.loadingController.dismiss();
      this.isLoading = false;
      const response = data.json();

      this.infiniteScroll.disabled = response.produk.length < 990;

      if (response.status === 'Failed') {
      } else {
        // this.produk  = response.produk;
        for (let x = 0; x < response.produk.length; x++) {
          this.produk.push(response.produk[x]);
        }
        // loop produk
        for (let x = 0; x < this.produk.length; x++) {
          this.qty1[x] = 0;
          this.qty1Dibeli[x] = false;
        }
      }
      if (evt) {
        evt.target.complete();
      }
    }, error => {
        // this.loadingController.dismiss();
        this.isLoading = false;
        if (evt) {
          evt.target.complete();
        }
    });
  }
  getData() {
    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('kategori', this.id);
    body.append('page', this.page.toString());
    body.append('token', this.serv.header_key);
    body.append('pelanggan_id', this.pelanggan_id);
    if (this.keyword !== ' ') {
      body.append('keyword', this.keyword.toString());
    }

    this.http.post(this.serv.base_url + 'get_list_produk', body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      this.isLoading = false;
      const response = data.json();

      if (response.status === 'Failed') {

        } else {
          this.produk  = response.produk;
          this.produk_all  = response.produk;


          // loop produk
          for (let x = 0; x < this.produk.length; x++) {
            this.qty1[x] = 0;
            this.qty1Dibeli[x] = false;
          }
        }
      }, error => {
        this.loadingController.dismiss();
        this.isLoading = false;
    });
  }
  getDataSearch() {
    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('page', this.page.toString());
    body.append('token', this.serv.header_key);
    body.append('kategori', this.id);
    body.append('pelanggan_id', this.pelanggan_id);
    if (this.keyword !== ' ') {
      body.append('keyword', this.keyword.toString());
    }

    this.http.post(this.serv.base_url + 'get_list_produk', body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      this.isLoading = false;
      const response = data.json();

      if (response.status === 'Failed') {

        } else {
          this.produk  = response.produk;
        }
      }, error => {
        this.loadingController.dismiss();
        this.isLoading = false;
    });
  }
  addToWishlist(data) {
    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('id', data.id);
    body.append('pelanggan_id', this.pelanggan_id.toString());
    body.append('token', this.serv.header_key);

    this.http.post(this.serv.base_url + 'add_to_wishlist', body, requestOptions)
    .subscribe(async data => {
      this.loadingController.dismiss();
      this.isLoading = false;
      const response = data.json();

      if (response.status === 'Failed') {
          alert(response.message);
        } else {
          const toast = await this.toastCtrl.create({
            message: 'Wishlist Updated',
            duration: 2000
          });
          // toast.present();
          this.getData();
        }
      }, error => {
        this.loadingController.dismiss();
        this.isLoading = false;
    });
  }

  beliProduk(what, index, data) {
    if (what === 'qty1') {
      this.addToCart(data, this.qty1[index], what, index);
    } else if (what === 'qty2') {
    }
  }
  kurang(what, index, data) {
    if (what === 'qty1') {
      if (this.qty1[index] - 1 <= 0) {
        this.qty1Dibeli[index] = false;
        this.qty1[index] = 0;
        this.doKurang(data);
      } else {
        this.qty1[index] -= 1;
        this.doKurang(data);
      }
    } else if (what === 'qty2') {
    }
  }
  tambah(what, index, data) {
    if (what === 'qty1') {
      // this.qty1[index] += 1;
      this.addToCart(data, 1, what, index);
    } else if (what === 'qty2') {
      // this.qty2[index] += 1;
      this.addToCart(data, 1, what, index);
    }
  }
  doKurang(data) {
    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('data', data.id);
    body.append('pelanggan_id', this.pelanggan_id.toString());
    body.append('token', this.serv.header_key);

    this.http.post(this.serv.base_url + 'kurang_by_produk', body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      this.isLoading = false;
      const response = data.json();

      if (response.status === 'Failed') {
          alert(response.status);
        } else {
          // this.getData();
          this.events.publish('update_cart_total', response.sisa_cart, Date.now());
        }
      }, error => {
        this.loadingController.dismiss();
        this.isLoading = false;
    });
  }
  addToCart(data, qty, what, index) {
    if (this.toast) { this.toast.dismiss(); }
    if (this.pelanggan_id.toString() !== '0') {
      this.goAddToCart(data, qty, what, index);
    } else {
      this.alertController.create({
        header: 'Please Login to continue',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          }, {
            text: 'Ok',
            handler: () => {
              this.router.navigateByUrl('');
            }
          }
        ]
      }).then((res) => {res.present(); res.onDidDismiss().then((dis) => {}); });
    }
  }
  async goAddToCart(data, qty, what, index) {
    // if(data.varian_id==0){
    //   alert("Pilih Varian terlebih dahulu !");
    // }else{
      this.loading = this.loadingController.create({duration: 5000, message: 'Please Wait'}).then((res) => {res.present(); res.onDidDismiss().then((dis) => {}); });

      const headers = new Headers();
      // headers.append("Authorization", data.serv.header_key);
      const requestOptions = new RequestOptions({ headers });
      const body = new FormData();

      let harga_barang = data.harga;
      if (data.harga_diskon !== 0 && data.harga_diskon !== '' && data.harga_diskon !== ' ' && data.harga_diskon != null) {
        harga_barang = data.harga_diskon;
      }

      body.append('produk_id', data.id);
      body.append('pelanggan_id', this.pelanggan_id.toString());
      body.append('cabang_id', this.cabang_id.toString());
      // body.append('varian_id', data.varian_id.toString());
      body.append('varian_id', '0');
      body.append('qty', '1');
      body.append('nama', data.nama);
      body.append('harga', harga_barang);
      body.append('token', this.serv.header_key);

      this.http.post(this.serv.base_url + 'add_to_cart', body, requestOptions)
      .subscribe(async data => {
        const response = data.json();


        if (response.status === 'Failed') {
            this.toast = await this.toastCtrl.create({
              message: response.message,
              duration: 2000,
              cssClass: 'my-toast'
            });
            this.toast.present();
          } else {

            if (what === 'qty1') {
              this.qty1[index] += 1;
              this.qty1Dibeli[index] = true;
            } else if (what === 'qty2') {
            }

            this.events.publish('update_cart', qty.toString(), Date.now());
          }
        this.loadingController.dismiss();
        this.isLoading = false;
        }, error => {
          this.loadingController.dismiss();
          this.isLoading = false;
      });
    // }
  }
  goToHome() {
    this.router.navigateByUrl('/app/tabs/tab1');
  }
  goToDetailProduk(x) {
    this.router.navigate(['/detail-produk'], { queryParams: { id : x.id } });
  }
  goToSearchPage() {

  }
  toRp(val) {
    return this.serv.toRp(val);
  }
  limitText(val, limit) {
    return this.serv.limitText(val, limit);
  }
}
