import fetch from 'node-fetch';

const BASE_URL = 'https://api.seomonitor.com/v1';

const makeRequest = async (endpoint: string) => {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  return await res.json();
};

const getAllKeywordsVisibility = async () => {

};