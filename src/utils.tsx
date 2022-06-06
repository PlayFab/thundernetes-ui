async function fetchWithTimeout(resource: string, options: any = {}) {
  const { timeout = 300000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  });
  clearTimeout(id);

  return response;
}

export { fetchWithTimeout };
