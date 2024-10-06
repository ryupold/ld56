import { htmlToVode } from '../../vode/index.js';

declare var remarkable: any;
let _remarkable: any;
export function mdToVode<S = any>(md: string) {
    if (!_remarkable) {
        _remarkable = new remarkable.Remarkable();
    }
    const htmlString = _remarkable.render(md) as string;
    return htmlToVode<S>(htmlString);
}
