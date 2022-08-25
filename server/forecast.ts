async function getForecast(lat: string, lon: string) {
  const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}'`;
  console.info(`GET ${url}`);
  try {
    const response = await fetch(url, {
      headers: {
        // Authorization: `Bearer ${this.authData.access_token}`,
      },
    });

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
  } catch (e) {
    console.error(e);
  }
}

export default getForecast;
