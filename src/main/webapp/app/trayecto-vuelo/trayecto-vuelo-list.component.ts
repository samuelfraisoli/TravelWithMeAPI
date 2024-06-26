import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { TrayectoVueloService } from 'app/trayecto-vuelo/trayecto-vuelo.service';
import { TrayectoVueloDTO } from 'app/trayecto-vuelo/trayecto-vuelo.model';
import { PaginationService } from 'app/pagination/pagination-service';


@Component({
  selector: 'app-trayecto-vuelo-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './trayecto-vuelo-list.component.html'})
export class TrayectoVueloListComponent implements OnInit, OnDestroy {

  trayectoVueloService = inject(TrayectoVueloService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  paginationService = inject(PaginationService)
  flightSegments?: TrayectoVueloDTO[];
  navigationSubscription?: Subscription;

  currentPage: number = 1;
  totalPages: number = 1;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:¿Quieres eliminar el elemento?.`,
      deleted: $localize`:@@trayectoVuelo.delete.success:Trayecto de vuelo eliminado correctamente.`    };
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
            this.paginationService.setItems(data, 10);
            this.loadPage(1);
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

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
