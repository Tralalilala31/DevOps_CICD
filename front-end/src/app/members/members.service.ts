import { Injectable } from '@angular/core';
import { Member } from '../models/member.model';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  
  private apiUrl = environment.apiUrl + "/users";

  constructor(private http: HttpClient) {}

getMembers(): Observable<{ data: { users: Member[] } }> {
  return this.http.get<{ data: { users: Member[] } }>(`${this.apiUrl}`);
}


getMemberById(id: string): Observable<Member> {
  return this.http.get<{ success: boolean, message: string, data: Member }>(`${this.apiUrl}/${id}`)
    .pipe(map(res => res.data));
}


addMember(member: Member): Observable<Member> {
  return this.http.post<Member>(this.apiUrl, member);
}

updateMember(id: string, member: Member): Observable<Member> {
  return this.http.put<Member>(`${this.apiUrl}/${id}`, member);
}

deleteMember(id: string): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}

}
