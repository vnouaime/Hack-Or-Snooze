"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;
let favoriteStoryList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
*/

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);
  const storyInstance = new Story(story);
  const hostName = storyInstance.getHostName();
  const showStar = Boolean(currentUser); // when user is logged in checks to see if the story is favorited or not favorited. Returns true or false
  
  const $storyElement =  $(`
      <li id="${story.storyId}">
        ${showDeleteBtn ? getTrashCanHTML() : ""} 
        ${showStar ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
  `);
  
  return $storyElement;
}

/** Checks to see if the story selected has been favorited by the user and then updates the HTML of the star depending on if the story has been favorited. Returns a span element to implement in generateStoryMarkup function */
function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far"; // this from style sheet font-awesome
  
  return `<span class="star"><i class="${starType} fa-star"></i></span>`;
}

/** Returns spam element with trash can image from style sheet font-awesome */
function getTrashCanHTML() {
  return `<span class="trash-can"><i class="fas fa-trash-alt"></i></span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */
function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Gets the values from the add-new-story form then makes a new story and appends it the StoriesList that displays on the page */
async function addNewStoryToPage(evt) {
  evt.preventDefault();

  const $newStory = {title: $("#new-story-title").val(), author: $("#new-story-author").val(), url: $("#new-story-url").val()};
  const addedStory = await StoryList.addStory(currentUser, $newStory);

  // hides and resets form after submission
  $addNewStoryForm.slideUp("slow");
  $addNewStoryForm.trigger("reset");
  
  storyList = await StoryList.getStories();
  putStoriesOnPage();

}

$addNewStoryForm.on("submit", addNewStoryToPage);


/** When star is clicked, adds or deletes story to favorites array for user. Updates API as well for user */
async function toggleFavoriteStories(evt) {
  const $star = $(evt.target);
  console.log($star);
  const $closestLi = $star.closest("li"); // li element story of the star that has been clicked
  const $storyId = $closestLi.attr("id"); // selects the story Id of the closest li element of the star that has been clicked

  // Checks to see if story has been favorited or not 
  if ($star.hasClass("fas")) {
    $star.closest("i").toggleClass("fas far");
    await User.addOrDeleteFavoriteStories("DELETE", $storyId); // Deletes story from favorites array of user if user is clicking a story that has already been favorited
  }
  
  else {
    $star.closest("i").toggleClass("fas far");
    await User.addOrDeleteFavoriteStories("POST", $storyId); // Adds story to favorites array of user if story has not been favorited   
  }
}

$storiesLists.on("click", ".star", toggleFavoriteStories);

/** When trash can is clicked next to own story on mystories page, calls removeStory from StoryList class to remove from API. Removes story li from page */
async function deleteStory(evt) {
  const $trashCan = $(evt.target);
  const $closestLi = $trashCan.closest("li");
  const $storyId = $closestLi.attr("id");
  
  await StoryList.removeStory(currentUser, $storyId, storyList);
  $closestLi.remove();
}

$mystoriesList.on("click", ".trash-can", deleteStory);
