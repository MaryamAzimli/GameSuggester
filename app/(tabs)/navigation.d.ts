import { Game } from './types';

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      home: undefined;
      explore: undefined;
      profilePage: undefined;
      'home/gameCard': { game: Game };
    }
  }
}
