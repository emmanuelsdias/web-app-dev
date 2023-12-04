import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from '../services/data.service';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.form = this.fb.group({
      name: [''],
      email: [''],
    });
  }

  submitForm() {
    this.dataService.postData(this.form.value).subscribe(() => {
      this.form.reset();
    });
  }
}
