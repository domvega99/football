import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { LeagueService } from '../../../services/league.service';
import { FriendlyMatchService } from '../../../services/friendly-match.service';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.sass'
})
export class MatchesComponent {

  leagueMatches: any[] = [];
  leagueId: number | null = null;
  imagePath: string | null = null;

  constructor(
    private leagueService: LeagueService,
    private friendlyMatchService: FriendlyMatchService,
    private configService: ApiService,
  ) {}

  ngOnInit(): void {
    this.imagePath = `${this.configService.URL_IMAGE}`;
    this.getLeagueTeams();
  }

  getLeagueTeams() {
    this.leagueService.getLeagueMatches().subscribe({
      next: (leagueRes: any[]) => {
        this.leagueId = leagueRes.length > 0 ? leagueRes[0].id : null;
        if (this.leagueId) {
          this.friendlyMatchService.getFriendlyMatchesByLeague(this.leagueId).subscribe({
            next: (friendlyRes: any[]) => {
              // This will hold the matches that will be displayed
              this.leagueMatches = leagueRes.map((league: any) => {
                return {
                  ...league,
                  matches: league.matches
                    .filter((matchDay: any) =>
                      matchDay.matches.some((match: any) => match.status !== 'Completed')
                    )
                    .map((matchDay: any) => {
                      // League matches for the current match day
                      let leagueMatchesToDisplay = matchDay.matches
                        .filter((match: any) => match.status === 'Posted' || match.status === 'Live')
                        .map((match: any) => {
                          return {
                            ...match,
                            scores: match.scores?.map((score: any) => {
                              return {
                                ...score,
                                playerScores: score.playerScores?.sort((a: any, b: any) => {
                                  if (a.minutes !== b.minutes) {
                                    return b.minutes - a.minutes;
                                  }
                                  return b.seconds - a.seconds; 
                                })
                              };
                            })
                          };
                        });

                      // Friendly matches for the current match day
                      let friendlyMatchesForDay = friendlyRes
                        .filter((friendlyMatch: any) => 
                          new Date(friendlyMatch.match_date).toDateString() === 
                          new Date(matchDay.match_date).toDateString()
                        )
                        .filter((friendlyMatch: any) => friendlyMatch.status === 'Posted' || friendlyMatch.status === 'Live');

                      // Combine league and friendly matches for the current day
                      const combinedMatches = [...leagueMatchesToDisplay, ...friendlyMatchesForDay];

                      return {
                        ...matchDay,
                        matches: combinedMatches // Keep all matches for this day for now
                      };
                    })
                    .filter((matchDay: any) => matchDay.matches.length > 0) // Only keep match days with matches
                };
              }).filter((league: any) => league.matches.length > 0); // Only keep leagues with match days

              // Logic to limit total matches to 5 across match days
              let totalMatchesToDisplay = 5;
              this.leagueMatches.forEach(league => {
                league.matches.forEach((matchDay: any) => {
                  if (totalMatchesToDisplay > 0) {
                    const matchesToDisplay = matchDay.matches.slice(0, totalMatchesToDisplay);
                    matchDay.matches = matchesToDisplay; // Update matchDay to hold only matches to display
                    totalMatchesToDisplay -= matchesToDisplay.length; // Decrease the totalMatchesToDisplay
                  } else {
                    matchDay.matches = []; // Clear matches if limit reached
                  }
                });
              });

              // Filter out any empty match days
              this.leagueMatches = this.leagueMatches.map(league => ({
                ...league,
                matches: league.matches.filter((matchDay: any) => matchDay.matches.length > 0)
              })).filter(league => league.matches.length > 0);

              console.log(this.leagueMatches);
            },
            error: (err: any) => {
              console.log('Error fetching friendly matches:', err);
            }
          });
        }
      },
      error: (err) => {
        console.log('Error fetching league matches:', err);
      }
    });
  }

  // getLeagueTeams() {
  //   this.leagueService.getLeagueMatches().subscribe({
  //     next: (leagueRes: any[]) => {
  //       this.leagueId = leagueRes.length > 0 ? leagueRes[0].id : null;
  //       if (this.leagueId) {
  //         this.friendlyMatchService.getFriendlyMatchesByLeague(this.leagueId).subscribe({
  //           next: (friendlyRes: any[]) => {
  //             this.leagueMatches = leagueRes.map((league: any) => {
  //               return {
  //                 ...league,
  //                 matches: league.matches
  //                   .filter((matchDay: any) =>
  //                     matchDay.matches.some((match: any) => match.status !== 'Completed')
  //                   )
  //                   .map((matchDay: any) => {
  //                     // League matches for the current match day
  //                     let leagueMatchesToDisplay = matchDay.matches
  //                       .filter((match: any) => match.status === 'Posted' || match.status === 'Live')
  //                       .map((match: any) => {
  //                         return {
  //                           ...match,
  //                           scores: match.scores?.map((score: any) => {
  //                             return {
  //                               ...score,
  //                               playerScores: score.playerScores?.sort((a: any, b: any) => {
  //                                 if (a.minutes !== b.minutes) {
  //                                   return b.minutes - a.minutes;
  //                                 }
  //                                 return b.seconds - a.seconds; 
  //                               })
  //                             };
  //                           })
  //                         };
  //                       });

  //                     // Friendly matches for the current match day
  //                     let friendlyMatchesForDay = friendlyRes
  //                       .filter((friendlyMatch: any) => 
  //                         new Date(friendlyMatch.match_date).toDateString() === 
  //                         new Date(matchDay.match_date).toDateString()
  //                       )
  //                       .filter((friendlyMatch: any) => friendlyMatch.status === 'Posted' || friendlyMatch.status === 'Live');

  //                     // Combine league and friendly matches for the current day
  //                     const combinedMatches = [...leagueMatchesToDisplay, ...friendlyMatchesForDay];

  //                     // Limit to 5 matches per day
  //                     const matchesToDisplay = combinedMatches.slice(0, 5);

  //                     return {
  //                       ...matchDay,
  //                       matches: matchesToDisplay
  //                     };
  //                   })
  //                   .filter((matchDay: any) => matchDay.matches.length > 0) // Only keep match days with matches
  //               };
  //             }).filter((league: any) => league.matches.length > 0); // Only keep leagues with match days

  //             console.log(this.leagueMatches);
  //           },
  //           error: (err: any) => {
  //             console.log('Error fetching friendly matches:', err);
  //           }
  //         });
  //       }
  //     },
  //     error: (err) => {
  //       console.log('Error fetching league matches:', err);
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
