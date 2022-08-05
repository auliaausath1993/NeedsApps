import { Component } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyserviceService } from '../myservices.service';
import { Router, NavigationExtras} from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { LoadingController, AlertController, Events, ToastController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

const enum Status {
  OFF = 0,
  MOVE = 2
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  bahasa; bahasa_name;
  home_input_cari; home_text_poin; home_text_lihat; home_text_promo; home_text_favorite; home_text_minuman;
  home_button_beli;

  produk = [];
  favorit = [];
  banners = [];
  loading;
  page = 1;
  pelanggan_id = 0;
  poin = 0;

  base_url_image;

  canGoBack = true;
  isLogin = false;
  kategori_x;

  all_cabang;
  cabang_selected = 0;
  cart = 0;
  cabang_id = 0;

  qty1 = [];
  qty1Dibeli = [];

  qty2 = [];
  qty2Dibeli = [];

  toast;
  slideOptions = {
    initialSlide: 1,
    speed: 1000,
    autoplay: true,
    loop: true,
  };

  constructor(
    private http: Http,
    private router: Router,
    private events: Events,
    private storage: StorageMap,
    private serv: MyserviceService,
    private toastCtrl: ToastController,
    private barcodeScanner: BarcodeScanner,
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
      res.onDidDismiss().then((dis) => {
      });
    });


    // this.alertController.create({
    //   header: 'Produk Tidak Ditemukan',
    //   buttons: [{
    //       text: 'Search Product',
    //       cssClass: 'btn-center',
    //       handler: () => {
    //         this.router.navigateByUrl("/search-produk");
    //       }
    //     }
    //   ]
    // }).then((res) => {res.present();res.onDidDismiss().then((dis) => {});});


  }
  doRefresh(event) {
    this.yuk();

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
  getThumb(val) {
    return val.replace('upload/', 'upload/');
  }
  ionViewCanLeave() {
    const canGoBack = this.serv.canGoBack;
    return canGoBack;
  }
  ionViewWillEnter() {
    this.yuk();
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
      if (val) {
        const data: any = val;
        this.pelanggan_id = data.id;
        this.isLogin = true;
      }
      this.getData();
    });
  }
  beliProduk(what, index, data) {
    if (this.pelanggan_id.toString() !== '0') {
      if (what === 'qty1') {
        this.addToCart(data, this.qty1[index], what, index);
      } else if (what === 'qty2') {
        this.addToCart(data, this.qty2[index], what, index);
      }
    } else {
      this.alertController.create({
        header: 'Please Login to continue',
        buttons: [
          {
            text: 'Cancel',
            cssClass: 'btn-red',
            role: 'cancel'
          }, {
            text: 'Ok',
            cssClass: 'btn-green',
            handler: () => {
              this.router.navigateByUrl('');
            }
          }
        ]
      }).then((res) => {res.present(); res.onDidDismiss().then((dis) => {}); });
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
      if (this.qty2[index] - 1 <= 0) {
        this.qty2Dibeli[index] = false;
        this.qty2[index] = 0;
        this.doKurang(data);
      } else {
        this.qty2[index] -= 1;
        this.doKurang(data);
      }
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
      const response = data.json();

      if (response.status === 'Failed') {
          alert(response.status);
        } else {
          // this.getData();
          this.events.publish('update_cart_total', response.sisa_cart, Date.now());
        }
      }, error => {
        this.loadingController.dismiss();
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
            cssClass: 'btn-red',
            role: 'cancel'
          }, {
            text: 'Ok',
            cssClass: 'btn-green',
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
            if (response.show_toast) {
              this.toast = await this.toastCtrl.create({
                message: response.message,
                duration: 2000,
                cssClass: 'my-toast'
              });
              // this.toast.present();
            }
            if (what === 'qty1') {
              this.qty1[index] += 1;
              this.qty1Dibeli[index] = true;
            } else if (what === 'qty2') {
              this.qty2[index] += 1;
              this.qty2Dibeli[index] = true;
            }

            this.events.publish('update_cart', '1', Date.now());
          }
        this.loadingController.dismiss();
        }, error => {
          this.loadingController.dismiss();
      });
    // }
  }
  getSubtitle() {
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      const response = data.json();
      if (this.bahasa === 'id') {
        this.home_input_cari            = response.id.home_input_cari;
        this.home_text_poin             = response.id.home_text_poin;
        this.home_text_lihat            = response.id.home_text_lihat;
        this.home_text_promo            = response.id.home_text_promo;
        this.home_text_favorite         = response.id.home_text_favorite;
        this.home_text_minuman          = response.id.home_text_minuman;
        this.home_button_beli           = response.id.home_button_beli;
      } else if (this.bahasa === 'en') {
        this.home_input_cari            = response.en.home_input_cari;
        this.home_text_poin             = response.en.home_text_poin;
        this.home_text_lihat            = response.en.home_text_lihat;
        this.home_text_promo            = response.en.home_text_promo;
        this.home_text_favorite         = response.en.home_text_favorite;
        this.home_text_minuman          = response.en.home_text_minuman;
        this.home_button_beli           = response.en.home_button_beli;
      } else if (this.bahasa === 'ch') {
        this.home_input_cari            = response.ch.home_input_cari;
        this.home_text_poin             = response.ch.home_text_poin;
        this.home_text_lihat            = response.ch.home_text_lihat;
        this.home_text_promo            = response.ch.home_text_promo;
        this.home_text_favorite         = response.ch.home_text_favorite;
        this.home_text_minuman          = response.ch.home_text_minuman;
        this.home_button_beli           = response.ch.home_button_beli;
      }
    });
  }
  async onChange(val) {
    this.alertController.create({
      header: 'Pindah Cabang ?',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'btn-red',
          role: 'cancel'
        }, {
          text: 'Ok',
          cssClass: 'btn-green',
          handler: () => {
            const splitx = val.detail.value.split('#');
            this.cabang_selected = splitx[1];
            this.cabang_id = splitx[0];


            if (this.pelanggan_id) {
              // update cabang_id di data pelanggan
              const headers = new Headers();
              // headers.append("Authorization", this.serv.header_key);
              const requestOptions = new RequestOptions({ headers });
              const body = new FormData();

              body.append('page', this.page.toString());
              body.append('cabang_id', this.cabang_id.toString());
              body.append('pelanggan_id', this.pelanggan_id.toString());
              body.append('token', this.serv.header_key);

              this.http.post(this.serv.base_url + 'update_cabang_id', body, requestOptions)
              .subscribe(async data => {
                this.loadingController.dismiss();
                const response = data.json();

                if (response.status === 'Failed') {
                    const toast = await this.toastCtrl.create({
                      message: response.message,
                      duration: 2000
                    });
                    toast.present();
                  } else {
                    this.getData();
                  }
                }, error => {
                  this.loadingController.dismiss();
              });
            } else {
              this.getData();
            }
          }
        }
      ]
    }).then((res) => {res.present(); res.onDidDismiss().then((dis) => {}); });
  }
  getData() {

    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('page', this.page.toString());
    body.append('cabang_id', this.cabang_id.toString());
    body.append('pelanggan_id', this.pelanggan_id.toString());
    body.append('token', this.serv.header_key);

    this.http.post(this.serv.base_url + 'get_homedata', body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      const response = data.json();
      if (response.status === 'Failed') {

        } else {
          this.all_cabang   = response.all_cabang;
          this.banners      = response.banner;
          this.favorit      = response.favorit;
          this.produk       = response.produk;
          this.kategori_x   = response.kategori_x;
          this.events.publish('update_cart_total', response.cart, Date.now());
          this.cart         = response.cart;
          if (response.profile) {
            if (response.profile.cabang) {
              this.poin            = response.profile.poin;
              if (!this.poin) {
                this.poin = 0;
              }
              this.cabang_selected = response.profile.cabang.nama;
              this.cabang_id       = response.profile.cabang.id;
            } else {
              for (let x = 0; x < this.all_cabang.length; x++) {
                if (this.all_cabang[x].cabang_default === 'yes') {
                  this.cabang_selected = this.all_cabang[x].nama;
                  // this.cabang_id = this.all_cabang[x].id;
                }
              }
            }
          } else {
            for (let x = 0; x < this.all_cabang.length; x++) {
              if (this.all_cabang[x].cabang_default === 'yes') {
                this.cabang_selected = this.all_cabang[x].nama;
                this.cabang_id = this.all_cabang[x].id;
              }
            }
          }
          this.storage.set('cabang_selected', this.cabang_selected).subscribe(() => {
            this.storage.set('cabang_id', this.cabang_id).subscribe(() => {
            });
          });


          // loop produk favorit
          for (let x = 0; x < this.favorit.length; x++) {
            this.qty1[x] = 0;
            this.qty1Dibeli[x] = false;
          }

          // loop produk per kategori
          let num = 0;
          for (let x = 0; x < this.kategori_x.length; x++) {
            for (let i = 0; i < this.kategori_x[x].list_produk.length; i++) {
              this.qty2[this.kategori_x[x].list_produk[i].num] = 0;
              this.qty2Dibeli[this.kategori_x[x].list_produk[i].num] = false;

              num++;
            }
          }


          // get produk per kategori
          this.getProdukPerKategori();

        }
      }, error => {
        this.loadingController.dismiss();
    });
  }
  getProdukPerKategori() {
    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('page', this.page.toString());
    body.append('cabang_id', this.cabang_id.toString());
    body.append('pelanggan_id', this.pelanggan_id.toString());
    body.append('token', this.serv.header_key);

    this.http.post(this.serv.base_url + 'get_homedata_produk_per_kategori', body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      const response = data.json();
      if (response.status === 'Failed') {

        } else {

          this.kategori_x   = response.data;

          // loop produk per kategori
          let num = 0;
          for (let x = 0; x < this.kategori_x.length; x++) {
            for (let i = 0; i < this.kategori_x[x].list_produk.length; i++) {
              this.qty2[this.kategori_x[x].list_produk[i].num] = 0;
              this.qty2Dibeli[this.kategori_x[x].list_produk[i].num] = false;

              num++;
            }
          }

        }
      }, error => {
        this.loadingController.dismiss();
    });
  }
  addToWishlist(data) {
    if (this.pelanggan_id) {
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
      });
    } else {
      this.alertController.create({
        header: 'Please Login to continue',
        buttons: [
          {
            text: 'Cancel',
            cssClass: 'btn-red',
            role: 'cancel'
          }, {
            text: 'Ok',
            cssClass: 'btn-green',
            handler: () => {
              this.router.navigateByUrl('');
            }
          }
        ]
      }).then((res) => {res.present(); res.onDidDismiss().then((dis) => {}); });
    }
  }
  scanBarcode() {
    this.barcodeScanner.scan().then(barcodeData => {
      if (barcodeData.cancelled) {
        this.serv.canGoBack = false;
      }
      setTimeout( () => {
        this.serv.canGoBack = true;
      }, 1500);
      const headers = new Headers();
      // headers.append("Authorization", this.serv.header_key);
      const requestOptions = new RequestOptions({ headers });
      const body = new FormData();

      body.append('sku', barcodeData.text.toString());
      body.append('pelanggan_id', this.pelanggan_id.toString());
      body.append('token', this.serv.header_key);

      this.http.post(this.serv.base_url + 'search_sku', body, requestOptions)
      .subscribe(data => {
        this.loadingController.dismiss();
        const response = data.json();

        if (response.status === 'Failed') {
            // this.router.navigateByUrl("/search-produk");
            this.alertController.create({
              header: 'Produk Tidak Ditemukan',
              buttons: [{
                  text: 'Search Product',
                  cssClass: 'btn-center',
                  handler: () => {
                    this.router.navigateByUrl('/search-produk');
                  }
                }
              ]
            }).then((res) => {res.present(); res.onDidDismiss().then((dis) => {}); });
          } else {
            if (response.produk[0]) {
              this.router.navigate(['/detail-produk'], { queryParams: { id : response.produk[0].id } });
            } else {
              // this.router.navigateByUrl("/search-produk");
              this.alertController.create({
                header: 'Produk Tidak Ditemukan',
                buttons: [{
                    text: 'Search Product',
                    cssClass: 'btn-center',
                    handler: () => {
                      this.router.navigateByUrl('/search-produk');
                    }
                  }
                ]
              }).then((res) => {res.present(); res.onDidDismiss().then((dis) => {}); });
            }
          }
        }, error => {
          this.loadingController.dismiss();
      });
     }).catch(err => {
     });
  }
  goToHome() {
    this.router.navigateByUrl('/app/tabs/tab1');
  }
  goToDetailProduk(x) {
    this.router.navigate(['/detail-produk'], { queryParams: { id : x.id } });
    // this.storage.get('user').subscribe((data) => {
    //   if(data){
    //     this.router.navigate(['/detail-produk'], { queryParams: { id : x.id } });
    //   }else{
    //     this.alertController.create({
    //       header: 'Please Login to continue',
    //       buttons: [
    //         {
    //           text: 'Cancel',
    //           role: 'cancel'
    //         }, {
    //           text: 'Ok',
    //           handler: () => {
    //             this.router.navigateByUrl("");
    //           }
    //         }
    //       ]
    //     }).then((res) => {res.present();res.onDidDismiss().then((dis) => {});});
    //   }
    // });
  }
  goToSearchPage() {
    this.router.navigateByUrl('/search-produk');
    // this.storage.get('user').subscribe((data) => {
    //   if(data){
    //     this.router.navigateByUrl("/list-produk");
    //   }else{
    //     this.alertController.create({
    //       header: 'Please Login to continue',
    //       buttons: [
    //         {
    //           text: 'Cancel',
    //           role: 'cancel'
    //         }, {
    //           text: 'Ok',
    //           handler: () => {
    //             this.router.navigateByUrl("");
    //           }
    //         }
    //       ]
    //     }).then((res) => {res.present();res.onDidDismiss().then((dis) => {});});
    //   }
    // });
  }
  goToNotification() {
    this.storage.get('user').subscribe((data) => {
      if (data) {
        this.router.navigateByUrl('/notification');
      } else {
        this.alertController.create({
          header: 'Please Login to continue',
          buttons: [
            {
              text: 'Cancel',
              cssClass: 'btn-red',
              role: 'cancel'
            }, {
              text: 'Ok',
              cssClass: 'btn-green',
              handler: () => {
                this.router.navigateByUrl('');
              }
            }
          ]
        }).then((res) => {res.present(); res.onDidDismiss().then((dis) => {}); });
      }
    });
  }
  goToLuckyShop() {
    this.storage.get('user').subscribe((data) => {
      if (data) {
        this.router.navigateByUrl('/lucky-shop');
      } else {
        this.alertController.create({
          header: 'Please Login to continue',
          buttons: [
            {
              text: 'Cancel',
              cssClass: 'btn-red',
              role: 'cancel'
            }, {
              text: 'Ok',
              cssClass: 'btn-green',
              handler: () => {
                this.router.navigateByUrl('');
              }
            }
          ]
        }).then((res) => {res.present(); res.onDidDismiss().then((dis) => {}); });
      }
    });
  }
  goToListPromo() {
    this.storage.get('user').subscribe((data) => {
      if (data) {
        this.router.navigateByUrl('/list-promo');
      } else {
        this.alertController.create({
          header: 'Please Login to continue',
          buttons: [
            {
              text: 'Cancel',
              cssClass: 'btn-red',
              role: 'cancel'
            }, {
              text: 'Ok',
              cssClass: 'btn-green',
              handler: () => {
                this.router.navigateByUrl('');
              }
            }
          ]
        }).then((res) => {res.present(); res.onDidDismiss().then((dis) => {}); });
      }
    });
  }
  goToWishlist() {
    this.storage.get('user').subscribe((data) => {
      if (data) {
        this.router.navigateByUrl('/wishlist');
      } else {
        this.alertController.create({
          header: 'Please Login to continue',
          buttons: [
            {
              text: 'Cancel',
              cssClass: 'btn-red',
              role: 'cancel'
            }, {
              text: 'Ok',
              cssClass: 'btn-green',
              handler: () => {
                this.router.navigateByUrl('');
              }
            }
          ]
        }).then((res) => {res.present(); res.onDidDismiss().then((dis) => {}); });
      }
    });
  }
  goToNews(data) {
    const navigationExtras: NavigationExtras = {
      state: {
        id : data.news_id,
      }
    };
    this.router.navigateByUrl('/news-detail', navigationExtras);
  }
  viewAll(id) {
    this.router.navigate(['/list-produk'], { queryParams: { data : id } });
  }
  toRp(val) {
    return this.serv.toRp(val);
  }
  limitText(val, limit) {
    return this.serv.limitText(val, limit);
  }
}
