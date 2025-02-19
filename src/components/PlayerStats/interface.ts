export interface PlayerStats {
    hitting_stats?: {
        career: {
            games: string;
            at_bats: string;
            hits: string;
            avg: string;
            home_runs: string;
            rbi: string;
            runs: string;
            stolen_bases: string;
            obp: string;
            slg: string;
            ops: string;
        };
        season: {
            games: string;
            at_bats: string;
            hits: string;
            avg: string;
            home_runs: string;
            rbi: string;
            runs: string;
            stolen_bases: string;
            obp: string;
            slg: string;
            ops: string;
        };
    };
    pitching_stats?: {
        career: {
            era: string;
            games: string;
            games_started: string;
            innings_pitched: string;
            losses: string;
            saves: string;
            strikeouts: string;
            walks: string;
            whip: string;
            wins: string;
        };
        season: {
            era: string;
            games: string;
            games_started: string;
            innings_pitched: string;
            losses: string;
            saves: string;
            strikeouts: string;
            walks: string;
            whip: string;
            wins: string;
        };
    };
    career_stats?: {
        era?: string;
        games: string;
        games_started?: string;
        innings_pitched?: string;
        at_bats?: string;
        avg?: string;
        hits?: string;
        home_runs?: string;
        obp?: string;
        ops?: string;
        rbi?: string;
        runs?: string;
        slg?: string;
        losses?: string;
        saves?: string;
        strikeouts?: string;
        walks?: string;
        whip?: string;
        wins?: string;
        stolen_bases?: string;
    };
    season_stats?: {
        era?: string;
        games: string;
        games_started?: string;
        innings_pitched?: string;
        at_bats?: string;
        avg?: string;
        hits?: string;
        home_runs?: string;
        obp?: string;
        ops?: string;
        rbi?: string;
        runs?: string;
        slg?: string;
        losses?: string;
        saves?: string;
        strikeouts?: string;
        walks?: string;
        whip?: string;
        wins?: string;
        stolen_bases?: string;
    };
    player_info: {
        full_name: string;
        age: number;
        position: string;
        current_team: string;
        bat_side: string;
        throw_hand: string;
        birth_date: string;
        images: {
            action: string;
            headshot: string;
        };
    };
    season: string;
}
