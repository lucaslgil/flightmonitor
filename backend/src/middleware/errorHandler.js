export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  // Amadeus API errors
  if (err.response?.data) {
    return res.status(err.response.status || 500).json({
      error: 'Amadeus API error',
      message: err.response.data.errors?.[0]?.detail || err.message,
      code: err.response.data.errors?.[0]?.code
    });
  }

  // Supabase errors
  if (err.code && err.message) {
    return res.status(400).json({
      error: 'Database error',
      message: err.message,
      code: err.code
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'Something went wrong'
  });
};
