import { Injectable } from '@angular/core';
import { Member } from '../models/member.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

    private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

getMembers(): Observable<Member[]> {
  return this.http.get<Member[]>(this.apiUrl);
}

getMemberById(id: string): Observable<Member> {
  return this.http.get<Member>(`${this.apiUrl}/${id}`);
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
