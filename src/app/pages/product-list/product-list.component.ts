import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product.service'
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Product } from 'src/app/models/product.model';
import { ProductDetailsComponent } from 'src/app/components/product-details/product-details.component';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'hardskills-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  displayedColumns: string[] = ['title', 'price', 'rating', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  dataSource = new MatTableDataSource();

  constructor(private productService: ProductService, public dialog: MatDialog, public router: Router) { }

  ngOnInit(): void {
    this.productService.getProductList()
      .then(res => res.json())
      .then(json => {
        this.products = json;
        this.products.forEach(product => product.quantity = 1)
        this.dataSource.data = [...this.products]
      })
  }

  addToCart(product: Product): void {
    this.productService.addToCart(product);
  }

  viewProduct(product: Product): void {
    this.dialog.open(ProductDetailsComponent, {
      width: '50rem',
      data: { product: product },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator ?? null;
    this.dataSource.sort = this.sort ?? null;
  }
}
