interface Team {
    id: number;
    name: string;
    probable_pitcher: {
        name: string;
    };
    runs: number[];
    total_runs: number;
}

export interface Game {
    game_date: string;
    away_team: Team;
    home_team: Team;
}



