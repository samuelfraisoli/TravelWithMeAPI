import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { HotelService } from 'app/hotel/hotel.service';
import { HotelDTO } from 'app/hotel/hotel.model';
import { PaginationService } from 'app/pagination/pagination-service';
import { DireccionDTO } from 'app/direccion/direccion.model';
import { DetallesHotelDTO } from 'app/detalles-hotel/detalles-hotel.model';
import { DetallesHotelService } from 'app/detalles-hotel/detalles-hotel.service';
import { DireccionService } from 'app/direccion/direccion.service';


@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hotel-list.component.html'})
export class HotelListComponent implements OnInit, OnDestroy {

  hotelService = inject(HotelService);
  detallesHotelService = inject(DetallesHotelService);
  direccionesService = inject(DireccionService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  paginationService = inject(PaginationService)
  hotels?: HotelDTO[];
  direcciones?: DireccionDTO[];
  detallesHoteles?: DetallesHotelDTO[];
  navigationSubscription?: Subscription;

  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 3;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm:`¿Quieres eliminar este elemento?`,
      deleted:`Hotel eliminado correctamente.`,
      'hotel.resena.hotel.referenced':`Esta entidad está referenciada por Reseña ${details?.id} por el campo Hotel.`
    };
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
    this.hotelService.getAllHotels()
        .subscribe({
          next: (data) => {
            this.paginationService.setItems(data, this.itemsPerPage);
            this.loadPage(1);
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });

    this.direccionesService.getAllDireccions()
    .subscribe({
      next: (data) => {
        this.direcciones = data;
      },
      error: (error) => this.errorHandler.handleServerError(error.error)
    });

    this.detallesHotelService.getAllDetallesHotels()
    .subscribe({
      next: (data) => {
        this.detallesHoteles = data;
      },
      error: (error) => this.errorHandler.handleServerError(error.error)
    });
  }

  showDetallesHotelDescription(id: number | undefined | null): string {
    if (this.detallesHoteles == undefined) {
      return ""
    }
    for (let detallesHotel of this.detallesHoteles) {
      if (detallesHotel.id !== undefined && id === detallesHotel.id) {
       
        return detallesHotel.descripcion ?? 'Descripción no disponible';
      }
    }
    return 'Descripción no disponible'; 
  }

  showDireccion(id: number | undefined | null): string {
    if (this.direcciones == undefined) {
      return ""
    }
    for (let direccion of this.direcciones) {
      if (direccion.id !== undefined && id === direccion.id) {
       
        return direccion.direccionString ?? 'Dirección no disponible';
      }
    }
    return 'Dirección no disponible'; 
  }

  loadPage(page: number): void {
    const paginatedResult = this.paginationService.getPage<HotelDTO>(page);
    this.hotels = paginatedResult.items;
    this.currentPage = paginatedResult.currentPage;
    this.totalPages = paginatedResult.totalPages;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      const paginatedResult = this.paginationService.nextPage<HotelDTO>();
      this.hotels = paginatedResult.items;
      this.currentPage = paginatedResult.currentPage;
      this.totalPages = paginatedResult.totalPages;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      const paginatedResult = this.paginationService.previousPage<HotelDTO>();
      this.hotels = paginatedResult.items;
      this.currentPage = paginatedResult.currentPage;
      this.totalPages = paginatedResult.totalPages;
    }
  }

  confirmDelete(id: number) {
    if (confirm(this.getMessage('confirm'))) {
      this.hotelService.deleteHotel(id)
          .subscribe({
            next: () => this.router.navigate(['/hoteles'], {
              state: {
                msgInfo: this.getMessage('deleted')
              }
            }),
            error: (error) => {
              if (error.error?.code === 'REFERENCED') {
                const messageParts = error.error.message.split(',');
                this.router.navigate(['/hoteles'], {
                  state: {
                    msgError: this.getMessage(messageParts[0], { id: messageParts[1] })
                  }
                });
                return;
              }
              this.errorHandler.handleServerError(error.error)
            }
          });
    }
  }

}
