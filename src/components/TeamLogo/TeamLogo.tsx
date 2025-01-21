import React from "react";
import { Box, Image } from "@chakra-ui/react";
import dbacksLogo from "../../img/dbacks.png";
import angelsLogo from "../../img/angels.png";
import bravesLogo from "../../img/braves.png";
import oriolesLogo from "../../img/orioles.png";
import redsoxLogo from "../../img/redsox.png";
import cubsLogo from "../../img/cubs.png";
import redsLogo from "../../img/reds.png";
import guardiansLogo from "../../img/guardians.png";
import rockiesLogo from "../../img/rockies.png";
import tigersLogo from "../../img/tigers.png";
import astrosLogo from "../../img/astros.png";
import royalsLogo from "../../img/royals.png";
import dodgersLogo from "../../img/dodgers.png";
import marlinsLogo from "../../img/marlins.png";
import brewersLogo from "../../img/brewers.png";
import twinsLogo from "../../img/twins.png";
import metsLogo from "../../img/mets.png";
import yankeesLogo from "../../img/yankees.png";
import athleticsLogo from "../../img/athletics.png";
import philliesLogo from "../../img/phillies.png";
import piratesLogo from "../../img/pirates.png";
import padresLogo from "../../img/padres.png";
import marinersLogo from "../../img/mariners.png";
import giantsLogo from "../../img/giants.png";
import cardinalsLogo from "../../img/cardinals.png";
import raysLogo from "../../img/rays.png";
import rangersLogo from "../../img/rangers.png";
import bluejaysLogo from "../../img/bluejays.png";
import whitesoxLogo from "../../img/whitesox.png";
import natsLogo from "../../img/nats.png";

type TeamLogoProps = {
    teamId: number;
};

const TEAM_LOGOS: Record<number, string> = {
    109: dbacksLogo,
    144: bravesLogo,
    110: oriolesLogo,
    111: redsoxLogo,
    112: cubsLogo,
    113: redsLogo,
    114: guardiansLogo,
    115: rockiesLogo,
    116: tigersLogo,
    117: astrosLogo,
    118: royalsLogo,
    108: angelsLogo,
    119: dodgersLogo,
    146: marlinsLogo,
    158: brewersLogo,
    142: twinsLogo,
    121: metsLogo,
    147: yankeesLogo,
    133: athleticsLogo,
    143: philliesLogo,
    134: piratesLogo,
    135: padresLogo,
    136: marinersLogo,
    137: giantsLogo,
    138: cardinalsLogo,
    139: raysLogo,
    140: rangersLogo,
    141: bluejaysLogo,
    145: whitesoxLogo,
    120: natsLogo,
};

const TeamLogo: React.FC<TeamLogoProps> = ({ teamId }) => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" mt="4">
            <Image
                src={TEAM_LOGOS[teamId]}
                alt="Team Logo"
                boxSize="80px"
                objectFit="contain"
            />
        </Box>
    );
};

export default TeamLogo;
