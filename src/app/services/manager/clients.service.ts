import { Injectable } from '@angular/core';
import { environment } from '../../../Environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerPayload } from '../../models/CustomerPayload';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private baseUrl = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) { }

getAllClients(): Observable<CustomerPayload[]> {
  return this.http.get<CustomerPayload[]>(`${this.baseUrl}/all`);
}

}
