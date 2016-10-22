export class IAuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface IAuthStore {
  currentUser: IAuthUser
  currentUserId: string
  onAuthStateChanged(cb: () => any)
  login(providerString: string)
}
