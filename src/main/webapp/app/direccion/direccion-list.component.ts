import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { DireccionService } from 'app/direccion/direccion.service';
import { DireccionDTO } from 'app/direccion/direccion.model';


@Component({
  selector: 'app-direccion-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './direccion-list.component.html'})
export class DireccionListComponent implements OnInit, OnDestroy {

  direccionService = inject(DireccionService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  direccions?: DireccionDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@direccion.delete.success:Direccion was removed successfully.`,
      'direccion.hotel.direccion.referenced': $localize`:@@direccion.hotel.direccion.referenced:This entity is still referenced by Hotel ${details?.id} via field Direccion.`
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
    this.direccionService.getAllDireccions()
        .subscribe({
          next: (data) => this.direccions = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (confirm(this.getMessage('confirm'))) {
      this.direccionService.deleteDireccion(id)
          .subscribe({
            next: () => this.router.navigate(['/direccions'], {
              state: {
                msgInfo: this.getMessage('deleted')
              }
            }),
            error: (error) => {
              if (error.error?.code === 'REFERENCED') {
                const messageParts = error.error.message.split(',');
                this.router.navigate(['/direccions'], {
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
