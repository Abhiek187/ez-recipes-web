import Term from './term.model';

interface TermStore {
  terms: Term[];
  expireAt: number;
}

export default TermStore;
