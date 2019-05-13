import $ from "jquery";

class Search {
  // 1. describe and create/initiate object
  constructor() {
    this.overlay = false;
    this.openBtn = $(".js-search-trigger");
    this.closeBtn = $(".search-overlay__close");
    this.searchOverlay = $(".search-overlay");
    this.events();
  }

  // 2. events
  events() {
    this.openBtn.on("click", this.openOverlay.bind(this));
    this.closeBtn.on("click", this.closeOverlay.bind(this));
    $(document).on("keyup", this.keyPress.bind(this));
  }

  // 3. methods
  openOverlay() {
    this.searchOverlay.addClass("search-overlay--active");
    $("body").addClass("body-no-scroll");
    console.log("open");
  }

  closeOverlay() {
    this.searchOverlay.removeClass("search-overlay--active");
    $("body").removeClass("body-no-scroll");
    console.log("close");
  }

  keyPress(event) {
    if (event.keyCode == 83 && !this.overlay) {
      this.openOverlay();
      this.overlay = true;
    } else if (event.keyCode == 27 && this.overlay) {
      this.closeOverlay();
      this.overlay = false;
    }
  }
}

export default Search;
