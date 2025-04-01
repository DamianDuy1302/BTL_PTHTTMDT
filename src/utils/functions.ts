export const updateAllObject = (obj, value) => {
  return Object.keys(obj).reduce((acc, key) => {
    if (typeof obj[key] === "boolean") {
      // Nếu là boolean, cập nhật giá trị mới
      acc[key] = value;
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      // Nếu là object, gọi đệ quy để cập nhật sâu bên trong
      acc[key] = updateAllObject(obj[key], value);
    } else {
      // Nếu không phải boolean hoặc object (ví dụ: string, number), giữ nguyên
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};

export function removeSpaces(str: string): string {
  return str.replace(/\s+/g, "");
}

export const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
