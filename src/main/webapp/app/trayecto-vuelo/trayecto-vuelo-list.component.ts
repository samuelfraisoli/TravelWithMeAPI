import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { map, Observable, of, Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { TrayectoVueloService } from 'app/trayecto-vuelo/trayecto-vuelo.service';
import { TrayectoVueloDTO } from 'app/trayecto-vuelo/trayecto-vuelo.model';
import { PaginationService } from 'app/pagination/pagination-service';
import { AeropuertoService } from 'app/aeropuerto/aeropuerto.service';
import { AeropuertoDTO } from 'app/aeropuerto/aeropuerto.model';
import { BooleanToTextPipe } from 'app/common/boolean-to-text.pipe';
import { VueloService } from 'app/vuelo/vuelo.service';
import { VueloDTO } from 'app/vuelo/vuelo.model';


@Component({
  selector: 'app-trayecto-vuelo-list',
  standalone: true,
  imports: [CommonModule, RouterLink, BooleanToTextPipe],
  templateUrl: './trayecto-vuelo-list.component.html'})
export class TrayectoVueloListComponent implements OnInit, OnDestroy {

  trayectoVueloService = inject(TrayectoVueloService);
  aeropuertoService = inject(AeropuertoService);
  vueloService = inject(VueloService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  paginationService = inject(PaginationService)
  flightSegments?: TrayectoVueloDTO[];
  airports?: AeropuertoDTO[];
  vuelos?: VueloDTO[];
  navigationSubscription?: Subscription;

  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 6;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: `¿Quieres eliminar el elemento?.`,
      deleted: `Trayecto de vuelo eliminado correctamente.`    };
    return messages[key];
  }

  ngOnInit() {
    this.loadData();
    this.navigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadData();
      }
    });
  }

  ngOnDestroy() {
    this.navigationSubscription!.unsubscribe();
  }
  
  loadData() {
    this.trayectoVueloService.getAllTrayectoVueloes()
        .subscribe({
          next: (data) => {
            this.paginationService.setItems(data, this.itemsPerPage);
            this.loadPage(1);
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });

    this.aeropuertoService.getAllAeropuertoes()
    .subscribe({
      next: (data) => {
        this.airports = data;
      },
      error: (error) => this.errorHandler.handleServerError(error.error)
    });

    this.vueloService.getAllVueloes()
    .subscribe({
      next: (data) => {
        this.vuelos = data;
      },
      error: (error) => this.errorHandler.handleServerError(error.error)
    });
  }

  //Pagination
  loadPage(page: number): void {
    const paginatedResult = this.paginationService.getPage<TrayectoVueloDTO>(page);
    this.flightSegments = paginatedResult.items;
    this.currentPage = paginatedResult.currentPage;
    this.totalPages = paginatedResult.totalPages;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      const paginatedResult = this.paginationService.nextPage<TrayectoVueloDTO>();
      this.flightSegments = paginatedResult.items;
      this.currentPage = paginatedResult.currentPage;
      this.totalPages = paginatedResult.totalPages;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      const paginatedResult = this.paginationService.previousPage<TrayectoVueloDTO>();
      this.flightSegments = paginatedResult.items;
      this.currentPage = paginatedResult.currentPage;
      this.totalPages = paginatedResult.totalPages;
    }
  }

  
  showAirportName(id: number | undefined | null): string {
    if (this.airports == undefined) {
      return ""
    }
    for (let airport of this.airports) {
      if (airport.id !== undefined && id === airport.id) {
       
        return airport.nombre ?? 'Nombre no disponible';
      }
    }
    return 'Nombre no disponible'; 
  }


  

  confirmDelete(id: number) {
    if (confirm(this.getMessage('confirm'))) {
      this.trayectoVueloService.deleteTrayectoVuelo(id)
          .subscribe({
            next: () => this.router.navigate(['/trayectoVuelos'], {
              state: {
                msgInfo: this.getMessage('deleted')
              }
            }),
            error: (error) => this.errorHandler.handleServerError(error.error)
          });
    }
  }

}
