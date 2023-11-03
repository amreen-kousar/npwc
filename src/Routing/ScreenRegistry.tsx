import React from 'react';

type ScreenName =
  | 'Home'
  | 'Detail'
  | 'Login'
  | 'AppLoader'
  | 'Exercise'
  | 'Diet'
  | 'ItemsOfCategory'
  | 'Register'
  | 'Profile'
  | 'SetsOfCategory'

type ScreenType = React.ComponentType<any>;
type ScreenBuilderType = () => ScreenType;

let screenBuilderRegistry = new Map<ScreenName, ScreenBuilderType>();
/**
 * Returns a function for lazily loading a screen.
 */
export function getScreenBuilder(screen: ScreenName): ScreenBuilderType {
  if (!screenBuilderRegistry.has(screen)) {
    let cached: ScreenType | null = null;
    const builder = () => {
      if (cached === null) {
        const start = global.performance.now();
        console.log(`😴 Lazily registering Screen "${screen}"...`);

        cached = getScreen(screen);
        if (typeof cached === 'function') {
          cached = React.memo(cached);
        }

        const end = global.performance.now();
        console.log(
          `😄 Lazily registered Screen "${screen}" in ${end - start}ms!`,
        );
      }
      return cached;
    };
    screenBuilderRegistry.set(screen, builder);
  }

  return screenBuilderRegistry.get(screen);
}

function getScreen(screenName: ScreenName): ScreenType {
  switch (screenName) {
    case 'Home':
      return require('../screens/Home/Home').default;
    // case 'Detail':
    //   return require('../screens/Home/Detail').default;
    case 'Login':
      return require('../screens/Login/Login').default;
    case 'Register':
      return require('../screens/Register/Register').default;
    case 'Exercise':
      return require('../screens/Exercise/Exercise').default;
      case 'Diet':
      return require('../screens/Diet/Diet').default;
    case 'ItemsOfCategory':
      return require('../screens/Diet/ItemsOfCategory').default;
    case 'SetsOfCategory':
      return require('../screens/Exercise/SetsOfCategory').default;
    case 'Profile':
      return require('../screens/Profile/Profile').default;
    case 'AppLoader':
      return require('../screens/AppLoader').default;
  }
  return assertUnreachableScreen(screenName);
}
function assertUnreachableScreen(screenName: never): never {
  throw new Error(
    `getScreen(...): Failed to create screen builder for screen name "${screenName}" - the requested screen was not found.`,
  );
}
