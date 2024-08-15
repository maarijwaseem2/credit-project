export function formatResponse(message: string, data: any) {
  return { message, data };
}

export function formatErrorResponse(message: string, errorMessage: string) {
  return { message: errorMessage, data: [] };
}
