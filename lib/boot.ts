// Runs inline in <head> before first paint. Decides, once, how much of the
// experience this device should receive — so nothing visibly downgrades later.
//
//   data-tier="full"   everything: prelude, cursor, light, transitions, parallax
//   data-tier="lite"   slow connection, Save-Data, or low memory/CPU: atmosphere
//                      stays, continuous animation and heavy extras switch off
//   data-tier="still"  prefers-reduced-motion: composition intact, no motion
//
//   data-pointer="fine" | "coarse"   mouse/trackpad vs touch
//
// The opening prelude plays once per session, on the home page, for full-tier
// desktop visitors. Phones (arriving from Instagram, a text, a search) go
// straight to their own hero choreography. Crawlers never see it.
export const bootScript = `(function(){
var d=document.documentElement;d.classList.add('js');
function mq(q){try{return matchMedia(q).matches}catch(e){return false}}
var n=navigator,c=n.connection||{};
var still=mq('(prefers-reduced-motion: reduce)');
var lite=!!c.saveData||/(^|slow-)2g|3g/.test(c.effectiveType||'')||(n.deviceMemory&&n.deviceMemory<=2)||(n.hardwareConcurrency&&n.hardwareConcurrency<=2);
d.dataset.tier=still?'still':lite?'lite':'full';
d.dataset.pointer=mq('(hover: hover) and (pointer: fine)')?'fine':'coarse';
try{if(location.pathname==='/'&&d.dataset.tier==='full'&&d.dataset.pointer==='fine'&&!sessionStorage.getItem('ej:prelude')&&!/bot|crawl|spider|slurp|preview/i.test(n.userAgent)){d.classList.add('prelude');sessionStorage.setItem('ej:prelude','1');setTimeout(function(){d.classList.remove('prelude')},4200)}}catch(e){}
})();`;
