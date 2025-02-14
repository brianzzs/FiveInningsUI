export const TEAM_ABBREVIATIONS: Record<string, string> = {
    "Arizona Diamondbacks": "ARI D-backs",
    "Atlanta Braves": "ATL Braves",
    "Baltimore Orioles": "BAL Orioles",
    "Boston Red Sox": "BOS Red Sox",
    "Chicago Cubs": "CHC Cubs",
    "Cincinnati Reds": "CIN Reds",
    "Cleveland Guardians": "CLE Guardians",
    "Colorado Rockies": "COL Rockies",
    "Detroit Tigers": "DET Tigers",
    "Houston Astros": "HOU Astros",
    "Kansas City Royals": "KC Royals",
    "Los Angeles Angels": "LAA Angels",
    "Los Angeles Dodgers": "LAD Dodgers",
    "Miami Marlins": "MIA Marlins",
    "Milwaukee Brewers": "MIL Brewers",
    "Minnesota Twins": "MIN Twins",
    "New York Mets": "NYM Mets",
    "New York Yankees": "NYY Yankees",
    "Oakland Athletics": "OAK Athletics",
    "Philadelphia Phillies": "PHI Phillies",
    "Pittsburgh Pirates": "PIT Pirates",
    "San Diego Padres": "SD Padres",
    "Seattle Mariners": "SEA Mariners",
    "San Francisco Giants": "SF Giants",
    "St. Louis Cardinals": "STL Cardinals",
    "Tampa Bay Rays": "TB Rays",
    "Texas Rangers": "TEX Rangers",
    "Toronto Blue Jays": "TOR Blue Jays",
    "Chicago White Sox": "CWS White Sox",
    "Washington Nationals": "WSH Nationals",
};

export const getTeamAbbreviation = (fullName: string): string => {
    return TEAM_ABBREVIATIONS[fullName] || fullName;
}; 