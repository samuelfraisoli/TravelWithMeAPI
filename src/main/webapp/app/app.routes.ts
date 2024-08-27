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
  },
  {
    path: 'vuelos/add',
    component: VueloAddComponent,
  },
  {
    path: 'vuelos/edit/:id',
    component: VueloEditComponent,
  
  },
  {
    path: 'trayectoVuelos',
    component: TrayectoVueloListComponent,
  },
  {
    path: 'trayectoVuelos/add',
    component: TrayectoVueloAddComponent,
  },
  {
    path: 'trayectoVuelos/edit/:id',
    component: TrayectoVueloEditComponent,
  },
  {
    path: 'hotels',
    component: HotelListComponent,
  },
  {
    path: 'hotels/add',
    component: HotelAddComponent,
  },
  {
    path: 'hotels/edit/:id',
    component: HotelEditComponent,
  },
  {
    path: 'aeropuertos',
    component: AeropuertoListComponent,
  },
  {
    path: 'aeropuertos/add',
    component: AeropuertoAddComponent,
  },
  {
    path: 'aeropuertos/edit/:id',
    component: AeropuertoEditComponent,
  },
  {
    path: 'direccions',
    component: DireccionListComponent,
  },
  {
    path: 'direccions/add',
    component: DireccionAddComponent,
  },
  {
    path: 'direccions/edit/:id',
    component: DireccionEditComponent,
  },
  {
    path: 'resenas',
    component: ResenaListComponent,
  },
  {
    path: 'resenas/add',
    component: ResenaAddComponent,
  },
  {
    path: 'resenas/edit/:id',
    component: ResenaEditComponent,
  },
  {
    path: 'detallesHotels',
    component: DetallesHotelListComponent,
  },
  {
    path: 'detallesHotels/add',
    component: DetallesHotelAddComponent,
  },
  {
    path: 'detallesHotels/edit/:id',
    component: DetallesHotelEditComponent,
  },
  {
    path: 'error',
    component: ErrorComponent,
  },
  {
    path: '**',
    component: ErrorComponent,
  }
];
