import View from './View';
import icons from 'url:../../img/icons.svg';

class paginationView extends View {
  _parentElement = document.querySelector('.pagination');
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const gotopage = +btn.dataset.goto;
      handler(gotopage);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const page = this._data.page;

    // page 1 and other pages
    if (page === 1 && numPages > 1) {
      return `<button data-goto="${
        page + 1
      }" class="btn--inline pagination__btn--next">
      <span>Page ${page + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
    }

    // last page
    if (page === numPages && numPages > 1) {
      return `<button data-goto="${
        page - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${page - 1}</span>
    </button>`;
    }
    // other page
    if (page > 1) {
      return `<button data-goto="${
        page - 1
      }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${page - 1}</span>
      </button>
      <button data-goto="${page + 1}" class="btn--inline pagination__btn--next">
      <span>Page ${page + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
    }
    // page 1 and no other pages
    return ``;
  }
}

export default new paginationView();
