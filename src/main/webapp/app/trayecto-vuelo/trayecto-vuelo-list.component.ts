import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { TrayectoVueloService } from 'app/trayecto-vuelo/trayecto-vuelo.service';
import { TrayectoVueloDTO } from 'app/trayecto-vuelo/trayecto-vuelo.model';


@Component({
  selector: 'app-trayecto-vuelo-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './trayecto-vuelo-list.component.html'})
export class TrayectoVueloListComponent implements OnInit, OnDestroy {

  trayectoVueloService = inject(TrayectoVueloService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  trayectoVueloes?: TrayectoVueloDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@trayectoVuelo.delete.success:Trayecto Vuelo was removed successfully.`    };
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
          next: (data) => this.trayectoVueloes = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
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
