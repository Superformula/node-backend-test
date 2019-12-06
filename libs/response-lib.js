/**
 * Handle a successfuly API call return case.
 */
export function success(statusCode, body) {
  return buildResponse(statusCode, body);
}

/**
 * Handle a failed API call return case.
 */
export function failure(statusCode, body) {
  return buildResponse(statusCode, body);
}

/**
 * Build response from either success/fail
 */
function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(body)
  };
}
