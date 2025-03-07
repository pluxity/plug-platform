import { type User } from "../services/user/types"

const sampleDrawings = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  title: `도면 ${index + 1}`,
  date: new Date(2025, 0, (index % 28) + 1).toISOString().split("T")[0],
  thumbnail: `https://picsum.photos/240/160?random=${index + 1}`,
}));

const getUsers: User[] = Array.from({ length: 100 }, (_, i) => ({
  key: i + 1,
  name: `사용자 ${i + 1}`,
  email: `user${i + 1}@example.com`,
  phone: `010-0000-${(i + 1).toString().padStart(4, "0")}`,
}));

export { sampleDrawings, getUsers };
