import { PREFIX } from "../api/prefix.js";
import { State } from "../state.js";
import { Sketch } from "./p5.js";

export function loadCommonAssets(s: State, r: Sketch) {
    s.images.hud.background = r.loadImage(`${PREFIX}/pub/assets/img/hud/background.png`);
    s.images.hud.curtain = r.loadImage(`${PREFIX}/pub/assets/img/hud/curtain.png`);
}

export function loadCreatureAssets(s: State, r: Sketch) {
    s.images.creaturesA = [
        ...loadImages(r,
            `${PREFIX}/pub/assets/img/creatures/monster001.png`,
            `${PREFIX}/pub/assets/img/creatures/monster002.png`,
            `${PREFIX}/pub/assets/img/creatures/monster003.png`,
            `${PREFIX}/pub/assets/img/creatures/monster004.png`,
            `${PREFIX}/pub/assets/img/creatures/monster005.png`,
            `${PREFIX}/pub/assets/img/creatures/monster006.png`,
            `${PREFIX}/pub/assets/img/creatures/monster007.png`,
            `${PREFIX}/pub/assets/img/creatures/monster008.png`,
            `${PREFIX}/pub/assets/img/creatures/monster009.png`,
            `${PREFIX}/pub/assets/img/creatures/monster010.png`,
            `${PREFIX}/pub/assets/img/creatures/monster011.png`,
            `${PREFIX}/pub/assets/img/creatures/monster012.png`,
            `${PREFIX}/pub/assets/img/creatures/monster013.png`,
            `${PREFIX}/pub/assets/img/creatures/monster014.png`,
            `${PREFIX}/pub/assets/img/creatures/monster015.png`,
            `${PREFIX}/pub/assets/img/creatures/monster016.png`,
        )
    ]
    
    s.images.creaturesB = [
        ...loadImages(r,
            `${PREFIX}/pub/assets/img/creatures/monster001_2.png`,
            `${PREFIX}/pub/assets/img/creatures/monster002_2.png`,
            `${PREFIX}/pub/assets/img/creatures/monster003_2.png`,
            `${PREFIX}/pub/assets/img/creatures/monster004_2.png`,
            `${PREFIX}/pub/assets/img/creatures/monster005_2.png`,
            `${PREFIX}/pub/assets/img/creatures/monster006_2.png`,
            `${PREFIX}/pub/assets/img/creatures/monster007_2.png`,
            `${PREFIX}/pub/assets/img/creatures/monster008_2.png`,
            `${PREFIX}/pub/assets/img/creatures/monster009_2.png`,
            `${PREFIX}/pub/assets/img/creatures/monster010_2.png`,
            `${PREFIX}/pub/assets/img/creatures/monster011_2.png`,
            `${PREFIX}/pub/assets/img/creatures/monster012_2.png`,
            `${PREFIX}/pub/assets/img/creatures/monster013_2.png`,
            `${PREFIX}/pub/assets/img/creatures/monster014_2.png`,
            `${PREFIX}/pub/assets/img/creatures/monster015_2.png`,
            `${PREFIX}/pub/assets/img/creatures/monster016_2.png`,
        )
    ]
}


export function loadClawAssets(s: State, r: Sketch) {
    s.images.claw.clawSegment = r.loadImage(`${PREFIX}/pub/assets/img/claw/claw_segment.png`);
    s.images.claw.clawBolt = r.loadImage(`${PREFIX}/pub/assets/img/claw/claw_bolt.png`);
    s.images.claw.chainSegment = r.loadImage(`${PREFIX}/pub/assets/img/claw/chain_segment.png`);
}
export function loadHousingAssets(s: State, r: Sketch) {
    s.images.housing.floor = r.loadImage(`${PREFIX}/pub/assets/img/housing/floor_wall.png`);
    s.images.housing.left = r.loadImage(`${PREFIX}/pub/assets/img/housing/left_wall.png`);
    s.images.housing.middle = r.loadImage(`${PREFIX}/pub/assets/img/housing/middle_wall.png`);
    s.images.housing.right = r.loadImage(`${PREFIX}/pub/assets/img/housing/right_wall.png`);
}

function* loadImages(r: Sketch, ...srcs: string[]) {
    for (const src of srcs) {
        yield r.loadImage(src);
    }
}