// Error handling utilities
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const status = error.response.status;
    const data = error.response.data;
    
    switch (status) {
      case 400:
        return data.detail || data.message || 'Invalid request. Please check your input.';
      case 401:
        return 'You are not authorized. Please login again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return data.detail || 'Resource not found.';
      case 422:
        return data.detail || 'Validation error. Please check your input.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return data.detail || data.message || `Error ${status}: Something went wrong.`;
    }
  } else if (error.request) {
    // Request made but no response
    return 'Network error. Please check your connection.';
  } else {
    // Error in request setup
    return error.message || 'An unexpected error occurred.';
  }
};

export const showErrorToast = (error, setToast) => {
  const message = handleApiError(error);
  setToast({ message, type: 'error' });
};

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

