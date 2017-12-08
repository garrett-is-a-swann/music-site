import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {
    private BASE_URL: string = 'http://localhost:3000/api'
    private headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

    constructor(private http: HttpClient) { }

    login(user): Promise<any> {
        let url: string = `${this.BASE_URL}/authenticate`;
        return this.http.post(url, user, {headers: this.headers}).toPromise();
    }

    register(user): Promise<any> {
        let url: string = `${this.BASE_URL}/register`;
        return this.http.post(url, user, {headers: this.headers}).toPromise();
    }
}
