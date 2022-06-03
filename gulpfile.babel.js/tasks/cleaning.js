import del from 'del';
import paths from '../paths';

export default () => del(paths.build);