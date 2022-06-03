import {create} from 'browser-sync';
import paths from '../paths';

export const browserSyncInstance = create();

export default () => {
  return browserSyncInstance.init({
    server: {baseDir: paths.build},
    notify: false,
    open: true
  })
};

