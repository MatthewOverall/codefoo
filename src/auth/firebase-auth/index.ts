import { IAuthStore } from '../AuthStore'
import * as firebase from 'firebase'

const authProviders = {
  'github': new firebase.auth.GithubAuthProvider(),
  'google': new firebase.auth.GoogleAuthProvider(),
  'twitter': new firebase.auth.TwitterAuthProvider(),
  'facebook': new firebase.auth.FacebookAuthProvider(),
}

export class FirebaseAuthStore implements IAuthStore {

  currentUser: firebase.User;

  public get currentUserId(): string {
    return this.currentUser ? this.currentUser.uid : null;
  }

  constructor(public firebaseApp: firebase.app.App) {
    this.currentUser = firebaseApp.auth().currentUser
    this.firebaseApp.auth().onAuthStateChanged((user) => {
      this.authStateChanged(user)
    })
  }

  onAuthStateChanged(nextOrObserver: Object, optError?: (a: firebase.auth.Error) => any, optCompleted?: () => any): () => any {
    return this.firebaseApp.auth().onAuthStateChanged(nextOrObserver, optError, optCompleted)
  }

  private async authStateChanged(user: firebase.User): Promise<any> {
    // ignore a token refresh or default load
    console.log('auth changed');
    if ((user && this.currentUserId === user.uid) || (!user && !this.currentUserId)) {
      return
    }
    this.currentUser = user

    if (user) {
      await this.writeUserData(user.uid, user.displayName, user.email, user.photoURL)
    } else {
      // not signed in....
    }
  }

  /**
   * Writes the user's data to the database.
   */
  private async writeUserData(userId: string, displayName: string, email: string, photoURL: string): Promise<any> {
    firebase.database().ref('users/' + userId).set({
      id: userId,
      displayName: displayName,
      email: email,
      photoURL: photoURL
    });
  }

  async login(providerString: string): Promise<any> {
    let provider = authProviders[providerString]
    await this.firebaseApp.auth().signInWithPopup(provider)
  }
}
