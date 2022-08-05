import { PilihAlamatPage } from './../pilih-alamat/pilih-alamat.page';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyserviceService } from '../myservices.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

import { StorageMap } from '@ngx-pwa/local-storage';
import { LoadingController, AlertController, ToastController, ModalController } from '@ionic/angular';

import { Plugins } from '@capacitor/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

declare var google;

@Component({
  selector: 'app-detail-pengiriman',
  templateUrl: './detail-pengiriman.page.html',
  styleUrls: ['./detail-pengiriman.page.scss'],
})
export class DetailPengirimanPage {

  @ViewChild('map', null) mapElement: ElementRef;
  map: any;
  address: string;

  bahasa; bahasa_name;

  pengiriman_title;
  pengiriman_alamat;
  pengiriman_saya;
  pengiriman_total_item;
  pengiriman_total_belanja;
  pengiriman_biaya_kirim;
  pengiriman_grand_total;
  pengiriman_selanjutnya;

  status  = 'ongoing';
  banners = [1, 1, 1, 1, 1, 1];
  data;
  pelanggan_id;
  alamat_saya; alamat;
  pengantaran;

  cart;
  total_item = 0;
  ongkir = 0;
  total = 0;

  toggle;
  form_alamat;

  lat; lng;

  ongkir_per_km = 0;
  jarak_km      = 0;

  diskon        = 0;
  diskon_product = 0;

  waktu_pengantaran_all = [];
  waktu_pengantaran = [];
  waktu;

  now;
  array_option = [];

  date;
  text_hari = 'Hari';
  hari;
  list_hari = [];
  list_alamat = [];

  cabang_id: any = '0';

  save_alamat = false;
  showChecked = true;

  array_date = [];
  tipe;

  poin = 0;
  poin_full;
  loading;
  checked;

  limit;

  constructor(
    private http: Http,
    private router: Router,
    private storage: StorageMap,
    private route: ActivatedRoute,
    private serv: MyserviceService,
    private geolocation: Geolocation,
    private toastCtrl: ToastController,
    private nativeGeocoder: NativeGeocoder,
    private alertController: AlertController,
    private modalController: ModalController,
    private loadingController: LoadingController
  ) {
    this.bahasa       = this.serv.bahasa;
    this.bahasa_name  = this.serv.bahasa_name;

    let min = new Date().getMinutes().toString();
    if (parseInt(min) < 10) {
      min = '0' + min;
    }
    let jam = new Date().getHours().toString();
    if (parseInt(jam) < 10) {
      jam = '0' + jam;
    }
    let sec = new Date().getSeconds().toString();
    if (parseInt(sec) < 10) {
      sec = '0' + sec;
    }
    // this.now          = jam+":"+min+":"+sec;

    let month           = (new Date().getMonth() + 1).toString();
    if (parseInt(month) < 10) {
      month             = '0' + month;
    }
    let date           = (new Date().getDate()).toString();
    if (parseInt(date) < 10) {
      date             = '0' + date;
    }
    this.date           = new Date().getFullYear() + '-' + month + '-' + date;
    this.now            = new Date(this.date + ' ' + jam + ':' + min + ':' + sec).getTime();
    // this.date           = new Date(date).getTime();


    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.cart   = this.router.getCurrentNavigation().extras.state.cart;
        this.tipe   = this.router.getCurrentNavigation().extras.state.tipe;
        this.checked = this.router.getCurrentNavigation().extras.state.checked;
        if (this.tipe === 'invoice') {
          this.diskon = this.router.getCurrentNavigation().extras.state.diskon;
        }
        this.diskon_product = this.router.getCurrentNavigation().extras.state.diskon_product;
        // if(this.checked){
        this.poin_full = this.router.getCurrentNavigation().extras.state.poin;
          // this.poin = this.router.getCurrentNavigation().extras.state.poin;
        // }

        // this.total_item = this.cart.length;

        for (let x = 0; x < this.cart.length; x++) {
          this.total_item += parseInt(this.cart[x].qty);
          this.total += this.cart[x].produk.harga * this.cart[x].qty;
          // this.total += this.cart[x].qty*this.cart[x].harga;
          // if(this.diskon){
          //   this.total += this.total-this.diskon;
          // }
        }
      }
    });



  }
  changedHari(evt) {
    const d = new Date();
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

    const dt   = evt.detail.value.split(',');
    let date = dt[1];
    date = date.replace(' ', '');

    const x = ye + '-' + mo + '-' + da;


    const n = d.getHours() + (this.limit / 60);
    // n = n + (this.limit*60*60*1000);

    const new_ar = [];
    if (x === date) {
      this.waktu_pengantaran = this.waktu_pengantaran_all;
      for (let x = 0; x < this.waktu_pengantaran.length; x++) {
        let split;
        if (this.waktu_pengantaran[x].dari_jam) {
        split = this.waktu_pengantaran[x].dari_jam.split(':')[0];
        }
        // if(split<n){
        if (n > split) {
          // this.waktu_pengantaran.splice(x);
        } else {
          new_ar.push(this.waktu_pengantaran[x]);
        }
      }
      this.waktu_pengantaran = new_ar;
    } else {
      this.waktu_pengantaran = this.waktu_pengantaran_all;
    }

  }
  setupTgl() {
    const d = new Date();
    let we = new Intl.DateTimeFormat('en', { weekday: 'long' }).format(d);
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

    const d2 = new Date(new Date().getTime() + (1 * 24 * 60 * 60 * 1000));
    let we2 = new Intl.DateTimeFormat('en', { weekday: 'long' }).format(d2);
    const ye2 = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d2);
    const mo2 = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d2);
    const da2 = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d2);

    const d3 = new Date(new Date().getTime() + (2 * 24 * 60 * 60 * 1000));
    let we3 = new Intl.DateTimeFormat('en', { weekday: 'long' }).format(d3);
    const ye3 = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d3);
    const mo3 = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d3);
    const da3 = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d3);

    if (this.data.bahasa === 'id') {
      we = this.translateHari(we);
      we2 = this.translateHari(we2);
      we3 = this.translateHari(we3);
    }

    this.array_date[0] = we + ', ' + ye + '-' + mo + '-' + da;
    this.array_date[1] = we2 + ', ' + ye2 + '-' + mo2 + '-' + da2;
    this.array_date[2] = we3 + ', ' + ye3 + '-' + mo3 + '-' + da3;
  }
  translateHari(day) {
    if (day === 'Monday') {return 'Senin'; } else if (day === 'Tuesday') {return 'Selasa'; } else if (day === 'Wednesday') {return 'Rabu'; } else if (day === 'Thursday') {return 'Kamis'; } else if (day === 'Friday') {return 'Jumat'; } else if (day === 'Saturday') {return 'Sabtu'; } else if (day === 'Sunday') {return 'Minggu'; }
  }
  ionViewWillEnter() {
    this.showChecked = true;
    // this.storage.get('cabang_id').subscribe((data) => {if(data){this.cabang_id=parseInt(data.toString())}});
    this.storage.get('cabang_id').subscribe((data) => {
      this.cabang_id = data;
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

      // load map
      // this.geolocation.getCurrentPosition().then((resp) => {
      //   this.lat = resp.coords.latitude;
      //   this.lng = resp.coords.longitude;
      //   this.getData();
      //   let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      //   let mapOptions = {
      //     center: latLng,
      //     zoom: 15,
      //     mapTypeId: google.maps.MapTypeId.ROADMAP
      //   }
      //   this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      //   //marker
      //   const pos = {
      //     lat: resp.coords.latitude,
      //     lng: resp.coords.longitude
      //   };
      //   const marker = new google.maps.Marker({
      //     position: pos, //marker position
      //     map: this.map, //map already created
      //     title: 'You',
      //     draggable: true
      //   });
      //   const infowindow = new google.maps.InfoWindow({
      //     content: 'You',
      //     maxWidth: 400
      //   });
      //   marker.addListener('click', function() {
      //     infowindow.open(this.map, marker);
      //   });

      //   //event drag
      //   google.maps.event.addListener(marker, 'dragend', (res) => {
      //     this.lat = marker.getPosition().lat();
      //     this.lng = marker.getPosition().lng();
      //     this.getData();
      //   });

      // }).catch((error) => {
      // });
    });
  }


  getSubtitle() {
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      const response = data.json();
      if (this.bahasa === 'id') {
        this.pengiriman_title         = response.id.pengiriman_title;
        this.pengiriman_alamat        = response.id.pengiriman_alamat;
        this.pengiriman_saya          = response.id.pengiriman_saya;
        this.pengiriman_total_item    = response.id.pengiriman_total_item;
        this.pengiriman_total_belanja = response.id.pengiriman_total_belanja;
        this.pengiriman_biaya_kirim   = response.id.pengiriman_biaya_kirim;
        this.pengiriman_grand_total   = response.id.pengiriman_grand_total;
        this.pengiriman_selanjutnya   = response.id.pengiriman_selanjutnya;
        this.pengantaran              = response.id.pengiriman_pengantaran;
        this.text_hari                = response.id.text_hari;
        this.list_hari                = response.id.list_hari;
      } else if (this.bahasa === 'en') {
        this.pengiriman_title         = response.en.pengiriman_title;
        this.pengiriman_alamat        = response.en.pengiriman_alamat;
        this.pengiriman_saya          = response.en.pengiriman_saya;
        this.pengiriman_total_item    = response.en.pengiriman_total_item;
        this.pengiriman_total_belanja = response.en.pengiriman_total_belanja;
        this.pengiriman_biaya_kirim   = response.en.pengiriman_biaya_kirim;
        this.pengiriman_grand_total   = response.en.pengiriman_grand_total;
        this.pengiriman_selanjutnya   = response.en.pengiriman_selanjutnya;
        this.pengantaran              = response.en.pengiriman_pengantaran;
        this.text_hari                = response.en.text_hari;
        this.list_hari                = response.en.list_hari;
      } else if (this.bahasa === 'ch') {
        this.pengiriman_title         = response.ch.pengiriman_title;
        this.pengiriman_alamat        = response.ch.pengiriman_alamat;
        this.pengiriman_saya          = response.ch.pengiriman_saya;
        this.pengiriman_total_item    = response.ch.pengiriman_total_item;
        this.pengiriman_total_belanja = response.ch.pengiriman_total_belanja;
        this.pengiriman_biaya_kirim   = response.ch.pengiriman_biaya_kirim;
        this.pengiriman_grand_total   = response.ch.pengiriman_grand_total;
        this.pengiriman_selanjutnya   = response.ch.pengiriman_selanjutnya;
        this.pengantaran              = response.ch.pengiriman_pengantaran;
        this.text_hari                = response.ch.text_hari;
        this.list_hari                = response.ch.list_hari;
      }
    });
  }

  getData() {
    this.loading = this.loadingController.create({
      message: 'Please Wait'
    }).then((res) => {
      // res.present();

      res.onDidDismiss().then((dis) => {
      });
    });

    this.data = [];
    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('cabang_id', this.cabang_id.toString());
    body.append('pelanggan_id', this.pelanggan_id);
    body.append('token', this.serv.header_key);
    body.append('lat', this.lat);
    body.append('long', this.lng);

    this.http.post(this.serv.base_url + 'get_cart_konfirmasi', body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      const response = data.json();

      if (response.status === 'Failed') {
          alert(response.status);
        } else {
          this.data         = response.profile[0];
          this.alamat_saya  = response.profile[0].alamat;
          // this.alamat       = response.data[0].alamat;

          this.ongkir_per_km = response.setting[0].ongkir_per_km;
          // this.jarak_km      = response.cabang[0].distance;
          // this.ongkir        = this.ongkir_per_km*this.jarak_km;

          this.waktu_pengantaran_all = response.waktu_pengantaran;
          // this.waktu_pengantaran     = response.waktu_pengantaran;
          const waktu_pengantaran = response.waktu_pengantaran;
          for (let x = 0; x < waktu_pengantaran.length; x++) {
            const val_jam = new Date(this.date + ' ' + waktu_pengantaran[x].dari_jam + ':00').getTime();

            if (val_jam < this.now) {
              this.array_option[x] = false;
            } else {
              this.array_option[x] = true;
              // this.waktu_pengantaran.push(waktu_pengantaran[x]);
            }
          }

          this.list_alamat = response.alamat;

          this.list_alamat.push(this.alamat_saya);

          this.ongkir = response.cabang[0].ongkir;
          this.limit  = response.limit.limit_pengiriman;

          this.form_alamat = response.profile[0].alamat;

          this.setupTgl();
        }
      }, error => {
        this.loadingController.dismiss();
    });
  }

  myChange2(val) {
    this.checked = val.detail.checked;
    if (this.checked) {
      // this.total = this.total-this.poin;
      this.poin = this.poin_full;
    } else {
      // this.total = this.total+this.poin;
      this.poin = 0;
    }
  }
  myChange(evt) {
    if (evt.detail.checked) {
      // this.form_alamat = this.alamat_saya;
      this.save_alamat = true;
    } else {
      // this.form_alamat = " ";
      this.save_alamat = false;
    }
  }
  changed(event) {
    if (event.detail.value === '' || event.detail.value === ' ') {
      this.showChecked = true;
    }
  }
  async chooseAlamat() {
    const modal = await this.modalController.create({
      component: PilihAlamatPage,
      componentProps: {list_alamat: this.list_alamat, },
      animated: true,
      showBackdrop: true,
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data !== null && dataReturned.data !== undefined && dataReturned.data !== 'undefined') {
        this.form_alamat = dataReturned.data;
        this.showChecked = false;
      }
    });
    return await modal.present();
  }
  goToDetail(x) {
    this.router.navigateByUrl('/detail-order');
  }
  goToHome() {
    this.router.navigateByUrl('/app/tabs/tab1');
  }
  goToPembayaran() {
    if (this.waktu === undefined || this.waktu === 'undefined') {
      alert('Waktu pengiriman required');
    } else if (this.hari === undefined || this.hari === 'undefined') {
      alert('Hari pengiriman required');
    } else {
      const navigationExtras: NavigationExtras = {
        state: {
          cart : this.cart,
          diskon: this.diskon,
          poin: this.poin,
          ongkir: this.ongkir,
          form_alamat: this.form_alamat,
          lat: this.lat,
          lng: this.lng,
          waktu: this.waktu
        }
      };
      this.router.navigate(['/pembayaran'], navigationExtras);
    }
  }
  async alertOrder() {
    const alert = await this.alertController.create({
      header: 'Process Order ?',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'btn-red',
          role: 'cancel'
        }, {
          text: 'Ok',
          cssClass: 'btn-green',
          handler: async () => {
            if (this.waktu === undefined || this.waktu === 'undefined') {
              // alert("Waktu pengiriman required");
              const toast = await this.toastCtrl.create({
                message: 'Waktu pengiriman required',
                duration: 2000
              });
              toast.present();
            } else if (this.hari === undefined || this.hari === 'undefined') {
              // alert("Hari pengiriman required");
              const toast = await this.toastCtrl.create({
                message: 'Hari pengiriman required',
                duration: 2000
              });
              toast.present();
            } else if (this.form_alamat === undefined || this.form_alamat === 'undefined') {
              // alert("Hari pengiriman required");
              const toast = await this.toastCtrl.create({
                message: 'Alamat pengiriman required',
                duration: 2000
              });
              toast.present();
            } else {

              this.loading = this.loadingController.create({
                message: 'Please Wait'
              }).then((res) => {
                res.present();
                this.temporaryOrder();

                res.onDidDismiss().then((dis) => {
                });
              });

            }
          }
        }
      ]
    });

    await alert.present();
  }
  temporaryOrder() {

    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    // body.append('midtrans_id',result.order_id);

    body.append('poin', this.poin.toString());
    body.append('diskon', this.diskon.toString());
    body.append('diskon_product', this.diskon_product.toString());
    body.append('pelanggan_id', this.pelanggan_id);
    body.append('cabang_id', this.cabang_id.toString());
    body.append('voucher_id', this.serv.voucher_id.toString());
    body.append('form_alamat', this.form_alamat);
    body.append('hari', this.hari);
    body.append('waktu', this.waktu);
    body.append('lat', this.lat);
    body.append('lng', this.lng);
    body.append('save_alamat', this.save_alamat.toString());
    body.append('token', this.serv.header_key);
    body.append('ongkir', this.ongkir.toString());
    body.append('subtotal', this.total.toString());
    body.append('cart', JSON.stringify(this.cart));

    this.http.post(this.serv.base_url + 'checkout', body, requestOptions)
    .subscribe(async data => {
      this.loadingController.dismiss();
      const response = data.json();

        // alert(response.status);
      if (response.status === 'Failed') {
          const toast = await this.toastCtrl.create({
            message: response.message,
            duration: 2000
          });
          toast.present();
        } else {
          const order            = response.data;
          this.serv.voucher_id  = 0;
          // this.goToBerhasil();
          const navigationExtras: NavigationExtras = {
            state: {
              order,
              pelanggan : response.pelanggan,
            },
            skipLocationChange: true,
          };
          this.router.navigate(['berhasil'], navigationExtras);
        }
      }, error => {
        this.loadingController.dismiss();
    });
  }
  toRp(val) {
    return this.serv.toRp(val);
  }
}
