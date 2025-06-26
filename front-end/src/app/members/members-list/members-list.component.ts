import { Component, OnInit } from '@angular/core';
import { MembersService } from '../members.service';
import { Member } from '../../models/member.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-members-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css']
})
export class MembersListComponent implements OnInit {
  members: Member[] = [];

  constructor(private membersService: MembersService) {}

  ngOnInit(): void {
    this.loadMembers();
  }

loadMembers(): void {
  this.membersService.getMembers().subscribe({
    next: (res) => {
      console.log('📦 Données reçues de l\'API :', res);
      this.members = res.data.users; // ✅ C’est ici qu’il faut cibler
    },
    error: (err) => console.error('Erreur chargement membres :', err)
  });
}



  deleteMember(id: string): void {
    this.membersService.deleteMember(id).subscribe({
      next: () => this.loadMembers(),
      error: (err) => console.error('Erreur suppression membre :', err)
    });
  }
}
