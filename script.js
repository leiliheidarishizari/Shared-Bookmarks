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

    console.log("Loading bookmarks for user:", userId);
    console.log("Loaded bookmarks:", bookmarks);

    if (bookmarks.length === 0) {
      bookmarkList.innerHTML = "<p>No bookmarks found.</p>";
      return;
    }

    bookmarks.reverse().forEach((bookmark, index) => {
      console.log(`Rendering bookmark ${index + 1}:`, bookmark);
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

    console.log("Form values:", {
      url: urlInput.value,
      title: titleInput.value,
      description: descriptionInput.value,
    });

    if (!urlInput.value || !titleInput.value || !descriptionInput.value) {
      console.error("Missing fields in the form.");
      return;
    }

    const newBookmark = {
      url: urlInput.value,
      title: titleInput.value,
      description: descriptionInput.value,
      timestamp: Date.now(),
    };

    console.log("Adding new bookmark:", newBookmark);

    const bookmarks = getData(userId) || [];
    bookmarks.push(newBookmark);
    setData(userId, bookmarks);
    loadBookmarks(userId);
    bookmarkForm.reset();
  });

  // Enable Enter key submission from the textarea
  descriptionInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      bookmarkForm.requestSubmit();
    }
  });

  // Load initial bookmarks for the first user
  if (users.length > 0) {
    userSelect.value = users[0];
    loadBookmarks(users[0]);
  }
});

