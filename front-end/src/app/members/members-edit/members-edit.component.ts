import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-members-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './members-edit.component.html',
  styleUrls: ['./members-edit.component.css']
})

export class MembersEditComponent implements OnInit {
  memberForm!: FormGroup;
  memberId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.memberId = +this.route.snapshot.paramMap.get('id')!;
    // TODO: Remplacer par une requête vers le backend plus tard
    const mockMember = {
      id: this.memberId,
      nom: 'MockNom',
      prenom: 'MockPrenom',
      email: 'mock@email.com'
    };

    this.memberForm = this.fb.group({
      nom: [mockMember.nom, Validators.required],
      prenom: [mockMember.prenom, Validators.required],
      email: [mockMember.email, [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.memberForm.valid) {
      console.log('Membre mis à jour :', this.memberForm.value);
      this.router.navigate(['/members']);
    }
  }
}
