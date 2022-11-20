import { Component, OnInit } from '@angular/core';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { DataState } from './enums/data-state.enum';
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

  constructor(private serverService: ServerService) { }

  ngOnInit(): void {
    this.appState$ = this.serverService.servers$
      .pipe(
        map(res => {
          return { dataState: DataState.LOADED_STATE, appDate: res }
        }),
        startWith({ dataState: DataState.LOADING_STATE }),
        catchError((err: string) => {
          return of({ dataState: DataState.ERROR_STATE, error: err });
        })
      )
  }


}
