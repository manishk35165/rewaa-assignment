import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ProductService } from '@app/_services/product.service';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private productService: ProductService,
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        
        // password not required in edit mode
        const passwordValidators = [Validators.minLength(6)];
        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
        }

        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            price: ['', Validators.required],
            quantity: ['', Validators.required],
            description: ['', Validators.required]
        });

        if (!this.isAddMode) {
            this.productService.getById(this.id)
                .pipe(first())
                .subscribe(response => {
                    const r = response[0];
                    this.f.name.setValue(r.name);
                    this.f.price.setValue(r.price);
                    this.f.quantity.setValue(r.quantity);
                    this.f.description.setValue(r.description);
                });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createProduct();
        } else {
            this.updateProduct();
        }
    }

    private createProduct() {
        this.productService.addNew(this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    alert('Product created successfully.');
                    this.router.navigate(['.', { relativeTo: this.route }]);
                },
                error => {
                    alert(error);
                    this.loading = false;
                });
    }

    private updateProduct() {
        this.productService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    alert('Product updated successfully.');
                    this.router.navigate(['..', { relativeTo: this.route }]);
                },
                error => {
                    alert(error);
                    this.loading = false;
                });
    }
}