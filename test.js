import { getUserIds, getData, setData } from "./storage.js";

// Utility functions to interact with the DOM
function populateUserDropdown(users, callback) {
  const userSelect = document.getElementById("user-select");
  userSelect.innerHTML = "";  // Clear previous options
  users.forEach((userId) => {
    const option = document.createElement("option");
    option.value = userId;
    option.textContent = `User ${userId}`;
    userSelect.appendChild(option);
  });

  // Call the callback to load the bookmarks for the selected user
  userSelect.addEventListener("change", (event) => {
    callback(event.target.value);
  });
}

function updateBookmarkList(bookmarks) {
  const bookmarkList = document.getElementById("bookmark-list");
  bookmarkList.innerHTML = ""; // Clear previous bookmarks

  if (bookmarks.length === 0) {
    bookmarkList.innerHTML = "<p>No bookmarks found.</p>";
    return;
  }

  bookmarks.reverse().forEach((bookmark, index) => {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.href = bookmark.url;
    link.textContent = bookmark.title;
    link.target = "_blank";
    listItem.appendChild(link);

    // Ensure timestamp exists and is valid before formatting
    const timestamp = bookmark.timestamp ? new Date(bookmark.timestamp).toLocaleString() : "Invalid Date";
    listItem.innerHTML += ` - ${bookmark.description} (Added on: ${timestamp})`;

    bookmarkList.appendChild(listItem);
  });
}

function handleFormSubmit(event, userSelect, urlInput, titleInput, descriptionInput, callback) {
  event.preventDefault();

  const userId = userSelect.value;
  if (!userId || !urlInput.value || !titleInput.value || !descriptionInput.value) {
    console.error("Missing fields in the form.");
    return;
  }

  const newBookmark = {
    url: urlInput.value,
    title: titleInput.value,
    description: descriptionInput.value,
    timestamp: Date.now(),
  };

  const bookmarks = getData(userId) || [];
  bookmarks.push(newBookmark);
  setData(userId, bookmarks);
  callback(userId);  // Update bookmarks list after adding a new one
}

function handleDescriptionKeydown(event, form) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
}

// Main function to handle bookmark loading and form submission
document.addEventListener("DOMContentLoaded", () => {
  const userSelect = document.getElementById("user-select");
  const bookmarkForm = document.getElementById("bookmark-form");
  const urlInput = document.getElementById("url");
  const titleInput = document.getElementById("title");
  const descriptionInput = document.getElementById("description");

  const users = getUserIds();

  // Populate the dropdown and load bookmarks for the selected user
  populateUserDropdown(users, (userId) => {
    const bookmarks = getData(userId) || [];
    updateBookmarkList(bookmarks);
  });

  // Handle form submission
  bookmarkForm.addEventListener("submit", (event) => {
    handleFormSubmit(event, userSelect, urlInput, titleInput, descriptionInput, (userId) => {
      const bookmarks = getData(userId) || [];
      updateBookmarkList(bookmarks);
    });
  });

  // Enable Enter key submission from the textarea
  descriptionInput.addEventListener("keydown", function (event) {
    handleDescriptionKeydown(event, bookmarkForm);
  });

  // Load initial bookmarks for the first user
  if (users.length > 0) {
    userSelect.value = users[0];
    const initialBookmarks = getData(users[0]) || [];
    updateBookmarkList(initialBookmarks);
  }
});

export { updateBookmarkList };