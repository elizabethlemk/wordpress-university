import $ from "jquery";

class Search {
  // 1. describe and create/initiate object
  constructor() {
    this.addSearchHTML();
    this.overlay = false;
    this.spinner = false;
    this.prevValue;
    this.timer;
    this.openBtn = $(".js-search-trigger");
    this.closeBtn = $(".search-overlay__close");
    this.searchOverlay = $(".search-overlay");
    this.searchField = $("#search-term");
    this.searchResults = $("#search-overlay__results");
    this.events();
  }

  // 2. events
  events() {
    this.openBtn.on("click", this.openOverlay.bind(this));
    this.closeBtn.on("click", this.closeOverlay.bind(this));
    $(document).on("keydown", this.keyPress.bind(this));
    this.searchField.on("keyup", this.onChange.bind(this));
  }

  // 3. methods
  openOverlay() {
    this.searchOverlay.addClass("search-overlay--active");
    $("body").addClass("body-no-scroll");
    this.searchField.val("");
    setTimeout(() => this.searchField.focus(), 301);
  }

  closeOverlay() {
    this.searchOverlay.removeClass("search-overlay--active");
    $("body").removeClass("body-no-scroll");
  }

  keyPress(event) {
    if (
      event.keyCode == 83 &&
      !this.overlay &&
      !$("input, textarea").is(":focus")
    ) {
      this.openOverlay();
      this.overlay = true;
    } else if (event.keyCode == 27 && this.overlay) {
      this.closeOverlay();
      this.overlay = false;
    }
  }

  onChange() {
    if (this.searchField.val() != this.prevValue) {
      clearTimeout(this.timer);
      if (this.searchField.val()) {
        if (!this.spinner) {
          this.searchResults.html('<div class="spinner-loader"></div>');
          this.spinner = true;
        }
        this.timer = setTimeout(this.getResults.bind(this), 500);
      } else {
        this.searchResults.html("");
        this.spinner = false;
      }
    }
    this.prevValue = this.searchField.val();
  }

  getResults() {
    $.getJSON(
      `${
        uniData.root_url
      }/wp-json/university/v1/search?term=${this.searchField.val()}`,
      results => {
        console.log(results);
        this.searchResults.html(`
          <div class="row">
            <div class="one-third">
              <h2 class="search-overlay__section-title">General Info</h2>
              ${
                results.general.length
                  ? '<ul class="link-list min-list">'
                  : "<p>No general information matches your search</p>"
              }
                ${results.general
                  .map(result => {
                    return `<li>
                      <a href="${result.url}"> ${result.title}</a> ${
                      result.type == "post" ? `by ${result.author}` : ""
                    }
                    </li>`;
                  })
                  .join("")}
                  ${results.general.length ? "</ul>" : ""}
            </div>

            <div class="one-third">
              <h2 class="search-overlay__section-title">Programs</h2>
              ${
                results.programs.length
                  ? '<ul class="link-list min-list">'
                  : `<p>No programs match your search. <a href="${
                      uniData.root_url
                    }/programs">View all programs.</a></p>`
              }
                ${results.programs
                  .map(result => {
                    return `<li>
                      <a href="${result.url}"> ${result.title}</a>
                    </li>`;
                  })
                  .join("")}
                  ${results.programs.length ? "</ul>" : ""}


              <h2 class="search-overlay__section-title">Professors</h2>
              ${
                results.professors.length
                  ? '<ul class="professor-cards">'
                  : "<p>No professors match that search.</p>"
              }
                ${results.professors
                  .map(result => {
                    return `<li class="professor-card__list-item">
                      <a class="professor-card"href="${result.url}">
                        <img src="${
                          result.img
                        }" alt="" class="professor-card__image">
                        <span class="professor-card__name">
                          ${result.title}
                        </span>
                      </a></li>`;
                  })
                  .join("")}
                  ${results.professors.length ? "</ul>" : ""}
            </div>

            <div class="one-third">
              <h2 class="search-overlay__section-title">Campuses</h2>
              ${
                results.campuses.length
                  ? '<ul class="link-list min-list">'
                  : `<p>No campuses match your search. <a href="${
                      uniData.root_url
                    }/programs">View all campuses.</a></p>`
              }
                ${results.campuses
                  .map(result => {
                    return `<li>
                      <a href="${result.url}"> ${result.title}</a>
                    </li>`;
                  })
                  .join("")}
                  ${results.campuses.length ? "</ul>" : ""}

              <h2 class="search-overlay__section-title">Events</h2>
              ${
                results.events.length
                  ? ""
                  : `<p>No events match that search. <a href="${
                      uniData.root_url
                    }/programs">View all events.</a></p>`
              }
                ${results.events
                  .map(result => {
                    return `
                    <div class="event-summary">
                      <a class="event-summary__date t-center" href="${
                        result.url
                      }">
                        <span class="event-summary__month">${
                          result.month
                        }</span>
                        <span class="event-summary__day">${result.day}</span>
                      </a>
                      <div class="event-summary__content">
                        <h5 class="event-summary__title headline headline--tiny"><a href="${
                          result.url
                        }">${result.title}</a></h5>
                        <p>${result.description}<a href="${
                      result.url
                    }" class="nu gray">Learn more</a></p>
                      </div>
                    </div>

                    `;
                  })
                  .join("")}
            </div>
          </div>
          `);
        this.spinner = false;
      }
    );
  }

  addSearchHTML() {
    $("body").append(`
      <div class="search-overlay ">
        <div class="search-overlay__top">
          <div class="container">
            <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
            <input type="text" class="search-term" id="search-term" placeholder="What are you looking for?">
            <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
          </div>
        </div>

        <div class="container">
          <div id="search-overlay__results">

          </div>
        </div>
      </div>`);
  }
}

export default Search;
