class LoaderError extends Error {
  constructor(err) {
    super(err);

    this.name = err.name || 'Loader Error';
    this.message = `${err.name}\n\n${err.message}\n`;
    this.stack = false;
  }
}

export default LoaderError;
