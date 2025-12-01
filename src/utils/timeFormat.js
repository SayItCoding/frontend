export function formatSecondsToKoreanTime(totalSeconds) {
  if (!totalSeconds || totalSeconds <= 0) return "0분";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0 && minutes > 0) {
    return `${hours}시간 ${minutes}분`;
  }
  if (hours > 0) {
    return `${hours}시간`;
  }
  return `${minutes}분`;
}

export function formatDate(dateStr) {
  if (!dateStr) return "";
  return dateStr.replace(/-/g, ".");
}
