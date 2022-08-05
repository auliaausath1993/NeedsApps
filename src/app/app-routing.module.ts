import { MidtransDevPage } from './midtrans-dev/midtrans-dev.page';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./waitingscreen/waitingscreen.module').then(m => m.WaitingscreenPageModule)
  },
  { path: 'app', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'app/tabs/tab1', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'app/tabs/tab1', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'app/tabs/tab1', loadChildren: './tabs/tabs.module#TabsPageModule' },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'tabs4',
    loadChildren: () => import('./tabs4/tabs4.module').then( m => m.Tabs4PageModule)
  },
  {
    path: 'tabs5',
    loadChildren: () => import('./tabs5/tabs5.module').then( m => m.Tabs5PageModule)
  },
  {
    path: 'list-produk',
    loadChildren: () => import('./list-produk/list-produk.module').then( m => m.ListProdukPageModule)
  },
  {
    path: 'detail-produk',
    loadChildren: () => import('./detail-produk/detail-produk.module').then( m => m.DetailProdukPageModule)
  },
  {
    path: 'konfirmasi-pesanan',
    loadChildren: () => import('./konfirmasi-pesanan/konfirmasi-pesanan.module').then( m => m.KonfirmasiPesananPageModule)
  },
  {
    path: 'detail-pengiriman',
    loadChildren: () => import('./detail-pengiriman/detail-pengiriman.module').then( m => m.DetailPengirimanPageModule)
  },
  {
    path: 'pembayaran',
    loadChildren: () => import('./pembayaran/pembayaran.module').then( m => m.PembayaranPageModule)
  },
  {
    path: 'berhasil',
    loadChildren: () => import('./berhasil/berhasil.module').then( m => m.BerhasilPageModule)
  },
  {
    path: 'detail-order',
    loadChildren: () => import('./detail-order/detail-order.module').then( m => m.DetailOrderPageModule)
  },
  {
    path: 'edit-profil',
    loadChildren: () => import('./edit-profil/edit-profil.module').then( m => m.EditProfilPageModule)
  },
  {
    path: 'atur-alamat',
    loadChildren: () => import('./atur-alamat/atur-alamat.module').then( m => m.AturAlamatPageModule)
  },
  {
    path: 'atur-bahasa',
    loadChildren: () => import('./atur-bahasa/atur-bahasa.module').then( m => m.AturBahasaPageModule)
  },
  {
    path: 'detail-info',
    loadChildren: () => import('./detail-info/detail-info.module').then( m => m.DetailInfoPageModule)
  },
  {
    path: 'detail-scan',
    loadChildren: () => import('./detail-scan/detail-scan.module').then( m => m.DetailScanPageModule)
  },
  {
    path: 'filter',
    loadChildren: () => import('./filter/filter.module').then( m => m.FilterPageModule)
  },
  {
    path: 'urutkan',
    loadChildren: () => import('./urutkan/urutkan.module').then( m => m.UrutkanPageModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./notification/notification.module').then( m => m.NotificationPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'konten',
    loadChildren: () => import('./konten/konten.module').then( m => m.KontenPageModule)
  },
  {
    path: 'lucky-shop',
    loadChildren: () => import('./lucky-shop/lucky-shop.module').then( m => m.LuckyShopPageModule)
  },
  {
    path: 'my-voucher',
    loadChildren: () => import('./my-voucher/my-voucher.module').then( m => m.MyVoucherPageModule)
  },
  {
    path: 'detail-berita',
    loadChildren: () => import('./detail-berita/detail-berita.module').then( m => m.DetailBeritaPageModule)
  },
  {
    path: 'list-promo',
    loadChildren: () => import('./list-promo/list-promo.module').then( m => m.ListPromoPageModule)
  },
  {
    path: 'detail-promo',
    loadChildren: () => import('./detail-promo/detail-promo.module').then( m => m.DetailPromoPageModule)
  },
  {
    path: 'wishlist',
    loadChildren: () => import('./wishlist/wishlist.module').then( m => m.WishlistPageModule)
  },
  {
    path: 'news',
    loadChildren: () => import('./news/news.module').then( m => m.NewsPageModule)
  },
  {
    path: 'news-detail',
    loadChildren: () => import('./news-detail/news-detail.module').then( m => m.NewsDetailPageModule)
  },
  {
    path: 'midtrans-dev',
    loadChildren: () => import('./midtrans-dev/midtrans-dev.module').then( m => m.MidtransDevPageModule)
  },
  {
    path: 'search-produk',
    loadChildren: () => import('./search-produk/search-produk.module').then( m => m.SearchProdukPageModule)
  },
  {
    path: 'waitingscreen',
    loadChildren: () => import('./waitingscreen/waitingscreen.module').then( m => m.WaitingscreenPageModule)
  },
  {
    path: 'pilih-alamat',
    loadChildren: () => import('./pilih-alamat/pilih-alamat.module').then( m => m.PilihAlamatPageModule)
  },
  {
    path: 'request-produk',
    loadChildren: () => import('./request-produk/request-produk.module').then( m => m.RequestProdukPageModule)
  },
  {
    path: 'kritik-saran',
    loadChildren: () => import('./kritik-saran/kritik-saran.module').then( m => m.KritikSaranPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
