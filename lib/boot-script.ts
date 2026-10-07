import { HUES } from "./accent";

export const INTRO_KEY = "umex-intro";

/**
 * Runs in <head> before first paint:
 * - applies the stored accent hue, so there is no violet flash
 * - decides whether the opener plays: once per session, again on a hard reload of "/",
 *   never with prefers-reduced-motion. When it is skipped the hero starts revealed.
 */
export const BOOT_SCRIPT = `(function(){var d=document.documentElement;
try{var H=${JSON.stringify(HUES)};var a=localStorage.getItem('umex-accent');if(a&&H[a])d.style.setProperty('--accH',H[a]);}catch(e){}
try{var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;var n=performance.getEntriesByType('navigation')[0];
var reload=!!n&&n.type==='reload';var seen=sessionStorage.getItem('${INTRO_KEY}');
if(location.pathname!=='/'||rm||(seen&&!reload)){d.dataset.opener='skip';d.dataset.revealed='';}else{d.dataset.opener='show';}
}catch(e){d.dataset.opener='skip';d.dataset.revealed='';}})();`;
