// api link
//https://api.covid19api.com/summary
//https://corona.lmao.ninja/v2/all
//https://corona.lmao.ninja/v2/countries
//------------------------------------------------------------

//select global element
const global_cases_element = document.querySelector(".global_cases");
const global_deaths_element = document.querySelector(".global_deaths");
const global_recovered_element = document.querySelector(".global_recovered");
const global_active_element = document.querySelector(".global_active");
const global_country_infected = document.querySelector(".global_country");

//select country element
const flag_element = document.querySelector(".flag");
const country_cases_element = document.querySelector(".country-cases .value");
const country_recovered_element = document.querySelector(
  ".country-recovered .value"
);
const country_deaths_element = document.querySelector(".country-deaths .value");
const country_active_element = document.querySelector(".country-active .value");
const country_name_element = document.querySelector(".country-name");
const country_new_case_el = document.querySelector(".new-cases");
const country_new_deaths_el = document.querySelector(".new-deaths");
const country_new_recovered_el = document.querySelector(".new-recovered");

//chart
const ctx = document.getElementById("axes_line_chart").getContext("2d");

//Variable
let global_list = [],
  country_case_list = [],
  country_recover_list = [],
  country_death_list = [],
  country_active_list = [],
  country_new_case = [],
  country_new_deaths = [],
  country_new_recovered = [],
  formatedDates = [],
  flag_list = [];



var user_country;
country_list.forEach((country) => {
    user_country = country.name;
});

function fetchData(country) {
  user_country = country;

  //reset value
  country_case_list = [];
  country_recover_list = [];
  country_death_list = [];
  country_active_list = [];
  country_new_case = [];
  country_new_deaths = [];
  country_new_recovered = [];
  dates = [];
  formatedDates = [];

  const api_fetch = async (country) => {
    //globally data fetch
    await fetch("https://corona.lmao.ninja/v2/all")
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        global_list.push(data.cases);
        global_list.push(data.active);
        global_list.push(data.deaths);
        global_list.push(data.recovered);
        //console.log(global_list);
      });

    //country data fetch
    await fetch("https://corona.lmao.ninja/v2/countries/" + country)
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        flag_element.setAttribute("src", data.countryInfo.flag);
        country_case_list.push(data.cases);
        country_recover_list.push(data.recovered);
        country_death_list.push(data.deaths);
        country_active_list.push(data.active);
        country_new_case.push(data.todayCases);
        country_new_deaths.push(data.todayDeaths);
        country_new_recovered.push(data.todayRecovered);
        dates.push(data.updated);
      });

    // total number of infected country
    await fetch("https://corona.lmao.ninja/v2/countries/")
      .then((res) => res.json())
      .then((data) => {
        total_country = data.length;
        //console.log(data);
      });

    updateUI();
  };
  api_fetch(country);
}

fetchData(user_country);

function updateUI() {
  updateStats();
  axesLinearChart();
}

function updateStats() {
  //global
  const global_cases = global_list[0];
  const global_active = global_list[1];
  const global_deaths = global_list[2];
  const global_recovered = global_list[3];
  const total_infected_country = total_country;

  //country
  const country_case = country_case_list;
  const country_recover = country_recover_list;
  const country_death = country_death_list;
  const country_active = country_active_list;
  const new_cases = country_new_case;
  const new_deaths = country_new_deaths;
  const new_recovered = country_new_recovered;

  //global
  global_cases_element.innerHTML = global_cases;
  global_active_element.innerHTML = global_active;
  global_deaths_element.innerHTML = global_deaths;
  global_recovered_element.innerHTML = global_recovered;
  global_country_infected.innerHTML = total_infected_country;

  //country
  country_name_element.innerHTML = user_country;
  country_cases_element.innerHTML = country_case;
  country_recovered_element.innerHTML = country_recover;
  country_deaths_element.innerHTML = country_death;
  country_active_element.innerHTML = country_active;
  country_new_case_el.innerHTML = "▲ " + new_cases;
  country_new_deaths_el.innerHTML = "▲ " + new_deaths;
  country_new_recovered_el.innerHTML = "▲ " + new_recovered;

  // format dates
  dates.forEach((date) => {
    formatedDates.push(formatDate(date));
  });
}

// UPDATE CHART
let my_chart;

function axesLinearChart() {
  if (my_chart) {
    my_chart.destroy();
  }

  my_chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: formatedDates,
      datasets: [
        {
          label: "Cases",
          data: country_case_list,
          fill: false,
          borderColor: "#ff073a",
          backgroundColor: "rgba(255, 7, 58,0.5)",
          hoverBackgroundColor: "rgba(255, 7, 58,0.7)",
          borderWidth: 1,
        },
        {
          label: "Recovered",
          data: country_recover_list,
          fill: true,
          borderColor: "#28a745",
          backgroundColor: "rgba(40, 167, 69,0.5)",
          borderWidth: 1,
        },
        {
          label: "Deaths",
          data: country_death_list,
          fill: true,
          borderColor: "#6c757d",
          backgroundColor: "rgba(108, 117, 125,0.5)",
          borderWidth: 1,
        },
        {
          label: "Active",
          data: country_active_list,
          fill: true,
          borderColor: "rgb(40, 85, 167)",
          backgroundColor: "rgba(40, 85, 167,0.5)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

// FORMAT DATES
const monthsNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDate(dateString) {
  let date = new Date(dateString);
  return `${date.getDate()} ${monthsNames[date.getMonth()]}`;
}

//news
const postSection = document.querySelector("#posts");
const postTemplate = document.querySelector("#post-template");

getData();

async function getData() {
  let i = 0;
  let images = null;
  await fetch("https://coronavirus-smartable.p.rapidapi.com/news/v1/global/", {
    method: "GET",
    headers: {
      "x-rapidapi-key": "266e182a1emshafc72f369db5c10p177ccbjsn01dae4d6f2bd",
      "x-rapidapi-host": "coronavirus-smartable.p.rapidapi.com",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      data.news.forEach((post) => {
        console.log(post);
        images = post.images;
        i++;
        if (i < 20 && images != null) {
          const title = post.title;
          const body = post.excerpt;
          const img = post.images[0].url;
          //const date = post.publishedDateTime;

          const newPost = document.importNode(postTemplate.content, true);
          const postTitle = newPost.querySelector(".post_title");
          const postBody = newPost.querySelector(".post_body");
          const postImg = newPost.querySelector(".post_img");
          //const postDate = newPost.querySelector('.post_date');

          // throw 'Image Fetch Error';

          postImg.src = img;
          postTitle.innerText = title;
          postBody.innerText = body;
          // postDate.innerText = date;
          postSection.appendChild(newPost);
        }
      });
    });

  // throw 'Get Data Error';
  // console.log(posts);
}

//------------------------------------------------------------------//

//tabbed
function openTab(evt, tabname) {
  var i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabname).style.display = "block";
  evt.currentTarget.className += " active";
}

//testing other api code
// async function test(){
//   await fetch("https://google-news.p.rapidapi.com/v1/search?q=covid&country=IN&lang=en", {
//     "method": "GET",
//     "headers": {
//       "x-rapidapi-key": "dd5df5b7bemsh8fa3db287a4f66dp108728jsnf1b932ed572b",
//       "x-rapidapi-host": "google-news.p.rapidapi.com"
//     }
//   })
//   .then((res) =>  res.json())
//      .then((data) => {
//    console.log(data);
//     });
// }
// test()
