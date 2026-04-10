const TOKEN_KEY = "access_token";

function getApiUrl() {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  return process.env.NEXT_PUBLIC_API_URL;
}

export function setToken(token) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function readToken() {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  const token = readToken();

  if (!token) {
    return false;
  }

  if (token.exp && Date.now() >= token.exp * 1000) {
    removeToken();
    return false;
  }

  return true;
}

export async function authenticateUser(userName, password) {
  const res = await fetch(`${getApiUrl()}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userName, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (res.status === 200) {
    setToken(data.token);
    return true;
  }

  throw new Error(data.message || "Unable to authenticate user.");
}

export async function registerUser(userName, password, password2) {
  const res = await fetch(`${getApiUrl()}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userName, password, password2 }),
  });

  const data = await res.json().catch(() => ({}));

  if (res.status === 200) {
    return true;
  }

  throw new Error(data.message || "Unable to register user.");
}