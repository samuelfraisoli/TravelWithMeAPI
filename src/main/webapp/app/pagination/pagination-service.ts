import { Injectable } from '@angular/core';
import { Page } from '../pagination/Page-model';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  private items: any[] = [];
  private currentPage: number = 1;
  private pageSize: number = 10;

  /**
   * Initializes the component with objects from an array
   * @param items the array containing the objects
   * @param pageSize the size of rows per page
   */
  setItems<T>(items: T[], pageSize: number): void {
    this.items = items;
    this.pageSize = pageSize;
    this.currentPage = 1; // Reset to the first page when items are set
  }

  /**
   * Divides all the items in the array between the number of pages of the paginable and sets the page selected as the current.
   * @param page the number of the page we want to get
   * @returns the paginable set in the page we want to show
   */
  getPage<T>(page: number = 1): Page<T> {
    const totalItems = this.items.length;
    const totalPages = Math.ceil(totalItems / this.pageSize);

    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    const startIndex = (page - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, totalItems);

    const paginatedItems = this.items.slice(startIndex, endIndex);

    this.currentPage = page;

    return {
      items: paginatedItems,
      currentPage: this.currentPage,
      totalPages,
      totalItems
    };
  }

  nextPage<T>(): Page<T> {
    return this.getPage<T>(this.currentPage + 1);
  }

  previousPage<T>(): Page<T> {
    return this.getPage<T>(this.currentPage - 1);
  }
}
