import { LoadingController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyserviceService } from '../myservices.service';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage {
  bahasa; bahasa_name;

  status  = 'ongoing';
  banners = [1, 1, 1, 1, 1, 1];

  pelanggan_id;
  loading;
  data;

  id; nama; email; no_hp; alamat; no_ktp;
  register_title; register_button; register_nama; register_no_hp; register_alamat; register_no_ktp; register_foto; register_email; required; register_edit;
  error_phone; success_register;


  constructor(
    private http: Http,
    private router: Router,
    private storage: StorageMap,
    private serv: MyserviceService,
    private toastCtrl: ToastController,
    private loadingController: LoadingController,
  ) {
    this.bahasa       = this.serv.bahasa;
    this.bahasa_name  = this.serv.bahasa_name;



    this.getSubtitle();
  }
  ionViewWillEnter() {
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
        this.register_title            = response.id.register_title;
        this.register_button           = response.id.register_button;
        this.register_nama             = response.id.register_nama;
        this.register_no_hp            = response.id.register_no_hp;
        this.register_email            = response.id.register_email;
        this.register_alamat           = response.id.register_alamat;
        this.register_no_ktp           = response.id.register_no_ktp;
        this.register_foto             = response.id.register_foto;
        this.register_edit             = response.id.register_edit;
        this.required                  = response.id.required;
        this.error_phone               = response.id.error_phone;
        this.success_register          = response.id.success_register;
      } else if (this.bahasa === 'en') {
        this.register_title            = response.en.register_title;
        this.register_button           = response.en.register_button;
        this.register_nama             = response.en.register_nama;
        this.register_no_hp            = response.en.register_no_hp;
        this.register_email            = response.en.register_email;
        this.register_alamat           = response.en.register_alamat;
        this.register_no_ktp           = response.en.register_no_ktp;
        this.register_foto             = response.en.register_foto;
        this.register_edit             = response.id.register_edit;
        this.required                  = response.en.required;
        this.error_phone               = response.en.error_phone;
        this.success_register          = response.en.success_register;
      } else if (this.bahasa === 'ch') {
        this.register_title            = response.ch.register_title;
        this.register_button           = response.ch.register_button;
        this.register_nama             = response.ch.register_nama;
        this.register_no_hp            = response.ch.register_no_hp;
        this.register_email            = response.ch.register_email;
        this.register_alamat           = response.ch.register_alamat;
        this.register_no_ktp           = response.ch.register_no_ktp;
        this.register_foto             = response.ch.register_foto;
        this.register_edit             = response.id.register_edit;
        this.required                  = response.ch.required;
        this.error_phone               = response.ch.error_phone;
        this.success_register          = response.ch.success_register;
      }
    });
  }
  getData() {
    this.loading = this.loadingController.create({
      message: 'Please Wait',
      duration: 10000
    }).then((res) => {
      res.present();
      res.onDidDismiss().then((dis) => {
      });
    });
    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();

    body.append('pelanggan_id', this.pelanggan_id.toString());
    body.append('token', this.serv.header_key);

    this.http.post(this.serv.base_url + 'get_profile', body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      const response = data.json();

      if (response.status === 'Failed') {

        } else {
          this.data = response.data[0];

          this.nama    = this.data.nama;
          this.email   = this.data.email;
          this.no_hp   = this.data.no_hp;
          this.alamat  = this.data.alamat;
          this.no_ktp  = this.data.no_ktp;
          this.id      = this.data.id;
        }
      }, error => {
        this.loadingController.dismiss();
    });
  }
  async editProfile() {
    if (this.nama === '' || this.nama === ' ' || this.nama === undefined) {
      const toast = await this.toastCtrl.create({
        message: this.register_nama + ' required',
        duration: 1000
      });
      toast.present();
    } else if (this.no_hp === '' || this.no_hp === ' ' || this.no_hp === undefined) {
      const toast = await this.toastCtrl.create({
        message: this.register_no_hp + ' required',
        duration: 1000
      });
      toast.present();
    } else if (this.email === '' || this.email === ' ' || this.email === undefined) {
      const toast = await this.toastCtrl.create({
        message: this.register_email + ' required',
        duration: 1000
      });
      toast.present();
    } else if (this.alamat === '' || this.no_ktp === ' ' || this.alamat === undefined) {
      const toast = await this.toastCtrl.create({
        message: this.register_alamat + ' required',
        duration: 1000
      });
      toast.present();
    } else if (this.no_ktp === '' || this.no_ktp === ' ' || this.no_ktp === undefined) {
      const toast = await this.toastCtrl.create({
        message: this.register_no_ktp + ' required',
        duration: 1000
      });
      toast.present();
    } else {
      this.goEditProfile();
    }
  }
  async goEditProfile() {
    this.loading = this.loadingController.create({
      message: '',
      spinner: 'circles',
      duration: 10000,
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
      });
    });

    const headers = new Headers();
    // headers.append("Authorization", this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData();
    body.append('id', this.id);
    body.append('no_hp', this.no_hp);
    body.append('nama', this.nama);
    body.append('alamat', this.alamat);
    body.append('no_ktp', this.no_ktp);
    body.append('email', this.email);
    body.append('token', this.serv.header_key);

    this.http.post(this.serv.base_url + 'update_profile', body, requestOptions)
    .subscribe(async data => {
        this.loadingController.dismiss();
        const response = data.json();

        if (response.status === 'Failed') {
          if (response.reason === 'required') {
            // alert(response.message+" "+this.required);
            const toast = await this.toastCtrl.create({
              message: response.message + ' ' + this.required,
              duration: 2000
            });
            toast.present();
          } else if (response.reason === 'error') {
            // alert(response.message);
            const toast = await this.toastCtrl.create({
              message: response.message,
              duration: 2000
            });
            toast.present();
          } else if (response.reason === 'phone') {
            // alert(this.error_phone);
            const toast = await this.toastCtrl.create({
              message: this.error_phone,
              duration: 2000
            });
            toast.present();
          }
        } else {
          // alert("Success Data Updated");
          const toast = await this.toastCtrl.create({
            message: 'Success Data Updated',
            duration: 2000
          });
          toast.present();
          this.getData();
          setTimeout( () => {
            // this.router.navigateByUrl("app/tabs/tab5");
          }, 1000);
        }
      }, error => {
        this.loadingController.dismiss();
    });
  }
}
