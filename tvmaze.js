/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *   - given a search term, search for tv shows that
 *      match that query.  The function is async and uses await to wait for repsonse.
 *   -  Returns an array of objects by mapping through the response array. 
 *   - Each object includes: id: <show id>, name: <show name>, summary: <show summary>, 
 *     image: <an image from the show data>
 * ** I tried using show of res.data.shows, but then realized I should use Map 
 * ** After trying several map configurations, I had to look at the solution as my deeper
 * ** Dot notations were not working with JS Syntax.
 */
async function searchShows(query) {
  const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
  let shows = res.data.map(function (result) {
    let show = result.show;
    return { id: show.id, name: show.name, summary: show.summary, image: show.image ? show.image.medium : "https://tinyurl.com/tv-missing", };
  })
  return shows; //returns new array of shows' objects
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <img class="card-img-top" src="${show.image}">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
          
             <!-- Trigger the modal with a button -->
             <button type="button" class="btn btn-info btn-lg" data-show-id="${show.id}" data-toggle="modal" data-target="#myModal">Episodes</button>
             
             <!-- Modal -->
             <div id="myModal" class="modal fade" role="dialog">
               <div class="modal-dialog">
             
                 <!-- Modal content-->
                 <div class="modal-content">
                   <div class="modal-header">
                   <h4 class="modal-title">Episodes</h4>
                     <button type="button" class="close" data-dismiss="modal">&times;</button>
                     
                   </div>
                   <div class="modal-body">
                     <ul></ul>
                   </div>
                   <div class="modal-footer">
                     <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                   </div>
                 </div>
             
               </div>
             </div>


            <div 
         </div>
       </div>
      `);
    $showsList.append($item);
  }
  $('.card-body').find('button').on("click", async function handleEpisodes(event) {
    event.preventDefault();
    const show = event.target;
    let id = show.getAttribute("data-show-id");
    let episodes = await getEpisodes(id);
    let x = await populatelistOfEpisodes(id, episodes);
  })
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  console.log(res);
  const episodes = [];
  for (let { name, season, number } of res.data) {
    episodes.push({ name, season, number });
  }
  return episodes; //returns new array of episodes
}

function populatelistOfEpisodes(id, episodes) {
  const ul = document.querySelector("ul");
  ul.innerHTML = "";
  if (episodes === []) {
    ul.innerText = "Sorry No Episodes";
    return;
  }//Can't get this to work
  for (let episode of episodes) {
    let li = document.createElement('li');
    li.innerHTML = `${episode.name} (Season ${episode.season}, Number ${episode.number})`;
    ul.append(li);
  }
}