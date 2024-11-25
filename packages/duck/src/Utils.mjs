import * as Ow from '@produck/ow';

export function throwNotInstalled() {
	Ow.Error.Common('Installation not completed.');
}
