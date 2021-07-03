// Format card description
export function formatDescription(description: string): String {
  if (description.length < 130) {
    return description;
  }
  const newDescription = description.slice(0, 130);
  return newDescription.concat("...");
}

// Format card title with first letter in uppercase
export function formatTitle(title: string): string {
  return (title + "").charAt(0).toUpperCase() + title.substr(1);
}

// Find status of scan for select
export function findStatusForSelect(status: number): string {
  if (status === 0) {
    return "Fake";
  } else if (status === 2) {
    return "Authentique";
  } else if (status === 3) {
    return "Douteuse";
  }
  return "Tous";
}

// Return pagination tab
export function pagination(currentPage: number, pageCount: number) {
  let delta = 2,
    left = currentPage - delta,
    right = currentPage + delta + 1,
    result = [];

  result = Array.from({ length: pageCount }, (v, k) => k + 1).filter(
    (i) => i && i >= left && i < right
  );

  if (result.length > 1) {
    // Add first page and dots
    if (result[0] > 1) {
      if (result[0] > 2) {
        result.unshift(0);
      }
      result.unshift(1);
    }

    // Add dots and last page
    if (result[result.length - 1] < pageCount) {
      if (result[result.length - 1] !== pageCount - 1) {
        result.push(0);
      }
      result.push(pageCount);
    }
  }

  return result;
}

// Find day diff for comment
export function dayDiff(date: Date) {
  const nbOfDays = date.getTime() / 86400000;
  const now = Date.now() / 86400000;
  return Number(now - nbOfDays).toFixed(0);
}
