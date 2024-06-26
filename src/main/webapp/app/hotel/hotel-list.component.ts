import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { HotelService } from 'app/hotel/hotel.service';
import { HotelDTO } from 'app/hotel/hotel.model';
import { PaginationService } from 'app/pagination/pagination-service';


@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hotel-list.component.html'})
export class HotelListComponent implements OnInit, OnDestroy {

  hotelService = inject(HotelService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  paginationService = inject(PaginationService)
  hotels?: HotelDTO[];
  navigationSubscription?: Subscription;

  currentPage: number = 1;
  totalPages: number = 1;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:¿Quieres eliminar este elemento?`,
      deleted: $localize`:@@hotel.delete.success:Hotel eliminado correctamente.`,
      'hotel.resena.hotel.referenced': $localize`:@@hotel.resena.hotel.referenced:Esta entidad está referenciada por Reseña ${details?.id} por el campo Hotel.`
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
            this.paginationService.setItems(data, 10);
            this.loadPage(1);
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
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
            next: () => this.router.navigate(['/hotels'], {
              state: {
                msgInfo: this.getMessage('deleted')
              }
            }),
            error: (error) => {
              if (error.error?.code === 'REFERENCED') {
                const messageParts = error.error.message.split(',');
                this.router.navigate(['/hotels'], {
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
