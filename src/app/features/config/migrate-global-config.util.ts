import {GlobalConfigState, IdleConfig, TakeABreakConfig} from './global-config.model';
import {DEFAULT_GLOBAL_CONFIG} from './default-global-config.const';
import {MODEL_VERSION_KEY} from '../../app.constants';

const MODEL_VERSION = 1;

export const migrateGlobalConfigState = (globalConfigState: GlobalConfigState): GlobalConfigState => {
  if (!globalConfigState || (globalConfigState && globalConfigState[MODEL_VERSION_KEY] === MODEL_VERSION)) {
    return globalConfigState;
  } else {
  }

  // NOTE: needs to run before default stuff
  globalConfigState = _migrateMiscToSeparateKeys(globalConfigState);

  // NOTE: absolutely needs to come last as otherwise the previous defaults won't work
  globalConfigState = _extendConfigDefaults(globalConfigState);

  globalConfigState[MODEL_VERSION_KEY] = MODEL_VERSION;
  return globalConfigState;
};

const _migrateMiscToSeparateKeys = (config: GlobalConfigState): GlobalConfigState => {
  const idle: IdleConfig = !!(config.idle)
    ? config.idle
    : {
      ...DEFAULT_GLOBAL_CONFIG.idle,
      // tslint:disable-next-line
      isOnlyOpenIdleWhenCurrentTask: config.misc['isOnlyOpenIdleWhenCurrentTask'],
      // tslint:disable-next-line
      isEnableIdleTimeTracking: config.misc['isEnableIdleTimeTracking'],
      // tslint:disable-next-line
      minIdleTime: config.misc['minIdleTime'],
      // tslint:disable-next-line
      isUnTrackedIdleResetsBreakTimer: config.misc['isUnTrackedIdleResetsBreakTimer'],
    };

  const takeABreak: TakeABreakConfig = !!(config.takeABreak)
    ? config.takeABreak
    : {
      ...DEFAULT_GLOBAL_CONFIG.takeABreak,
      // tslint:disable-next-line
      isTakeABreakEnabled: config.misc['isTakeABreakEnabled'],
      // tslint:disable-next-line
      takeABreakMessage: config.misc['takeABreakMessage'],
      // tslint:disable-next-line
      takeABreakMinWorkingTime: config.misc['takeABreakMinWorkingTime'],
    };

  // we delete the old keys. worst case is, that the default settings are used for outdated versions of the app
  const obsoleteMiscKeys: ((keyof TakeABreakConfig) | (keyof IdleConfig))[] = [
    'isTakeABreakEnabled',
    'takeABreakMessage',
    'takeABreakMinWorkingTime',

    'isOnlyOpenIdleWhenCurrentTask',
    'isEnableIdleTimeTracking',
    'minIdleTime',
    'isUnTrackedIdleResetsBreakTimer',
  ];

  obsoleteMiscKeys.forEach(key => {
    if (config[key]) {
      delete config[key];
    }
  });

  return {
    ...config,
    idle,
    takeABreak,
  };
};

const _extendConfigDefaults = (config: GlobalConfigState): GlobalConfigState => {
  return {
    ...DEFAULT_GLOBAL_CONFIG,
    ...config,
  };
};


