import fetch from 'node-fetch';

interface Args {
  requests: {
    id: string
    url: string
  }[]
  cb: (id: string, url: string, res: any) => void
  options?: any
}

const defaultOptions = {
  batchSize: 10,
  minDelay: 1000,
  maxDelay: 1000
};

const delay = (min: number, max: number) => {
  const duration = Math.floor(Math.random() * (max - min)) + min;
  return new Promise(resolve => setTimeout(resolve, duration));
};

const batchRequest = async ({ requests, cb, options }: Args) => {
  const config = {
    ...defaultOptions,
    ...options
  };

  while (requests.length > 0) {
    await delay(config.minDelay, config.maxDelay);

    const batch = requests.splice(0, config.batchSize).map(req =>
      fetch(req.url).then(res => res.json())
        .then(json => {
          cb(req.id, req.url, json);
        }).catch(e => {
          console.error(e);
        })
    );
    await Promise.all(batch);
  }
};

export default batchRequest;