declare function fetchJsonp(url: string, options?: fetchJsonp.Options): Promise<fetchJsonp.Response>;

declare namespace fetchJsonp {
  interface Options {
    timeout?: number;
    jsonpCallback?: string;
    jsonpCallbackFunction?: string;
  }

  interface Response {
    json(): Promise<any>;
    json<T>(): Promise<T>;
    ok: boolean;
  }
}

export = fetchJsonp;
