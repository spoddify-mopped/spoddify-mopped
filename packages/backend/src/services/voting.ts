import Logger from '../logger/logger';
import SpotifyPlayerService from './player';

type CurrentVoting = {
  started: Date;
  votes: Record<string, boolean>;
};

const VOTING_TIME_MS = 120000; // 2 minutes

const LOGGER = Logger.create(__filename);

export default class VotingService {
  private spotifyPlayerService: SpotifyPlayerService;

  private currentVoting: CurrentVoting | undefined = undefined;

  public constructor(spotifyClient: SpotifyPlayerService) {
    this.spotifyPlayerService = spotifyClient;
  }

  public addVote = (uuid: string, skip: boolean): void => {
    if (!this.currentVoting) {
      this.startVoting(uuid, skip);
      return;
    }

    const vote = this.currentVoting.votes[uuid];

    if (vote !== undefined) {
      throw new Error('UUID has already voted.');
    }

    this.currentVoting.votes[uuid] = skip;
    LOGGER.debug(
      `Add new vote - ${this.getWantSkip()} : ${this.getNoSkip()} for a skip`
    );
  };

  private getWantSkip = () =>
    Object.keys(this.currentVoting.votes).filter(
      (key) => this.currentVoting.votes[key]
    ).length;

  private getNoSkip = () =>
    Object.keys(this.currentVoting.votes).filter(
      (key) => !this.currentVoting.votes[key]
    ).length;

  private votingResult = async () => {
    const wantSkip = this.getWantSkip();
    const noSkip = this.getNoSkip();

    if (wantSkip > noSkip) {
      await this.spotifyPlayerService.next();
    }

    this.currentVoting = undefined;
  };

  private startVoting = (uuid: string, skip: boolean) => {
    this.currentVoting = {
      started: new Date(),
      votes: {
        [uuid]: skip,
      },
    };

    LOGGER.debug(
      `Add new vote - ${this.getWantSkip()} : ${this.getNoSkip()} for a skip`
    );

    const interval = setInterval(async () => {
      await this.votingResult();
      clearInterval(interval);
    }, VOTING_TIME_MS);
  };
}
