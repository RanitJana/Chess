function areCookiesEnabled() {
  document.cookie = "testCookie=1; path=/";
  const cookiesEnabled = document.cookie.indexOf("testCookie=") !== -1;

  // Cleanup: Remove the test cookie
  document.cookie =
    "testCookie=1; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

  return cookiesEnabled;
}

export default areCookiesEnabled;
