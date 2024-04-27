import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { AeropuertoService } from 'app/aeropuerto/aeropuerto.service';
import { AeropuertoDTO } from 'app/aeropuerto/aeropuerto.model';


@Component({
  selector: 'app-aeropuerto-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './aeropuerto-list.component.html'})
export class AeropuertoListComponent implements OnInit, OnDestroy {

  aeropuertoService = inject(AeropuertoService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  aeropuertoes?: AeropuertoDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@aeropuerto.delete.success:Aeropuerto was removed successfully.`,
      'aeropuerto.trayectoVuelo.origen.referenced': $localize`:@@aeropuerto.trayectoVuelo.origen.referenced:This entity is still referenced by Trayecto Vuelo ${details?.id} via field Origen.`,
      'aeropuerto.trayectoVuelo.destino.referenced': $localize`:@@aeropuerto.trayectoVuelo.destino.referenced:This entity is still referenced by Trayecto Vuelo ${details?.id} via field Destino.`
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
    this.aeropuertoService.getAllAeropuertoes()
        .subscribe({
          next: (data) => this.aeropuertoes = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (confirm(this.getMessage('confirm'))) {
      this.aeropuertoService.deleteAeropuerto(id)
          .subscribe({
            next: () => this.router.navigate(['/aeropuertos'], {
              state: {
                msgInfo: this.getMessage('deleted')
              }
            }),
            error: (error) => {
              if (error.error?.code === 'REFERENCED') {
                const messageParts = error.error.message.split(',');
                this.router.navigate(['/aeropuertos'], {
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
