import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { DetallesHotelService } from 'app/detalles-hotel/detalles-hotel.service';
import { DetallesHotelDTO } from 'app/detalles-hotel/detalles-hotel.model';
import { PaginationService } from 'app/pagination/pagination-service';


@Component({
  selector: 'app-detalles-hotel-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalles-hotel-list.component.html'})
export class DetallesHotelListComponent implements OnInit, OnDestroy {

  detallesHotelService = inject(DetallesHotelService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  paginationService = inject(PaginationService)
  hotelsDetails?: DetallesHotelDTO[];
  navigationSubscription?: Subscription;

  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 3;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: `¿Quieres eliminar este elemento?`,
      deleted:`Detalles Hotel eliminado correctamente.`,
      'detallesHotel.hotel.detallesHotel.referenced': `Esta entidad está referenciada por ${details?.id} por el campo Detalles Hotel.`
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
    this.detallesHotelService.getAllDetallesHotels()
        .subscribe({
          next: (data) => {
            this.paginationService.setItems(data, this.itemsPerPage);
            this.loadPage(1);
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  loadPage(page: number): void {
    const paginatedResult = this.paginationService.getPage<DetallesHotelDTO>(page);
    this.hotelsDetails = paginatedResult.items;
    this.currentPage = paginatedResult.currentPage;
    this.totalPages = paginatedResult.totalPages;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      const paginatedResult = this.paginationService.nextPage<DetallesHotelDTO>();
      this.hotelsDetails = paginatedResult.items;
      this.currentPage = paginatedResult.currentPage;
      this.totalPages = paginatedResult.totalPages;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      const paginatedResult = this.paginationService.previousPage<DetallesHotelDTO>();
      this.hotelsDetails = paginatedResult.items;
      this.currentPage = paginatedResult.currentPage;
      this.totalPages = paginatedResult.totalPages;
    }
  }

  confirmDelete(id: number) {
    if (confirm(this.getMessage('confirm'))) {
      this.detallesHotelService.deleteDetallesHotel(id)
          .subscribe({
            next: () => this.router.navigate(['/detallesHoteles'], {
              state: {
                msgInfo: this.getMessage('deleted')
              }
            }),
            error: (error) => {
              if (error.error?.code === 'REFERENCED') {
                const messageParts = error.error.message.split(',');
                this.router.navigate(['/detallesHoteles'], {
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
