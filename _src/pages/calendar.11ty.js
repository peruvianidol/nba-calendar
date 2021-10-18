class Games {
  data() {
    return {
      "layout": "base",
      "permalink": "/calendar/index.html",
    };
  }

  async render(data) {
    let games = data.nba;
    let months = ["October 2021", "November 2021", "December 2021", "January 2022", "February 2022", "March 2022", "April 2022"];
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
        output += '<td>' + d.getDate() + '</td>';
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

    return output;

  }
}

module.exports = Games;