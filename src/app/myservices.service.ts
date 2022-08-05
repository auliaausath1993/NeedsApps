import { Injectable } from '@angular/core';
import { InAppBrowser, InAppBrowserEvent, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MyserviceService {
  // DEV//
  // public base:String            = "https://dev5.novatama.com/needs_api/public/";
  // public base_url:String        = this.base+"";
  // public base_url_image:String  = "https://dev5.novatama.com/needs_admin/public/";


  // PRODUCTION//
  public base: String            = 'https://needsapi.needsmarket.id/public/';
  public base_url: String        = this.base + '';
  public base_url_image: String  = 'https://needsmarket.id/adminpage/public/';

  public bahasa             = 'id';
  public bahasa_name        = 'Bahasa';
  public app_name           = 'Needs';
  public app_version        = '0.0.3';
  public header_key         = 'd2FrdWxpbmVybm92YXRhbWFpbmZpc2lvbg==';
  public token              = 'd2FrdWxpbmVybm92YXRhbWFpbmZpc2lvbg==';
  public map_key            = 'AIzaSyBaqX2OWTYyEaBbC5ER-X7YvytxdZfEUmA';

  public canGoBack          = true;
  public voucher_id         = 0;
  constructor(
    private inAppBrowser: InAppBrowser,
    private platform: Platform,
  ) {}

  randomID(length) {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  toRp(angka) {
      const rev     = parseInt(angka, 10).toString().split('').reverse().join('');
      let rev2    = '';
      for (let i = 0; i < rev.length; i++) {
          rev2  += rev[i];
          if ((i + 1) % 3 === 0 && i !== (rev.length - 1)) {
              rev2 += '.';
          }
      }
      return 'Rp' + rev2.split('').reverse().join('') + '';
  }

  limitText(val, limit) {
    if (val.length >= limit) {
      val = val.substring(0, limit) + '...';
    }
    return val;
  }

  payment(token: string, callback: (data: any) => void) {
    const url = `https://payment.needsmarket.id?token=${token}`;
    const options: InAppBrowserOptions = {
      location: 'no',
      zoom: 'no',
      beforeload: 'yes',
      footer: 'no',
    };
    const target = this.platform.is('cordova') ? '_blank' : '_system';
    const ref = this.inAppBrowser.create(url, target, options);
    ref.show();
    if (this.platform.is('cordova')) {
      ref.on('beforeload').subscribe((event: InAppBrowserEvent) => {
        if (event.url.startsWith('gojek')) {
          this.inAppBrowser.create(event.url, '_system');
        } else {
          ref._loadAfterBeforeload(event.url);
        }
      });
      ref.on('message').subscribe(({ data }) => {
        console.log(data);
        ref.close();
        if (data.status === 'onPending' || data.status === 'onSuccess') {
          callback(data.result);
        }
      });
    }
  }
}
