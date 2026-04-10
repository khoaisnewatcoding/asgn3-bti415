import { getToken } from "@/lib/authenticate";

function getApiUrl() {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    return null;
  }

  return process.env.NEXT_PUBLIC_API_URL;
}

async function fetchWithAuth(url, options = {}) {
  const token = getToken();

  if (!token) {
    return [];
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `JWT ${token}`,
      ...(options.headers || {}),
    },
  });

  if (res.status === 200) {
    return res.json();
  }

  return [];
}

export async function addToFavourites(id) {
  const apiUrl = getApiUrl();

  if (!apiUrl) {
    return [];
  }

  return fetchWithAuth(`${apiUrl}/favourites/${id}`, {
    method: "PUT",
  });
}

export async function removeFromFavourites(id) {
  const apiUrl = getApiUrl();

  if (!apiUrl) {
    return [];
  }

  return fetchWithAuth(`${apiUrl}/favourites/${id}`, {
    method: "DELETE",
  });
}

export async function getFavourites() {
  const apiUrl = getApiUrl();

  if (!apiUrl) {
    return [];
  }

  return fetchWithAuth(`${apiUrl}/favourites`);
}