const inputBox = document.querySelector(".input-box");
const searchBtn = document.querySelector(".search-btn");
const errorMsg = document.querySelector(".error-msg");
const teams = document.querySelector(".teams");
const loader = document.querySelector(".loader");
const searchData = document.querySelector(".search-data");
const userError = document.querySelector(".user-error");
const modalBody = document.querySelector(".modal-body");
const onTv = document.querySelector(".on-tv-btn");
const onTheater = document.querySelector(".on-theaters-btn");
const popularMovies = document.querySelector(".popular-movies");

// Today Date Pick
var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + "-" + mm + "-" + dd;
console.log(today);

let movieThumbnail = "https://image.tmdb.org/t/p/w500/";

// fetch data function

async function fetchData(url) {
  let res = await fetch(url);
  let data = await res.json();

  return data;
}

// Search data emplement
searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  errorMsg.classList.add("d-none");
  searchData.textContent = "";
  userError.textContent = "";

  let inputValue = inputBox.value.trim().toLowerCase();
  inputBox.value = "";
  if (inputValue.length > 0) {
    loader.classList.remove("d-none");
    movieSearchData(inputValue);
  } else {
    errorMsg.classList.remove("d-none");
  }
});

// Movie search data
function movieSearchData(inputText) {
  fetchData(
    `https://api.themoviedb.org/3/search/movie?api_key=0e6fedb892a73ce2767c0f4f3b1c9c60&query=${inputText}`
  ).then((data) => {
    if (data.results.length > 0) {
      let movies = data.results[0];

      setTimeout(() => {
        loader.classList.add("d-none");
      }, 100);

      let col = document.createElement("div");
      col.className =
        "col-12 m-auto d-flex align-items-center justify-content-center";
      col.innerHTML = `
      <div class="card mb-3" style="width: 540px;">
      <div class="row g-0">
        <div class="col-md-4">
          <img src="${movieThumbnail}${
        movies.poster_path
      }" class="img-fluid rounded-start" alt="...">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${movies.title}</h5>
            <p class="card-text">${movies.overview.slice(0, 200)}...</p>
            <a href="#" class="btn btn-primary"  data-bs-toggle="modal" data-bs-target="#exampleModal" onclick='movieDetails("${
              movies.id
            }")'>See More</a>
          </div>
        </div>
      </div>
    </div>
        `;
      searchData.appendChild(col);
      console.log(movies);
    } else {
      console.log(`There is no movie found by this name --${inputText}`);
      loader.classList.add("d-none");
      let typeError = document.createElement("div");
      typeError.className =
        "error-div m-auto animate__bounceInLeft animate__animated";
      typeError.innerHTML = ` <img
      src="img/undraw_page_not_found_su7k.png"
      class="m-auto"
      width="400"
    />
    <h3 class="text-center text-warning">No movie found by --${inputText}</h3>`;

      userError.appendChild(typeError);
    }
  });
}

// Search details by id
function movieDetails(movieId) {
  fetchData(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=0e6fedb892a73ce2767c0f4f3b1c9c60`
  ).then((movie) => {
    let movieDetails = movie;
    modalBody.textContent = "";
    let detailsCard = document.createElement("div");
    detailsCard.className = "card mb-3 border-0";
    detailsCard.innerHTML = `
    <img src="${movieThumbnail}${movie.poster_path}" class="m-auto" width="200" alt="..." />
                <div class="card-body">
                  <h5 class="card-title">${movie.title}</h5>
                  <p class="card-text">
                  ${movie.overview}
                  </p>
                  <div class="main-rating d-flex justify-content-between align-items-center">
      <div class="rating-title">
        <h5 class="text-dark border-dark border rounded p-1">IMDb Ratings :</h5>
      </div>
      <div class="rating-div">
        <h6>${movie.vote_average}</h6>
      </div>
    </div>
                  
                </div>
    `;
    modalBody.appendChild(detailsCard);
    console.log(movie);
  });
}

// On Popular MOvies

function userClick(myClick) {
  if (myClick == onTheater) {
    fetchData(
      `https://api.themoviedb.org/3/discover/movie?primary_release_date.gte=2014-09-15&primary_release_date.lte=${today}&api_key=0e6fedb892a73ce2767c0f4f3b1c9c60`
    ).then((data) => {
      theaters(data);
    });
  } else {
    fetchData(
      `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=0e6fedb892a73ce2767c0f4f3b1c9c60`
    ).then((data) => {
      tvdata(data);
    });
  }
}

function theaters(data) {
  popularMovies.textContent = "";
  let maindata = data.results;
  maindata.forEach((movie) => {
    let col = document.createElement("div");
    col.className = "col-2 pop-main";
    col.innerHTML = `
   <img src="${movieThumbnail}${movie.poster_path}" class="rounded"  alt="" />
   <button type="button" class="btn btn-dark pop-btn rounded-circle" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick='detailsBtn("${movie.id}")'><i class="bi bi-three-dots"></i></button>
   <h6 class="text-center mt-1 text-muted">${movie.release_date}</h6>
   `;
    popularMovies.appendChild(col);
  });
}

function detailsBtn(movieId) {
  fetchData(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=0e6fedb892a73ce2767c0f4f3b1c9c60`
  ).then((data) => {
    showPopuDetails(data);
  });
}

function showPopuDetails(data) {
  modalBody.textContent = "";
  let card = document.createElement("div");
  card.className = "card";
  card.setAttribute("style", "width: 100%");
  card.innerHTML = `
  <img src="${movieThumbnail}${data.poster_path}" class="card-img-top" alt="..." >
  <div class="card-body">
    <p class="card-text">${data.overview}</p>
    <ul class="list-group list-group-flush">
  <li class="list-group-item"> <span>Ratings :</span> ${data.vote_average}</li>
  <li class="list-group-item"> <span>Original Lang :</span> ${data.original_language}</li>
  
</ul>
  </div>
  `;
  modalBody.appendChild(card);
  console.log(data);
}

function tvdata(data) {
  popularMovies.textContent = "";
  let maindata = data.results;
  maindata.forEach((movie) => {
    let col = document.createElement("div");
    col.className = "col-2 pop-main";
    col.innerHTML = `
   <img src="${movieThumbnail}${movie.poster_path}" class="rounded"  alt="" />
   <button type="button" class="btn btn-dark pop-btn rounded-circle" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick='detailsBtn("${movie.id}")'><i class="bi bi-three-dots"></i></button>
   <h6 class="text-center mt-1 text-muted">${movie.release_date}</h6>
   
   `;
    popularMovies.appendChild(col);
  });
}

onTheater.addEventListener("click", function () {
  userClick(onTheater);
});

onTv.addEventListener("click", function () {
  userClick(onTv);
});
