import 'core-js/stable';
import { async } from 'regenerator-runtime';
import 'regenerator-runtime/runtime';

import { MODAL_CLOSE_SEC } from './config';
import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import bookmarksView from './views/bookmarksView';
import paginationView from './views/paginationView';
import addRecipeView from './views/addRecipeView';

if (module.hot) {
  module.hot.accept();
}
// https://forkify-api.herokuapp.com/v2

/////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // fetching recipe
    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmark);

    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);

    // rendering recipe
  } catch (err) {
    recipeView.renderError();
    // console.log(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultsPage());

    // render initial pagination

    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (gotopage) {
  resultsView.render(model.getSearchResultsPage(gotopage));

  // render initial pagination

  paginationView.render(model.state.search);
};

const controlServungs = function (quantity) {
  // update the recupe in state
  model.updateServings(quantity);

  // updating recipeVIew
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controladdBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmark);
};

const controlBookmark = function () {
  bookmarksView.render(model.state.bookmark);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmark);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServungs(controlServungs);
  recipeView.addHandlerBookmark(controladdBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
