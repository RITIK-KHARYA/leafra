export type DbMessage = {
  id: number;
  chatId: string;
  content: string;
  role: "user" | "system";
  createdAt: Date;
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
  statusCode: number;
};