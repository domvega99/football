import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { LeagueService } from '../../../services/league.service';
import { MatchService } from '../../../services/match.service';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.sass'
})
export class MatchesComponent {

  fixtures: any[] = [];
  imagePath: string | null = null;

  constructor(
    private matchService: MatchService,
    private configService: ApiService,
  ) {}

  ngOnInit(): void {
    this.imagePath = `${this.configService.URL_IMAGE}`;
    this.getLeagueTeams();
  }

  getLeagueTeams() {
    this.matchService.getFixtureMatches().subscribe({
      next: (res: any) => {
        this.fixtures = res; 
      },
      error: (err: any) => {

      }
    })
  }

  // getLeagueTeams() {
  //   this.leagueService.getLeagueMatches().subscribe({
  //     next: (res: any[]) => {
  //       let totalDisplayedMatches = 0;
  //       this.leagueMatches = res.map((league: any) => {
  //         return {
  //           ...league,
  //           matches: league.matches
  //             .filter((matchDay: any) => 
  //               matchDay.matches.some((match: any) => match.status !== 'Completed')
  //             )
  //             .map((matchDay: any) => {
  //               const remainingMatches = 5 - totalDisplayedMatches;
  //               const matchesToDisplay = matchDay.matches
  //                 .filter((match: any) => match.status === 'Posted' || match.status === 'Live')
  //                 .slice(0, remainingMatches)
  //                 .map((match: any) => {
  //                   return {
  //                     ...match,
  //                     scores: match.scores.map((score: any) => {
  //                       return {
  //                         ...score,
  //                         playerScores: score.playerScores.sort((a: any, b: any) => {
  //                           if (a.minutes !== b.minutes) {
  //                             return b.minutes - a.minutes;
  //                           }
  //                           return b.seconds - a.seconds; 
  //                         })
  //                       };
  //                     })
  //                   };
  //                 });
    
  //               totalDisplayedMatches += matchesToDisplay.length;
    
  //               return {
  //                 ...matchDay,
  //                 matches: matchesToDisplay
  //               };
  //             })
  //             .filter((matchDay: any) => matchDay.matches.length > 0)

              
  //         };
  //       }).filter((league: any) => league.matches.length > 0);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     }
  //   });
  // }


  // getLeagueTeams() {
  //   this.leagueService.getLeagueMatches().subscribe({
  //     next: (res: any[]) => {
  //       let totalDisplayedMatches = 0;
  //       this.leagueMatches = res.map((league: any) => {
  //         return {
  //           ...league,
  //           matches: league.matches
  //             .filter((matchDay: any) => 
  //               matchDay.matches.some((match: any) => match.status !== 'Completed')
  //             )
  //             .map((matchDay: any) => {
  //               const remainingMatches = 5 - totalDisplayedMatches;
  //               const matchesToDisplay = matchDay.matches
  //                 .filter((match: any) => match.status === 'Posted' || match.status === 'Live')
  //                 .slice(0, remainingMatches);
  
  //               totalDisplayedMatches += matchesToDisplay.length;
  
  //               return {
  //                 ...matchDay,
  //                 matches: matchesToDisplay
  //               };
  //             })
  //             .filter((matchDay: any) => matchDay.matches.length > 0) 
  //         };
  //       }).filter((league: any) => league.matches.length > 0); 
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     }
  //   });
  // }  
}
