export const apiConnector = async (method, url, bodyData = null, headers = {}, params = {}) => {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: bodyData ? JSON.stringify(bodyData) : null,
    });

    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    throw error;
  }
};