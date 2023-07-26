import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

  persons: any[] = [];
  connectMessage: string = "";
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    let connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:44351/hub/notification", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect([5000, 10000, 15000, 20000, 25000, 30000])
      .build();

    // connection.on("NewMessageReceived", data => {
    //   console.log(data);
    // });

    connection.on("Get1Client", data => {
      if (data == 'success') {
        this.callAPIGet2();
      }
    });

    connection.start()
      .then(() => this.connectMessage = "Hub Connection Started");
    //.then(() => connection.invoke("NewMessage", "Hello"));
  }

  callAPIGet1(): void {
    this.get1Func().subscribe({
      next: () => { },
      error: (error) => {
        console.log(error);
      }
    });
  }

  callAPIGet2(): void {
    this.get2Func().subscribe({
      next: (res: any[]) => {
        this.persons = res;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  get1Func(): Observable<void> {
    return this.http.get<any>("https://localhost:44351/api/Persons/Get1");
  }

  get2Func(): Observable<string[]> {
    return this.http.get<any[]>("https://localhost:44351/api/Persons/Get2");
  }
}
