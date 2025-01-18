export default async function generateRandomProfileImage(user = {}) {
  try {
    if (user.avatar !== "") return user.avatar;
    return `https://robohash.org/${user.name || "guest"}`;
  } catch (error) {
    console.error("Error fetching profile image:", error);
  }
  return "/images/user-pawn.gif";
}
