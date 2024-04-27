import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { VueloService } from 'app/vuelo/vuelo.service';
import { VueloDTO } from 'app/vuelo/vuelo.model';


@Component({
  selector: 'app-vuelo-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './vuelo-list.component.html'})
export class VueloListComponent implements OnInit, OnDestroy {

  vueloService = inject(VueloService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  vueloes?: VueloDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@vuelo.delete.success:Vuelo was removed successfully.`,
      'vuelo.trayectoVuelo.vuelo.referenced': $localize`:@@vuelo.trayectoVuelo.vuelo.referenced:This entity is still referenced by Trayecto Vuelo ${details?.id} via field Vuelo.`
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
          next: (data) => this.vueloes = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
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
