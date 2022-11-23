import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { DataState } from './enums/data-state.enum';
import { Status } from './enums/status.enum';
import { AppState } from './interface/app-state';
import { CustomeResponse } from './interface/custom-response';
import { ServerService } from './services/server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'sm-frontend';

  appState$!: Observable<AppState<CustomeResponse>>;
  readonly DataState = DataState;
  readonly Status = Status;
  private filterSubject = new BehaviorSubject<string>('');
  filterStatus$ = this.filterSubject.asObservable();
  private dataSubject = new BehaviorSubject<CustomeResponse>({
    statusCode: 0,
    status: '',
    reason: '',
    message: '',
    developerMessage: '',
    timeStamp: new Date('2000-01-01'),
    data: { servers: [] }
  });
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  constructor(private serverService: ServerService) { }

  ngOnInit(): void {
    this.appState$ = this.serverService.servers$
      .pipe(
        map(response => {
          this.dataSubject.next(response);
          return { dataState: DataState.LOADED_STATE, appData: response }
        }),
        startWith({ dataState: DataState.LOADING_STATE }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR_STATE, error: error });
        })
      )
  }




  isClicked: boolean = false;
  isHovered: boolean = false;

  onHover() {
    this.isHovered = !this.isHovered;
  }

  onClick() {
    this.isClicked = !this.isClicked;
  }

  saveServer(serverForm: NgForm) {
    console.log(serverForm);
  }

  pingServer(ipAddress: string): void {
    this.filterSubject.next(ipAddress);
    this.appState$ = this.serverService.ping$(ipAddress)
      .pipe(
        map(response => {
          if (this.dataSubject.value.data.servers && response.data.server) { //because of strict rule
            const index = this.dataSubject.value.data.servers.findIndex(server => server.id == response.data.server?.id);
            this.dataSubject.value.data.servers[index] = response.data.server;
          }
          this.filterSubject.next('');
          console.log(this.dataSubject.value);
          return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
        }),
        startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.filterSubject.next('');
          return of({ dataState: DataState.ERROR_STATE, error: error });
        })
      )
  }


}
