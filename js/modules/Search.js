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
    $.when(
      $.getJSON(
        `${
          uniData.root_url
        }/wp-json/wp/v2/posts?search=${this.searchField.val()}`
      ),
      $.getJSON(
        `${
          uniData.root_url
        }/wp-json/wp/v2/pages?search=${this.searchField.val()}`
      )
    ).then(
      (posts, pages) => {
        let results = posts[0].concat(pages[0]);
        this.searchResults.html(`
      <h2 class="search-overlay__section-title">Results</h2>
      ${
        results.length ? '<ul class="link-list min-list">' : "<p>No results</p>"
      }
        ${results
          .map(result => {
            return `<li>
              <a href="${result.link}"> ${result.title.rendered}</a> ${
              result.authorName ? "by " + result.authorName : ""
            }
            </li>`;
          })
          .join("")}
          ${results.length ? "</ul>" : ""}
      `);
        this.spinner = false;
      },
      () => {
        this.searchResults.html("<p>Unexpected error; please try again.</p>");
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
