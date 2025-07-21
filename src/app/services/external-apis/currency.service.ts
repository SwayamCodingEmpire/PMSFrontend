import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CurrencyOptionPayload } from '../../models/CurrencyOptionPayload';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private apiUrl = 'https://api.currencyfreaks.com/v2.0/currency-symbols'; // 🔁 Replace with your actual API

  constructor(private http: HttpClient) {}

 getCurrencyOptions(): Observable<CurrencyOptionPayload[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        const currencySymbols = response.currencySymbols || {};
        return Object.entries(currencySymbols).map(([abbr, name]) => ({
          abbr,
          value: `${abbr} - ${name}`
        }));
      })
    );
  }
}
