import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyserviceService } from '../myservices.service';
import { Router } from '@angular/router';
import { Events, ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  bahasa; bahasa_name;
  register_title; register_button; register_nama; register_no_hp; register_alamat; register_no_ktp; register_foto; register_email; register_kembali;
  loading;

  nama; no_hp; alamat; no_ktp; foto; email; required;
  error_phone; success_register;

  error_email;

  constructor(
    private http: Http,
    private router: Router,
    private events: Events,
    private serv: MyserviceService,
    private toastCtrl: ToastController,
    public loadingController: LoadingController,
  ) {
    this.bahasa       = this.serv.bahasa;
    this.bahasa_name  = this.serv.bahasa_name;
    this.getSubtitle();
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
        this.required                  = response.id.required;
        this.error_phone               = response.id.error_phone;
        this.error_email               = response.id.error_email;
        this.success_register          = response.id.success_register;
        this.register_kembali          = response.id.register_kembali;
      } else if (this.bahasa === 'en') {
        this.register_title            = response.en.register_title;
        this.register_button           = response.en.register_button;
        this.register_nama             = response.en.register_nama;
        this.register_no_hp            = response.en.register_no_hp;
        this.register_email            = response.en.register_email;
        this.register_alamat           = response.en.register_alamat;
        this.register_no_ktp           = response.en.register_no_ktp;
        this.register_foto             = response.en.register_foto;
        this.required                  = response.en.required;
        this.error_phone               = response.en.error_phone;
        this.error_email               = response.en.error_email;
        this.success_register          = response.en.success_register;
        this.register_kembali          = response.en.register_kembali;
      } else if (this.bahasa === 'ch') {
        this.register_title            = response.ch.register_title;
        this.register_button           = response.ch.register_button;
        this.register_nama             = response.ch.register_nama;
        this.register_no_hp            = response.ch.register_no_hp;
        this.register_email            = response.ch.register_email;
        this.register_alamat           = response.ch.register_alamat;
        this.register_no_ktp           = response.ch.register_no_ktp;
        this.register_foto             = response.ch.register_foto;
        this.required                  = response.ch.required;
        this.error_phone               = response.ch.error_phone;
        this.error_email               = response.ch.error_email;
        this.success_register          = response.ch.success_register;
        this.register_kembali          = response.ch.register_kembali;
      }
    });
  }

  goToHome() {
    this.events.publish('subtitle_menu', 'yes', Date.now());
    this.router.navigateByUrl('/app/tabs/tab1');
  }
  async register() {
    if (this.nama === undefined || this.nama === '') {
      const toast = await this.toastCtrl.create({
        message: this.register_nama + ' Required',
        duration: 2000
      });
      toast.present();
    } else if (this.no_hp === undefined || this.no_hp === '') {
      const toast = await this.toastCtrl.create({
        message: this.register_no_hp + ' Required',
        duration: 2000
      });
      toast.present();
    } else if (this.email === undefined || this.email === '') {
      const toast = await this.toastCtrl.create({
        message: this.register_email + ' Required',
        duration: 2000
      });
      toast.present();
    } else {
      this.goRegister();
    }
  }
  goRegister() {
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
    this.no_ktp = '-';
    body.append('no_hp', this.no_hp);
    body.append('nama', this.nama);
    body.append('alamat', this.alamat);
    body.append('no_ktp', this.no_ktp);
    body.append('foto', this.foto);
    body.append('email', this.email);
    body.append('token', this.serv.header_key);

    this.http.post(this.serv.base_url + 'register', body, requestOptions)
    .subscribe(data => {
        this.loadingController.dismiss();
        const response = data.json();

        if (response.status === 'Failed') {
          if (response.reason === 'required') {
            alert(response.message + ' ' + this.required);
          } else if (response.reason === 'error') {
            alert(response.message);
          } else if (response.reason === 'phone') {
            alert(this.error_phone);
          } else if (response.reason === 'email') {
            alert(this.error_email);
          }
        } else {
          alert(this.success_register);
          this.router.navigateByUrl('');
        }
      }, error => {
        this.loadingController.dismiss();
    });
  }
  backToLogin() {
    this.router.navigateByUrl('/');
  }

  ngOnInit() {
  }

}
