import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MembersService } from '../members.service';

@Component({
  standalone: true,
  selector: 'app-members-add',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './members-add.component.html',
  styleUrls: ['./members-add.component.css']
})
export class MembersAddComponent {
  memberForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private membersService: MembersService
  ) {
    this.memberForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.memberForm.valid) {
      this.membersService.addMember(this.memberForm.value).subscribe({
        next: () => this.router.navigate(['/members']),
        error: (err) => console.error('Erreur ajout membre :', err)
      });
    }
  }
}
