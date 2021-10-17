const fetch = require("node-fetch");

module.exports = async () => {
  const games = [];
  const team = "CHI";

  let url = "https://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2021/league/00_full_schedule.json";

  let data = await fetch(url)
    .then(data => data.json());
  data = [...data.lscd.slice(4), ...data.lscd.slice(0, 4)];

  for (const { mscd: { g } } of data) {
    games.push(...g.filter((gameData) => {
      return [gameData.h.ta, gameData.v.ta].includes(team);
    }).map((gameData) => {
      const isHome = gameData.h.ta === team;
      const teamData = isHome ? gameData.h : gameData.v;
      const oppData = isHome ? gameData.v : gameData.h;
      const gDate = new Date(isHome ? gameData.htm : gameData.vtm);
      let result = '';
      if (teamData.s) {
        result = parseInt(teamData.s) > parseInt(oppData.s) ? 'W' : 'L';
      }

      return {
        location: isHome ? 'home' : 'away',
        abbr: oppData.ta,
        name: oppData.tn,
        city: oppData.tc,
        result: result,
        score: `${teamData.s}-${oppData.s}`,
        tv: gameData.bd.b.find(({ scope, type }) => type === 'tv' && ([isHome ? 'home' : 'away', 'natl'].includes(scope)))?.disp,
        date: gameData.gdte,
        time: gDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      };
    }));
  }
  return games;
}