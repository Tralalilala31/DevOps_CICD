import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MembersService } from '../members.service';

@Component({
  standalone: true,
  selector: 'app-members-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './members-edit.component.html',
  styleUrls: ['./members-edit.component.css']
})
export class MembersEditComponent implements OnInit {
  memberForm!: FormGroup;
  memberId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private membersService: MembersService
  ) {}

ngOnInit(): void {
  this.memberId = this.route.snapshot.paramMap.get('id')!;
  this.memberForm = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

this.membersService.getMemberById(this.memberId).subscribe({
  next: (member) => {
    this.memberForm.patchValue(member);
  },

    error: (err) => console.error('Erreur chargement membre :', err)
  });
}


  onSubmit(): void {
    if (this.memberForm.valid) {
      this.membersService.updateMember(this.memberId, this.memberForm.value).subscribe({
        next: () => this.router.navigate(['/members']),
        error: (err) => console.error('Erreur mise à jour :', err)
      });
    }
  }
}
