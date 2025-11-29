import { NextResponse } from "next/server";

export interface ApiError {
  error: string;
  details?: unknown;
  statusCode: number;
}

export interface ApiSuccess<T = unknown> {
  data: T;
  message?: string;
  statusCode: number;
}

export class ApiResponse {
  static success<T>(
    data: T,
    message?: string,
    statusCode: number = 200
  ): NextResponse<ApiSuccess<T>> {
    return NextResponse.json(
      {
        data,
        message,
        statusCode,
      },
      { status: statusCode }
    );
  }

  static error(
    error: string,
    statusCode: number = 500,
    details?: unknown
  ): NextResponse<ApiError> {
    return NextResponse.json(
      {
        error,
        details,
        statusCode,
      },
      { status: statusCode }
    );
  }

  static unauthorized(message: string = "Unauthorized"): NextResponse<ApiError> {
    return this.error(message, 401);
  }

  static badRequest(
    message: string = "Bad Request",
    details?: unknown
  ): NextResponse<ApiError> {
    return this.error(message, 400, details);
  }

  static notFound(message: string = "Not Found"): NextResponse<ApiError> {
    return this.error(message, 404);
  }

  static internalError(
    message: string = "Internal Server Error",
    details?: unknown
  ): NextResponse<ApiError> {
    return this.error(message, 500, details);
  }
}

