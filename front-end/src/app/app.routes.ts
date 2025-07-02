import { Routes } from '@angular/router';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { TodoComponent } from './todo/todo.component';
import { WeatherComponent } from './components/weather/weather.component';
import { HangingGameComponent } from './hanging-game/hanging-game.component';
import { MembersListComponent } from './members/members-list/members-list.component';
import { MembersAddComponent } from './members/members-add/members-add.component';
import { MembersEditComponent } from './members/members-edit/members-edit.component';


export const routes: Routes = [{
 path:'tasks', component:DragDropComponent,pathMatch:'full'

},{
  path:'todos',component:TodoComponent,pathMatch:'full'
}, { path: '', redirectTo: 'todos', pathMatch: 'full' },{
  path:'weather',component:WeatherComponent,pathMatch:'full'
},{ path: 'guess-word', component:HangingGameComponent,pathMatch: 'full' },{
  path:'weather',component:WeatherComponent,pathMatch:'full'
},
{
  path: 'members', component: MembersListComponent, pathMatch: 'full'
},
{
  path: 'members/add', component: MembersAddComponent, pathMatch: 'full'
},
{
  path: 'members/edit/:id', component: MembersEditComponent, pathMatch: 'full'
}
];
