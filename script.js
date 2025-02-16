import { getUserIds, getData, setData } from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const userSelect = document.getElementById("user-select");
  const bookmarkList = document.getElementById("bookmark-list");
  const bookmarkForm = document.getElementById("bookmark-form");
  const urlInput = document.getElementById("url");
  const titleInput = document.getElementById("title");
  const descriptionInput = document.getElementById("description");

  // Populate user dropdown
  const users = getUserIds();
  users.forEach((userId) => {
    const option = document.createElement("option");
    option.value = userId;
    option.textContent = `User ${userId}`;
    userSelect.appendChild(option);
  });

  // Load bookmarks for selected user
  function loadBookmarks(userId) {
    bookmarkList.innerHTML = "";
    const bookmarks = getData(userId) || [];

    console.log("Loading bookmarks for user:", userId);  // Debugging log
    console.log("Loaded bookmarks:", bookmarks);  // Debugging log

    if (bookmarks.length === 0) {
      bookmarkList.innerHTML = "<p>No bookmarks found.</p>";
      return;
    }

    bookmarks.reverse().forEach((bookmark, index) => {
      console.log(`Rendering bookmark ${index + 1}:`, bookmark);  // Debugging log
      if (!bookmark.url || !bookmark.title || !bookmark.timestamp) {
        console.error("Invalid bookmark:", bookmark);
        return;
      }

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

  userSelect.addEventListener("change", () => {
    loadBookmarks(userSelect.value);
  });

  bookmarkForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const userId = userSelect.value;
    if (!userId) return;

    // Log the form inputs to check if they are being populated
    console.log("Form values:", {
      url: urlInput.value,
      title: titleInput.value,
      description: descriptionInput.value,
    });

    // Validate form inputs before creating bookmark
    if (!urlInput.value || !titleInput.value || !descriptionInput.value) {
      console.error("Missing fields in the form.");
      return;
    }

    // Create a bookmark object with properties
    const newBookmark = {
      url: urlInput.value,
      title: titleInput.value,
      description: descriptionInput.value,
      timestamp: Date.now(), // Ensure this is a valid timestamp
    };

    console.log("Adding new bookmark:", newBookmark);  // Debugging log

    const bookmarks = getData(userId) || [];
    bookmarks.push(newBookmark);  // Add the new bookmark to the array
    setData(userId, bookmarks);   // Store the updated bookmarks array back to localStorage
    loadBookmarks(userId);        // Reload bookmarks
    bookmarkForm.reset();         // Reset form inputs
  });

  // Load initial bookmarks for the first user
  if (users.length > 0) {
    userSelect.value = users[0];
    loadBookmarks(users[0]);
  }
});
