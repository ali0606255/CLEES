/**
 * Inline script (runs before hydration) that reveals `.reveal` elements as they enter the viewport.
 * Running it before React hydrates means above-the-fold content is never held back by JavaScript.
 */
export const revealScript = `(function(){
  function scan(){
    if(!('IntersectionObserver' in window)){document.querySelectorAll('.reveal').forEach(function(e){e.classList.add('is-visible')});return;}
    var io=window.__cleesIO||(window.__cleesIO=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target);}})},{rootMargin:'0px 0px -60px 0px'}));
    document.querySelectorAll('.reveal:not(.is-visible)').forEach(function(e){io.observe(e)});
  }
  window.__cleesReveal=scan;scan();
})();`;
