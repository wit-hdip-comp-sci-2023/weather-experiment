import axios from "axios";

export const dashboardController = {
  async index(request, response) {
    const viewData = {
      title: "Template Application",
    };
    console.log("dashboard rendering");
    response.render("dashboard-view", viewData);
  },

  async addreport(request, response) {
    console.log("rendering new report");
    let report = {};
    const lat = request.body.lat;
    const lng = request.body.lng;
    const requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=metric&appid=YOUR-API-KEY`
    const result = await axios.get(requestUrl);
    if (result.status == 200) {
      const reading = result.data.current;
      report.code = reading.weather[0].id;
      report.temperature = reading.temp;
      report.windSpeed = reading.wind_speed;
      report.pressure = reading.pressure;
      report.windDirection = reading.wind_deg;

      report.tempTrend = [];
      report.trendLabels = [];
      const trends = result.data.daily;
      for (let i=0; i<trends.length; i++) {
        report.tempTrend.push(trends[i].temp.day);
        const date = new Date(trends[i].dt * 1000);
        report.trendLabels.push(`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}` );
      }
    }
    console.log(report);
    const viewData = {
      title: "Weather Report",
      reading: report
    };
    response.render("dashboard-view", viewData);
  }
};
