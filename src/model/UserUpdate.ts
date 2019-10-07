import { UserCreate } from './UserCreate';

// For clarity and naming a UserUpdate makes sense however in the simplest case it does not
// differ from UserCreate.  In practice this is not likely to be the case however so I'm going to
// leave this split out.
// tslint:disable-next-line: no-empty-interface
export interface UserUpdate extends UserCreate {
}
