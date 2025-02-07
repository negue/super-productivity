import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {GlobalConfigActionTypes} from './store/global-config.actions';
import {Observable} from 'rxjs';
import {
  GlobalConfigSectionKey,
  GlobalConfigState,
  GlobalSectionConfig, GoogleDriveSyncConfig,
  GoogleSession,
  IdleConfig,
  MiscConfig,
  TakeABreakConfig
} from './global-config.model';
import {
  selectConfigFeatureState, selectGoogleDriveSyncConfig,
  selectGoogleSession,
  selectIdleConfig,
  selectMiscConfig,
  selectTakeABreakConfig
} from './store/global-config.reducer';
import {PersistenceService} from '../../core/persistence/persistence.service';
import {Actions, ofType} from '@ngrx/effects';
import {distinctUntilChanged, shareReplay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GlobalConfigService {
  cfg$: Observable<GlobalConfigState> = this._store.pipe(
    select(selectConfigFeatureState),
    distinctUntilChanged(),
    shareReplay(1),
  );

  googleDriveSyncCfg$: Observable<GoogleDriveSyncConfig> = this._store.pipe(
    select(selectGoogleDriveSyncConfig),
    distinctUntilChanged(),
    shareReplay(1),
  );

  misc$: Observable<MiscConfig> = this._store.pipe(
    select(selectMiscConfig),
    distinctUntilChanged(),
    shareReplay(1),
  );

  idle$: Observable<IdleConfig> = this._store.pipe(
    select(selectIdleConfig),
    distinctUntilChanged(),
    shareReplay(1),
  );

  takeABreak$: Observable<TakeABreakConfig> = this._store.pipe(
    select(selectTakeABreakConfig),
    distinctUntilChanged(),
    shareReplay(1),
  );

  googleSession$: Observable<GoogleSession> = this._store.pipe(
    select(selectGoogleSession),
    distinctUntilChanged(),
  );

  cfg: GlobalConfigState;

  onCfgLoaded$: Observable<any> = this._actions$.pipe(ofType(GlobalConfigActionTypes.LoadGlobalConfig));

  constructor(
    private readonly _store: Store<any>,
    private readonly _actions$: Actions,
    private readonly _persistenceService: PersistenceService
  ) {
    // this.cfg$.subscribe((val) => console.log(val));
    this.cfg$.subscribe((cfg) => this.cfg = cfg);
  }

  async load(isOmitTokens = false) {
    const cfg = await this._persistenceService.globalConfig.load();
    if (cfg && Object.keys(cfg).length > 0) {
      this.loadState(cfg, isOmitTokens);
    } else {
      // NOTE: this happens if there never have been any changes to the default cfg
      console.warn('ConfigService No config found in ls');
    }
  }

  loadState(state: GlobalConfigState, isOmitTokens = false) {
    this._store.dispatch({
      type: GlobalConfigActionTypes.LoadGlobalConfig,
      // always extend default config
      payload: {
        cfg: state,
        isOmitTokens
      },
    });
  }

  updateSection(sectionKey: GlobalConfigSectionKey, sectionCfg: Partial<GlobalSectionConfig>, isSkipLastActive = false) {
    this._store.dispatch({
      type: GlobalConfigActionTypes.UpdateGlobalConfigSection,
      payload: {
        sectionKey,
        sectionCfg,
        isSkipLastActive,
      },
    });
  }
}
