import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { VueloService } from 'app/vuelo/vuelo.service';
import { VueloDTO } from 'app/vuelo/vuelo.model';
import { PaginationService } from 'app/pagination/pagination-service';


@Component({
  selector: 'app-vuelo-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './vuelo-list.component.html'})
export class VueloListComponent implements OnInit, OnDestroy {

  vueloService = inject(VueloService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  paginationService = inject(PaginationService)
  vueloes?: VueloDTO[];
  navigationSubscription?: Subscription;

  
  currentPage: number = 1;
  totalPages: number = 0;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:¿Quieres eliminar el elemento?`,
      deleted: $localize`:@@vuelo.delete.success:Vuelo eliminado correctamente.`,
      'vuelo.trayectoVuelo.vuelo.referenced': $localize`:@@vuelo.trayectoVuelo.vuelo.referenced:Esta entidad todavía tiene una referencia a Trayecto Vuelo ${details?.id} a través del campo Vuelo.`
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
    this.vueloService.getAllVueloes()
        .subscribe({
          //next: (data) => this.vueloes = data,
          next: (data) => {
            this.paginationService.setItems(data, 10);
            this.loadPage(1);
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  loadPage(page: number): void {
    const paginatedResult = this.paginationService.getPage<VueloDTO>(page);
    this.vueloes = paginatedResult.items;
    this.currentPage = paginatedResult.currentPage;
    this.totalPages = paginatedResult.totalPages;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      const paginatedResult = this.paginationService.nextPage<VueloDTO>();
      this.vueloes = paginatedResult.items;
      this.currentPage = paginatedResult.currentPage;
      this.totalPages = paginatedResult.totalPages;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      const paginatedResult = this.paginationService.previousPage<VueloDTO>();
      this.vueloes = paginatedResult.items;
      this.currentPage = paginatedResult.currentPage;
      this.totalPages = paginatedResult.totalPages;
    }
  }

  confirmDelete(id: number) {
    if (confirm(this.getMessage('confirm'))) {
      this.vueloService.deleteVuelo(id)
          .subscribe({
            next: () => this.router.navigate(['/vuelos'], {
              state: {
                msgInfo: this.getMessage('deleted')
              }
            }),
            error: (error) => {
              if (error.error?.code === 'REFERENCED') {
                const messageParts = error.error.message.split(',');
                this.router.navigate(['/vuelos'], {
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
