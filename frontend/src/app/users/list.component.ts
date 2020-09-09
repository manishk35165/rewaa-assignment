import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { ProductService } from '@app/_services/product.service';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {

    products = null;
    constructor(private accountService: AccountService, private productService: ProductService) {}

    ngOnInit() {
        this.productService.getAll()
            .subscribe(products => {
                this.products = products;
            });        
    }

    delete(id: string) {
        const p = this.products.find(x => x.id === id);
        p.isDeleting = true;
        this.productService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.products = this.products.filter(x => x.id !== id) 
            });
    }
}