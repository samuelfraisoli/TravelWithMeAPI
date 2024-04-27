import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { HotelService } from 'app/hotel/hotel.service';
import { HotelDTO } from 'app/hotel/hotel.model';


@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hotel-list.component.html'})
export class HotelListComponent implements OnInit, OnDestroy {

  hotelService = inject(HotelService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  hotels?: HotelDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@hotel.delete.success:Hotel was removed successfully.`,
      'hotel.resena.hotel.referenced': $localize`:@@hotel.resena.hotel.referenced:This entity is still referenced by Resena ${details?.id} via field Hotel.`
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
          next: (data) => this.hotels = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
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
