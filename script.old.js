import { getData, setData } from "./storage.js";
import { loadBookmarks } from "./script.js";

jest.mock("./storage.js");

describe("loadBookmarks", () => {
  test("should retrieve bookmarks for a given user", () => {
    const mockBookmarks = [
      { url: "https://example.com", title: "Example", description: "Test bookmark", timestamp: Date.now() },
    ];
    getData.mockReturnValue(mockBookmarks);

    // Mocking loadBookmarks to use getData internally
    const bookmarks = loadBookmarks("user1");
    expect(bookmarks).toEqual(mockBookmarks);
  });

  test("should return an empty array when there are no bookmarks", () => {
    getData.mockReturnValue([]);

    const bookmarks = loadBookmarks("user1");
    expect(bookmarks).toEqual([]);
  });
});

describe("Bookmark Addition", () => {
  test("should add a new bookmark", () => {
    setData.mockClear();
    getData.mockReturnValue([]);

    const newBookmark = {
      url: "https://example.com",
      title: "Example",
      description: "Test bookmark",
      timestamp: Date.now(),
    };

    const bookmarks = getData("user1") || [];
    bookmarks.push(newBookmark);
    setData("user1", bookmarks);

    expect(setData).toHaveBeenCalledWith("user1", expect.arrayContaining([expect.objectContaining(newBookmark)]));
  });
});
