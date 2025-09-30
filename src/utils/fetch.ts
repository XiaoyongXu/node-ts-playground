export const fetchData = async <T>(url: string, headers?: HeadersInit): Promise<T> => {
  try {
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...headers
    };

    const response = await fetch(url, {
      method: 'GET',
      headers: defaultHeaders,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: T = await response.json();
    return data;

  } catch (error) {
    console.error("Fetch data error:", error);

    throw error;
  }
};

export const postData = async <T, R = any>(
  url: string,
  data: T,
  headers?: HeadersInit
): Promise<R> => {
  try {
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...headers
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData: R = await response.json();
    return responseData;

  } catch (error) {
    console.error("Post data error:", error);

    throw error;
  }
};