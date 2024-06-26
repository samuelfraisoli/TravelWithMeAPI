import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { AeropuertoService } from 'app/aeropuerto/aeropuerto.service';
import { AeropuertoDTO } from 'app/aeropuerto/aeropuerto.model';
import { PaginationService } from 'app/pagination/pagination-service';


@Component({
  selector: 'app-aeropuerto-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './aeropuerto-list.component.html'})
export class AeropuertoListComponent implements OnInit, OnDestroy {

  aeropuertoService = inject(AeropuertoService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  paginationService = inject(PaginationService)
  airports?: AeropuertoDTO[];
  navigationSubscription?: Subscription;

  currentPage: number = 1;
  totalPages: number = 1;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:¿Quieres eliminar este elemento?.`,
      deleted: $localize`:@@aeropuerto.delete.success:Aeropuerto eliminado correctamente.`,
      'aeropuerto.trayectoVuelo.origen.referenced': $localize`:@@aeropuerto.trayectoVuelo.origen.referenced:Esta entidad todavía está referenciada por Trayecto Vuelo ${details?.id} a través del campo Origen.`,
      'aeropuerto.trayectoVuelo.destino.referenced': $localize`:@@aeropuerto.trayectoVuelo.destino.referenced:Esta entidad todavía está referenciada por Trayecto Vuelo ${details?.id} a través del campo Destino.`
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
          next: (data) => {
            this.paginationService.setItems(data, 10);
            this.loadPage(1);
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  loadPage(page: number): void {
    const paginatedResult = this.paginationService.getPage<AeropuertoDTO>(page);
    this.airports = paginatedResult.items;
    this.currentPage = paginatedResult.currentPage;
    this.totalPages = paginatedResult.totalPages;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      const paginatedResult = this.paginationService.nextPage<AeropuertoDTO>();
      this.airports = paginatedResult.items;
      this.currentPage = paginatedResult.currentPage;
      this.totalPages = paginatedResult.totalPages;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      const paginatedResult = this.paginationService.previousPage<AeropuertoDTO>();
      this.airports = paginatedResult.items;
      this.currentPage = paginatedResult.currentPage;
      this.totalPages = paginatedResult.totalPages;
    }
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
