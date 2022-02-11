export type SpotifyErrorResponse = {
  error: {
    status: number;
    message: string;
  };
};

export class SpotifyApiError extends Error {
  public status: number;

  public constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
