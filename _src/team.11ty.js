const fetchTeamData = require('./utils/nba');

class Games {
  data(data) {
    return {
      pagination: {
        data: 'teams',
        size: 1,
        alias: 'team',
      },
      eleventyComputed: {
        "title": (data) => `${data.team.city} ${data.team.name} 2024-25 Schedule`,
      },
      "image": (data) => `${this.slug(data.team.name)}`,
      "layout": "calendar",
      "permalink": function (data) {
        return `/${this.slug(data.team.name)}/index.html`;
      }
    };
  }

  async render(data) {
    const games = await fetchTeamData(data.team.abbr);
    let months = ["October 2024", "November 2024", "December 2024", "January 2025", "February 2025", "March 2025", "April 2025"];
    const dataMap = new Map();
    for (const game of games) {
      dataMap.set(game.date, game);
    }
    let preseason = true;
    let count = 0;
    let output = '';
    
    for (let i=0; i<months.length; i++) {
      let d = new Date(months[i]);
      let mon = d.getMonth();

      output += `<table>
      <caption>${months[i]}</caption>
      <tr>
        <th>Sun</th>
        <th>Mon</th>
        <th>Tue</th>
        <th>Wed</th>
        <th>Thu</th>
        <th>Fri</th>
        <th>Sat</th>
      </tr>
      <tr>`;

      for (let n=0; n< d.getDay(); n++) {
        output += `<td></td>`;
      }

      while (d.getMonth() === mon) {
        if (count > 4) {
          preseason = false;
        }
        const game = dataMap.get(d.toISOString().split('T')[0]);
        if (game) {
          output += `<td class=${game.location}`;
          if (preseason) {
            output += ' data-preseason="true"';
          }
          if (game.time === "Invalid Date") {
            game.time = "TBD";
          }
          output += `><p class="date">${d.getDate()}</p>`;
          output += `<figure class="game"><div data-opponent="${game.name}">${this.svg(game.name.toLowerCase().replace(/\s/g, '-'), "opponent")}</div>`;
          if (game.result) {
            output += `<figcaption><p class="result">${game.result} ${game.score}</p></figcaption>`;
          } else {
            output += `<figcaption><p class="tv">${game.tv}</p><p class="time">${game.time}</p></figcaption>`;
            // output += `<figcaption><p>${this.svg(game.tv.toLowerCase().replace(/\s/g, '-'), "tv")}</p><p class="time">${game.time}</p></figcaption>`;
          }
          output += `</figure>`;
          output += `</td>`;
          count++;
        } else {
          output += `<td><p class="date">${d.getDate()}</p></td>`;
        }
        if (d.getDay() % 7 === 6) {
          output += '</tr><tr>';
        }
        d.setDate(d.getDate() + 1);
      }

      if (d.getDay() != 0) {
        for (let n = d.getDay(); n < 7; n++) {
          output += '<td></td>';
        }
      }

      output += `</tr></table>`;
    }
    // console.log(games[0]);
    return output;

  }
}

module.exports = Games;
