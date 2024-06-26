import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { DireccionService } from 'app/direccion/direccion.service';
import { DireccionDTO } from 'app/direccion/direccion.model';
import { PaginationService } from 'app/pagination/pagination-service';


@Component({
  selector: 'app-direccion-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './direccion-list.component.html'})
export class DireccionListComponent implements OnInit, OnDestroy {

  direccionService = inject(DireccionService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  paginationService = inject(PaginationService)
  addresses?: DireccionDTO[];
  navigationSubscription?: Subscription;

  currentPage: number = 1;
  totalPages: number = 1;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:¿Quieres eliminar este elemento?`,
      deleted: $localize`:@@direccion.delete.success:Direccion eliminada correctamente.`,
      'direccion.hotel.direccion.referenced': $localize`:@@direccion.hotel.direccion.referenced:Esta entidad está referenciada por Hotel ${details?.id} por el campo Dirección.`
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
          next: (data) => {
            this.paginationService.setItems(data, 10);
            this.loadPage(1);
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  loadPage(page: number): void {
    const paginatedResult = this.paginationService.getPage<DireccionDTO>(page);
    this.addresses = paginatedResult.items;
    this.currentPage = paginatedResult.currentPage;
    this.totalPages = paginatedResult.totalPages;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      const paginatedResult = this.paginationService.nextPage<DireccionDTO>();
      this.addresses = paginatedResult.items;
      this.currentPage = paginatedResult.currentPage;
      this.totalPages = paginatedResult.totalPages;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      const paginatedResult = this.paginationService.previousPage<DireccionDTO>();
      this.addresses = paginatedResult.items;
      this.currentPage = paginatedResult.currentPage;
      this.totalPages = paginatedResult.totalPages;
    }
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
