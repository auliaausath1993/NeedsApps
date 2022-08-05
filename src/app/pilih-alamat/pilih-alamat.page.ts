import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Http,Headers,RequestOptions } from '@angular/http';
import { MyserviceService } from '../myservices.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

import { StorageMap } from '@ngx-pwa/local-storage';
import { LoadingController, AlertController, ToastController, ModalController } from '@ionic/angular';

import { Plugins } from '@capacitor/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

declare var google;

@Component({
  selector: 'app-pilih-alamat',
  templateUrl: './pilih-alamat.page.html',
  styleUrls: ['./pilih-alamat.page.scss'],
})
export class PilihAlamatPage{

  @ViewChild('map',null) mapElement: ElementRef;
  map: any;
  address:string;

  bahasa;bahasa_name;

  pengiriman_title;
  pengiriman_alamat;
  pengiriman_saya;
  pengiriman_total_item;
  pengiriman_total_belanja;
  pengiriman_biaya_kirim;
  pengiriman_grand_total;
  pengiriman_selanjutnya;

  status  = "ongoing";
  banners = [1,1,1,1,1,1];
  data;
  pelanggan_id;
  alamat_saya;alamat;
  pengantaran;

  cart;
  total_item = 0;
  ongkir = 0;
  total = 0;

  toggle;
  form_alamat;

  lat;lng;

  ongkir_per_km = 0;
  jarak_km      = 0;

  diskon        = 0;

  waktu_pengantaran = [];
  waktu;

  now;
  array_option = [];

  date;
  text_hari = "Hari";
  hari;
  list_hari = [];
  list_alamat = [];

  constructor(
    private http: Http,
    private router: Router,
    private storage: StorageMap,
    private route: ActivatedRoute,
    private serv: MyserviceService,
    private geolocation: Geolocation,
    private toastCtrl: ToastController,
    private nativeGeocoder: NativeGeocoder,
    private modalController: ModalController,
    private alertController : AlertController,
    private loadingController: LoadingController
  ) {
    this.bahasa       = this.serv.bahasa;
    this.bahasa_name  = this.serv.bahasa_name;



    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.list_alamat        = this.router.getCurrentNavigation().extras.state.list_alamat;
      }
    });
  }
  ionViewWillEnter(){


    this.storage.get('bahasa').subscribe((data) => {
      if(data){
        this.bahasa = data;
        this.storage.get('bahasa_name').subscribe((data) => {
          if(data){
            this.bahasa_name = data;
            this.getSubtitle();
          }
        });
      }else{
        this.bahasa         = this.serv.bahasa;
        this.bahasa_name    = this.serv.bahasa_name;
        this.storage.set('bahasa',this.bahasa).subscribe(() => {
          this.storage.set('bahasa_name',this.bahasa_name).subscribe(() => {
            this.getSubtitle();
          });
        });
      }
    });
  }

  async kembali(){
    await this.modalController.dismiss(null);
  }
  useAlamat(x){
    this.storage.set('alamat_active',x.alamat).subscribe(async () => {
      const onClosedData: string = x.alamat;
      await this.modalController.dismiss(onClosedData);
    });
  }
  getSubtitle(){
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      var response = data.json();
      if(this.bahasa=="id"){
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
      }else if(this.bahasa=="en"){
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
      }else if(this.bahasa=="ch"){
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
  toRp(val){
    return this.serv.toRp(val);
  }
}
