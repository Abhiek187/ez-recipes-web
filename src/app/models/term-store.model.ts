import Term from './term.model';

type TermStore = {
  terms: Term[];
  expireAt: number;
};

export default TermStore;
