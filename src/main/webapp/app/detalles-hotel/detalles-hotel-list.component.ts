import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { DetallesHotelService } from 'app/detalles-hotel/detalles-hotel.service';
import { DetallesHotelDTO } from 'app/detalles-hotel/detalles-hotel.model';


@Component({
  selector: 'app-detalles-hotel-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalles-hotel-list.component.html'})
export class DetallesHotelListComponent implements OnInit, OnDestroy {

  detallesHotelService = inject(DetallesHotelService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  detallesHotels?: DetallesHotelDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@detallesHotel.delete.success:Detalles Hotel was removed successfully.`,
      'detallesHotel.hotel.detallesHotel.referenced': $localize`:@@detallesHotel.hotel.detallesHotel.referenced:This entity is still referenced by Hotel ${details?.id} via field Detalles Hotel.`
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
          next: (data) => this.detallesHotels = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (confirm(this.getMessage('confirm'))) {
      this.detallesHotelService.deleteDetallesHotel(id)
          .subscribe({
            next: () => this.router.navigate(['/detallesHotels'], {
              state: {
                msgInfo: this.getMessage('deleted')
              }
            }),
            error: (error) => {
              if (error.error?.code === 'REFERENCED') {
                const messageParts = error.error.message.split(',');
                this.router.navigate(['/detallesHotels'], {
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
