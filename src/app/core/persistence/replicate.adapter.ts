export namespace FlatFileSyncAdapter {

  export interface Config {
    provider: Providers;
    token: string;
    syncInterval: number;
    changeCheckFn: () => boolean;
    isAlwaysWaitForSync: boolean;
  }

  export interface HistoryItem {
    timestamp: number;
    action: keyof LocalForageDbMethodsCore;
    args: any;
  }

  export enum Providers {
    'GoogleDrive' = 'GoogleDrive',
    'Dropbox' = 'Dropbox',
  }

  export enum EventTypes {
    'AuthStatusChange' = 'AuthStatusChange',
    'AuthError' = 'AuthError',
    'Change' = 'Change',
  }

}

export interface FlatFileSyncProvider extends LocalForageDbMethodsCore {
  isLoggedIn: boolean;
  history: FlatFileSyncAdapter.HistoryItem[];

  setToken(token: string);

  setOnAuthChangeCallback(fn: Function);

  // gets file list for each database
  _initRemoteChangesListener();

  _emitChange();

  _saveHistory();
}

// export class LocalForageFlatFileSyncAdapter implements LocalForageDbMethodsCore {
export class LocalForageFlatFileSyncAdapter {
  isLoggedIn: boolean;

  constructor() {

  }

  login() {
  }

  on(evName: FlatFileSyncAdapter.EventTypes) {
  }
}

/*
# GENERAL CONCEPT:
* save data in a tree structure
* use tree structure on the file system

## Abstract Tree
dbName/collectionName/itemId.json

## Outline for Folder Structure
/app-name/
/app-name/db
/app-name/db/collection
/app-name/db/collection/itemId.json

### if we cannot use the the changed timestamp on the file we create last changed timestamp files
/app-name/db/changed.stamp
/app-name/db/collection/changed.stamp
/app-name/db/collection/itemId.json
/app-name/db/collection/itemId.changed.stamp


## Remote data always needs to be checked for consistency

## CACHING CONCEPT
local history of changes is created and replayed sequentially until successfull

 */
