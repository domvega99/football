import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScoreUpdateService {
  private scoreUpdatedSource = new Subject<void>();

  scoreUpdated$ = this.scoreUpdatedSource.asObservable();

  notifyScoreUpdated() {
    this.scoreUpdatedSource.next();
  }
}
