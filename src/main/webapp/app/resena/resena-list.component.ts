import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { ResenaService } from 'app/resena/resena.service';
import { ResenaDTO } from 'app/resena/resena.model';
import { PaginationService } from 'app/pagination/pagination-service';


@Component({
  selector: 'app-resena-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './resena-list.component.html'})
export class ResenaListComponent implements OnInit, OnDestroy {

  resenaService = inject(ResenaService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  paginationService = inject(PaginationService)
  reviews?: ResenaDTO[];
  navigationSubscription?: Subscription;

  currentPage: number = 1;
  totalPages: number = 1;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:¿Quieres eliminar este elemento?`,
      deleted: $localize`:@@resena.delete.success:Reseña eliminada correctamente.`    };
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
    this.resenaService.getAllResenas()
        .subscribe({
          next: (data) => {
            this.paginationService.setItems(data, 10);
            this.loadPage(1);
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  loadPage(page: number): void {
    const paginatedResult = this.paginationService.getPage<ResenaDTO>(page);
    this.reviews = paginatedResult.items;
    this.currentPage = paginatedResult.currentPage;
    this.totalPages = paginatedResult.totalPages;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      const paginatedResult = this.paginationService.nextPage<ResenaDTO>();
      this.reviews = paginatedResult.items;
      this.currentPage = paginatedResult.currentPage;
      this.totalPages = paginatedResult.totalPages;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      const paginatedResult = this.paginationService.previousPage<ResenaDTO>();
      this.reviews = paginatedResult.items;
      this.currentPage = paginatedResult.currentPage;
      this.totalPages = paginatedResult.totalPages;
    }
  }

  confirmDelete(id: number) {
    if (confirm(this.getMessage('confirm'))) {
      this.resenaService.deleteResena(id)
          .subscribe({
            next: () => this.router.navigate(['/resenas'], {
              state: {
                msgInfo: this.getMessage('deleted')
              }
            }),
            error: (error) => this.errorHandler.handleServerError(error.error)
          });
    }
  }

}
