import { PilihAlamatPage } from './pilih-alamat/pilih-alamat.page';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { StorageModule } from '@ngx-pwa/local-storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';

import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';
import { FileUploadModule } from 'ng2-file-upload';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { registerLocaleData } from '@angular/common';
import localeId from '@angular/common/locales/id';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { CodePush } from '@ionic-native/code-push/ngx';

registerLocaleData(localeId, 'id-ID');

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('778519906246-6dffcpdne4aqd6k0d4gttm55ru8k1su4.apps.googleusercontent.com')
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [AppComponent, PilihAlamatPage],
  entryComponents: [PilihAlamatPage],
  imports: [
    BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    StorageModule.forRoot({ IDBNoWrap: true }),
    HttpModule,
    SocialLoginModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    FCM,
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    Geolocation,
    NativeGeocoder,
    Clipboard,
    Camera,
    File,
    FileTransfer,
    FilePath,
    InAppBrowser,
    CodePush,
    MobileAccessibility,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: AuthServiceConfig, useFactory: provideConfig },
    { provide: LOCALE_ID, useValue: 'id-ID' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
