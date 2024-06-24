import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VueloListComponent } from './vuelo/vuelo-list.component';
import { VueloAddComponent } from './vuelo/vuelo-add.component';
import { VueloEditComponent } from './vuelo/vuelo-edit.component';
import { TrayectoVueloListComponent } from './trayecto-vuelo/trayecto-vuelo-list.component';
import { TrayectoVueloAddComponent } from './trayecto-vuelo/trayecto-vuelo-add.component';
import { TrayectoVueloEditComponent } from './trayecto-vuelo/trayecto-vuelo-edit.component';
import { HotelListComponent } from './hotel/hotel-list.component';
import { HotelAddComponent } from './hotel/hotel-add.component';
import { HotelEditComponent } from './hotel/hotel-edit.component';
import { AeropuertoListComponent } from './aeropuerto/aeropuerto-list.component';
import { AeropuertoAddComponent } from './aeropuerto/aeropuerto-add.component';
import { AeropuertoEditComponent } from './aeropuerto/aeropuerto-edit.component';
import { DireccionListComponent } from './direccion/direccion-list.component';
import { DireccionAddComponent } from './direccion/direccion-add.component';
import { DireccionEditComponent } from './direccion/direccion-edit.component';
import { ResenaListComponent } from './resena/resena-list.component';
import { ResenaAddComponent } from './resena/resena-add.component';
import { ResenaEditComponent } from './resena/resena-edit.component';
import { DetallesHotelListComponent } from './detalles-hotel/detalles-hotel-list.component';
import { DetallesHotelAddComponent } from './detalles-hotel/detalles-hotel-add.component';
import { DetallesHotelEditComponent } from './detalles-hotel/detalles-hotel-edit.component';
import { ErrorComponent } from './error/error.component';


export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'vuelos',
    component: VueloListComponent,
    title: $localize`:@@vuelo.list.headline:Vuelos`
  },
  {
    path: 'vuelos/add',
    component: VueloAddComponent,
    title: $localize`:@@vuelo.add.headline:Add Vuelo`
  },
  {
    path: 'vuelos/edit/:id',
    component: VueloEditComponent,
    title: $localize`:@@vuelo.edit.headline:Edit Vuelo`
  },
  {
    path: 'trayectoVuelos',
    component: TrayectoVueloListComponent,
    title: $localize`:@@trayectoVuelo.list.headline:Trayecto Vuelos`
  },
  {
    path: 'trayectoVuelos/add',
    component: TrayectoVueloAddComponent,
    title: $localize`:@@trayectoVuelo.add.headline:Add Trayecto Vuelo`
  },
  {
    path: 'trayectoVuelos/edit/:id',
    component: TrayectoVueloEditComponent,
    title: $localize`:@@trayectoVuelo.edit.headline:Edit Trayecto Vuelo`
  },
  {
    path: 'hotels',
    component: HotelListComponent,
    title: $localize`:@@hotel.list.headline:Hoteles`
  },
  {
    path: 'hotels/add',
    component: HotelAddComponent,
    title: $localize`:@@hotel.add.headline:Add Hotel`
  },
  {
    path: 'hotels/edit/:id',
    component: HotelEditComponent,
    title: $localize`:@@hotel.edit.headline:Edit Hotel`
  },
  {
    path: 'aeropuertos',
    component: AeropuertoListComponent,
    title: $localize`:@@aeropuerto.list.headline:Aeropuertos`
  },
  {
    path: 'aeropuertos/add',
    component: AeropuertoAddComponent,
    title: $localize`:@@aeropuerto.add.headline:Add Aeropuerto`
  },
  {
    path: 'aeropuertos/edit/:id',
    component: AeropuertoEditComponent,
    title: $localize`:@@aeropuerto.edit.headline:Edit Aeropuerto`
  },
  {
    path: 'direccions',
    component: DireccionListComponent,
    title: $localize`:@@direccion.list.headline:Direcciones`
  },
  {
    path: 'direccions/add',
    component: DireccionAddComponent,
    title: $localize`:@@direccion.add.headline:Add Dirección`
  },
  {
    path: 'direccions/edit/:id',
    component: DireccionEditComponent,
    title: $localize`:@@direccion.edit.headline:Edit Dirección`
  },
  {
    path: 'resenas',
    component: ResenaListComponent,
    title: $localize`:@@resena.list.headline:Reseñas`
  },
  {
    path: 'resenas/add',
    component: ResenaAddComponent,
    title: $localize`:@@resena.add.headline:Add Reseña`
  },
  {
    path: 'resenas/edit/:id',
    component: ResenaEditComponent,
    title: $localize`:@@resena.edit.headline:Edit Reseña`
  },
  {
    path: 'detallesHotels',
    component: DetallesHotelListComponent,
    title: $localize`:@@detallesHotel.list.headline:Detalles de los Hoteles`
  },
  {
    path: 'detallesHotels/add',
    component: DetallesHotelAddComponent,
    title: $localize`:@@detallesHotel.add.headline:Add Detalles del Hotel`
  },
  {
    path: 'detallesHotels/edit/:id',
    component: DetallesHotelEditComponent,
    title: $localize`:@@detallesHotel.edit.headline:Edit Detalles del Hotel`
  },
  {
    path: 'error',
    component: ErrorComponent,
    title: $localize`:@@error.headline:Error`
  },
  {
    path: '**',
    component: ErrorComponent,
    title: $localize`:@@notFound.headline:Page not found`
  }
];
