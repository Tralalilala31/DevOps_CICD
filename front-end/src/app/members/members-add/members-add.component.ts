import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-members-add',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './members-add.component.html',
  styleUrls: ['./members-add.component.css']
})
export class MembersAddComponent {
  memberForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.memberForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.memberForm.valid) {
      const memberData = this.memberForm.value;
      console.log('Member à ajouter :', memberData);
      // TODO: envoyer via le service
      this.router.navigate(['/members']);
    }
  }
}
