"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */ 

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  $("#submit").show();
  $("#favorites").show();
  $("#my-stories").show();
}

/** When a user clicks the submit button that appears after a user has logged in */
function navSubmitClick(evt) {
  $addNewStoryForm.show(); // Displays the add New Story form
  $addNewStoryForm.prependTo($storiesLists);
  $favoriteStoriesList.hide(); 
  $mystoriesList.hide();
  $allStoriesList.show(); // shows the allStoriesList even when the add new story form is displayed
  
}

$("#submit").on("click", navSubmitClick);


/** When user clicks on the favorites tab, it displays the user's favorited stories. If the user does not have any favorited stories, it displays text that says that the user has not added any favorites */
function amendFavoritesTab() {
  $favoriteStoriesList.empty(); // empties list first as to not display duplicates
  $addNewStoryForm.hide()
  $storiesLists.hide(); // hides all story lists
  $favoriteStoriesList.show();
  $loginForm.hide();
  $signupForm.hide();

  // if user has no favorites saved, message will display saying that no favorites have been added yet
  if (currentUser.favorites.length === 0) { 
    $favoriteStoriesList.append("<h5>No Favorites Added Yet!</h5>");
  }

  // otherwise, favortied stories will be displayed on this tab
  else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoriteStoriesList.prepend($story);
    }
  }

}

$("#favorites").on("click", amendFavoritesTab);

/** When user clicks on the my stories tab, it displays the user's posted stories. If the user does not have any of their own stories, it displays text that says that user has not added any stories yet */
function amendMyStoriesTab() {
  $mystoriesList.empty();
  $addNewStoryForm.hide();
  $storiesLists.hide();
  $mystoriesList.show();
  $loginForm.hide();
  $signupForm.hide();

  // if user has no stories added, message will display saying that no stories have been added yet
  if (currentUser.ownStories.length === 0) {
    $mystoriesList.append("<h5>You Have Not Added Any Stories Yet!</h5>");
  }

  // otherwise, added stories will be displayed on this tab 
  else {
    for (let myStory of currentUser.ownStories) {
    const $myStory = generateStoryMarkup(myStory, true);
    $mystoriesList.append($myStory);
    }
  }
}

$("#my-stories").on("click", amendMyStoriesTab);

