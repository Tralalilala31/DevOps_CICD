import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Member {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

@Component({
  standalone: true,
  selector: 'app-members-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css']
})

export class MembersListComponent {
  members: Member[] = [
    { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@email.com' },
    { id: 2, nom: 'Durand', prenom: 'Claire', email: 'claire.durand@email.com' },
    { id: 3, nom: 'Martin', prenom: 'Luc', email: 'luc.martin@email.com' }
  ];
  
  deleteMember(id: number) {
  console.log('Suppression du membre avec ID :', id);
  // TODO : Appeler le service lorsqu’il sera connecté
}

}
