export class AppError extends Error {
  // 1. Властивість statusCode типу number
  statusCode: number;

  // 2. Конструктор, який приймає statusCode і message
  constructor(statusCode: number, message: string) {
    // 3. Виклик конструктора батьківського класу через super(message)
    super(message);

    this.statusCode = statusCode;

    // Зберігаємо правильний стек викликів (для TypeScript / Node.js)
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
