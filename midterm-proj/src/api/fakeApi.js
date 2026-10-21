import { API_CONFIG, DATA_KEY } from "./settings.js";
import { initialDataSample } from "./initial-data-sample.js";

function fakeRequest(operation, options = {}) {
  const {
    minDelay = API_CONFIG.minDelay,
    maxDelay = API_CONFIG.maxDelay,
    errorChance = API_CONFIG.errorChance,
  } = options;

  return new Promise((resolve, reject) => {
    const delayMS =
      Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

    setTimeout(() => {
      if (Math.random() < errorChance) {
        reject(new Error("Simulated server Error"));
        return;
      }

      try {
        resolve(operation());
      } catch (error) {
        reject(error);
      }
    }, delayMS);
  });
}

function initializeDatabase() {
  if (!localStorage.getItem(DATA_KEY)) {
    localStorage.setItem(DATA_KEY, JSON.stringify(initialDataSample));
  }
}

function readData() {
  return JSON.parse(localStorage.getItem(DATA_KEY) || "[]");
}

function writeData(items) {
  localStorage.setItem(DATA_KEY, JSON.stringify(items));
}

initializeDatabase();

export async function getItemsList(query = "") {
  return fakeRequest(() => {
    const params = new URLSearchParams(query);
    const search = params.get("search");
    const type = params.get("type");
    const status = params.get("status");
    const sort = params.get("sort") || "id-asc";
    const page = Number(params.get("page")) || 1;
    const limit = Number(params.get("limit")) || 15;

    let items = readData();

    if (search) {
      const searchLower = search.toLowerCase();
      items = items.filter((item) => {
        const typeMatch = item.type?.toLowerCase().includes(searchLower);
        const headersMatch = JSON.stringify(item.headers || {})
          .toLowerCase()
          .includes(searchLower);
        const payloadMatch = JSON.stringify(item.payload || {})
          .toLowerCase()
          .includes(searchLower);

        return typeMatch || headersMatch || payloadMatch;
      });
    }

    if (type) {
      items = items.filter(
        (item) => item.type?.toLowerCase() === type.toLowerCase(),
      );
    }

    if (status) {
      items = items.filter(
        (item) => item.status?.toLowerCase() === status.toLowerCase(),
      );
    }

    items = [...items].sort((a, b) => {
      switch (sort) {
        case "id-desc":
          return b.id - a.id;
        case "size-asc":
          return (a.size || 0) - (b.size || 0);
        case "size-desc":
          return (b.size || 0) - (a.size || 0);
        case "type":
          return (a.type || "").localeCompare(b.type || "");
        case "id-asc":
        default:
          return a.id - b.id;
      }
    });

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;

    const data = items.slice(start, start + limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  });
}

export async function getItem(id) {
  return fakeRequest(() => {
    const items = readData();
    const item = items.find((item) => item.id === Number(id));

    if (!item) {
      throw new Error("Request not found");
    }

    return item;
  });
}

export async function createItem(data) {
  return fakeRequest(() => {
    const items = readData();

    const nextId =
      items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;

    const payloadString = data.payload ? JSON.stringify(data.payload) : "";
    const calculatedSize = data.size ?? payloadString.length;

    const newItem = {
      id: nextId,
      type: data.type || "get",
      headers: data.headers || { "content-type": "application/json" },
      payload: data.payload || null,
      size: calculatedSize,
      status: data.status || "new",
    };

    writeData([...items, newItem]);

    return newItem;
  });
}

export async function updateItem(id, changes) {
  return fakeRequest(() => {
    const numericId = Number(id);
    const items = readData();

    const exists = items.some((item) => item.id === numericId);

    if (!exists) {
      throw new Error("Request not found");
    }

    const updatedItems = items.map((item) => {
      if (item.id === numericId) {
        const newPayload = changes.payload !== undefined ? changes.payload : item.payload;
        const payloadString = newPayload ? JSON.stringify(newPayload) : "";
        
        return {
          ...item,
          ...changes,
          id: numericId,
          size: changes.payload !== undefined ? payloadString.length : (changes.size ?? item.size),
        };
      }
      return item;
    });

    writeData(updatedItems);

    return updatedItems.find((item) => item.id === numericId);
  });
}

export async function deleteItem(id) {
  return fakeRequest(() => {
    const numericId = Number(id);
    const items = readData();

    const exists = items.some((item) => item.id === numericId);

    if (!exists) {
      throw new Error("Request not found");
    }

    const updatedItems = items.filter((item) => item.id !== numericId);

    writeData(updatedItems);

    return {
      success: true,
      id: numericId,
    };
  });
}