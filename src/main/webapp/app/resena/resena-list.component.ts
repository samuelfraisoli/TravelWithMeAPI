import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { ResenaService } from 'app/resena/resena.service';
import { ResenaDTO } from 'app/resena/resena.model';


@Component({
  selector: 'app-resena-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './resena-list.component.html'})
export class ResenaListComponent implements OnInit, OnDestroy {

  resenaService = inject(ResenaService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  resenas?: ResenaDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@resena.delete.success:Resena was removed successfully.`    };
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
          next: (data) => this.resenas = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
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
