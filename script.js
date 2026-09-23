
(function(){
  var root=document.documentElement;
  try{var s=localStorage.getItem('theme'); if(s) root.setAttribute('data-theme',s);}catch(e){}
  function init(scope){
    scope.querySelectorAll('.toggler').forEach(function(tg){ if(tg._i) return; tg._i=1;
      var links=tg.parentNode.querySelector('.nav-links');
      tg.addEventListener('click',function(){var o=links.classList.toggle('open'); tg.setAttribute('aria-expanded',o);});
      links.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){links.classList.remove('open'); tg.setAttribute('aria-expanded','false');});});
    });
    scope.querySelectorAll('.viewer').forEach(function(v){ if(v._i) return; v._i=1;
      var cmp=v.querySelector('.compare'), rng=cmp.querySelector('input'), d=v.querySelector('.mag-data').dataset;
      rng.addEventListener('input',function(){cmp.style.setProperty('--pos',rng.value+'%');});
      v.querySelectorAll('.seg button').forEach(function(b){b.addEventListener('click',function(){
        v.querySelectorAll('.seg button').forEach(function(x){x.setAttribute('aria-pressed','false');});
        b.setAttribute('aria-pressed','true'); var m=b.dataset.mag;
        cmp.querySelector('.orig').src=d[m+'o']; cmp.querySelector('.cam').src=d[m+'c'];
        v.querySelector('.pred').innerHTML='Predicted: '+(m==='40'?'<b class="no">Benign (51.9%)</b>':'<b class="ok">Malignant (61.9%)</b>');
      });});
    });
    scope.querySelectorAll('.frontier').forEach(function(f){ if(f._i) return; f._i=1;
      var M=JSON.parse(f.dataset.metrics), L=Object.keys(M).sort(function(a,b){return a-b;}), svg=f.querySelector('.fplot'), NS='http://www.w3.org/2000/svg';
      var W=460,H=280,pl=52,pr=16,pt=14,pb=40, x0=0.57,x1=0.69,y0=0,y1=0.03;
      function X(v){return pl+(v-x0)/(x1-x0)*(W-pl-pr);} function Y(v){return H-pb-(v-y0)/(y1-y0)*(H-pt-pb);}
      function el(t,a){var e=document.createElementNS(NS,t); for(var k in a) e.setAttribute(k,a[k]); svg.appendChild(e); return e;}
      for(var g=0;g<=3;g++){var yv=g*0.01; el('line',{x1:pl,x2:W-pr,y1:Y(yv),y2:Y(yv),stroke:'rgba(199,210,254,.14)'}); var t=el('text',{x:pl-8,y:Y(yv)+4,'text-anchor':'end',fill:'#A5B4FC','font-size':'10','font-family':'Inter,system-ui'}); t.textContent=yv.toFixed(2);}
      [0.58,0.62,0.66].forEach(function(xv){var t=el('text',{x:X(xv),y:H-pb+18,'text-anchor':'middle',fill:'#A5B4FC','font-size':'10','font-family':'Inter,system-ui'}); t.textContent=xv.toFixed(2);});
      var tx=el('text',{x:(pl+W-pr)/2,y:H-4,'text-anchor':'middle',fill:'#C7D2FE','font-size':'10.5','font-family':'Inter,system-ui'}); tx.textContent='material score of what gets shown \u2192 greener';
      var ty=el('text',{x:12,y:(pt+H-pb)/2,'text-anchor':'middle',fill:'#C7D2FE','font-size':'10.5','font-family':'Inter,system-ui',transform:'rotate(-90 12 '+((pt+H-pb)/2)+')'}); ty.textContent='MAP@12';
      var up=L.map(function(l){return X(M[l].material)+','+Y(M[l].ci_high);}), dn=L.slice().reverse().map(function(l){return X(M[l].material)+','+Y(M[l].ci_low);});
      el('polygon',{points:up.concat(dn).join(' '),fill:'rgba(94,234,212,.14)'});
      el('polyline',{points:L.map(function(l){return X(M[l].material)+','+Y(M[l].map12);}).join(' '),fill:'none',stroke:'#5EEAD4','stroke-width':2.2});
      L.forEach(function(l){el('circle',{cx:X(M[l].material),cy:Y(M[l].map12),r:2.8,fill:'#5EEAD4'});});
      var vl=el('line',{stroke:'rgba(255,255,255,.35)','stroke-dasharray':'3 4'}), hl=el('line',{stroke:'rgba(255,255,255,.35)','stroke-dasharray':'3 4'});
      var ring=el('circle',{r:11,fill:'rgba(255,255,255,.12)',stroke:'#fff','stroke-width':1.5}), dot=el('circle',{r:5.5,fill:'#fff'});
      var rng=f.querySelector('input'), base=M[L[0]].map12;
      function upd(){var l=L[+rng.value], m=M[l], cx=X(m.material), cy=Y(m.map12);
        [dot,ring].forEach(function(c){c.setAttribute('cx',cx); c.setAttribute('cy',cy);});
        vl.setAttribute('x1',cx); vl.setAttribute('x2',cx); vl.setAttribute('y1',cy); vl.setAttribute('y2',H-pb);
        hl.setAttribute('x1',pl); hl.setAttribute('x2',cx); hl.setAttribute('y1',cy); hl.setAttribute('y2',cy);
        f.querySelector('.lam b').textContent=(+l).toFixed(1); f.querySelector('.r-map').textContent=m.map12.toFixed(4);
        f.querySelector('.r-keep').textContent=Math.round(m.map12/base*100)+'%'; f.querySelector('.r-mat').textContent=m.material.toFixed(3);
        f.querySelector('.r-tail').textContent=Math.round(m.long_tail*100)+'%';}
      rng.addEventListener('input',upd); upd();
    });
    scope.querySelectorAll('.card,.featured,.exp-card').forEach(function(c){ if(c._s) return; c._s=1;
      c.addEventListener('mousemove',function(e){var b=c.getBoundingClientRect(); c.style.setProperty('--mx',(e.clientX-b.left)+'px'); c.style.setProperty('--my',(e.clientY-b.top)+'px');});
    });
    scope.querySelectorAll('.filters').forEach(function(f){ if(f._i) return; f._i=1;
      var cards=f.parentNode.querySelectorAll('.card[data-cat]');
      f.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){
        f.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed','false');}); b.setAttribute('aria-pressed','true');
        var c=b.dataset.filter; cards.forEach(function(k){k.hidden=!(c==='all'||k.dataset.cat.split(' ').indexOf(c)>-1);});
      });});
    });
    scope.querySelectorAll('.copy').forEach(function(cp){ if(cp._i) return; cp._i=1;
      cp.addEventListener('click',function(){ var a=cp.dataset.copy;
        function done(){cp.textContent='Copied';setTimeout(function(){cp.textContent='Copy';},2000);}
        function fb(){var t=document.createElement('textarea');t.value=a;document.body.appendChild(t);t.select();try{document.execCommand('copy');done();}catch(e){}document.body.removeChild(t);}
        if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(a).then(done,fb);}else{fb();}
      });
    });
    scope.querySelectorAll('.yr').forEach(function(y){y.textContent=new Date().getFullYear();});
    scope.querySelectorAll('footer .top').forEach(function(t){ if(t._i) return; t._i=1; t.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});});
    scope.querySelectorAll('.theme').forEach(function(t){ if(t._i) return; t._i=1; t.addEventListener('click',function(){
      var dark=root.getAttribute('data-theme')==='dark'||(!root.getAttribute('data-theme')&&matchMedia('(prefers-color-scheme: dark)').matches);
      var n=dark?'light':'dark'; root.setAttribute('data-theme',n); try{localStorage.setItem('theme',n);}catch(e){}
    });});
  }

  // animated network in hero
  var cv=document.getElementById('net');
  if(cv && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    var ctx=cv.getContext('2d'), W,H, N=[], mx=-1e4,my=-1e4;
    function size(){W=cv.width=cv.offsetWidth; H=cv.height=cv.offsetHeight;}
    size(); window.addEventListener('resize',size);
    for(var i=0;i<70;i++) N.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:1.2+Math.random()*1.6});
    cv.parentNode.addEventListener('mousemove',function(e){var b=cv.getBoundingClientRect(); mx=e.clientX-b.left; my=e.clientY-b.top;});
    cv.parentNode.addEventListener('mouseleave',function(){mx=my=-1e4;});
    (function frame(){
      ctx.clearRect(0,0,W,H);
      for(var i=0;i<N.length;i++){var p=N[i]; p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>H)p.vy*=-1;
        var dx=mx-p.x,dy=my-p.y,d=Math.hypot(dx,dy); if(d<160){p.x+=dx/d*.4; p.y+=dy/d*.4;}}
      for(var i=0;i<N.length;i++)for(var j=i+1;j<N.length;j++){var a=N[i],b=N[j],d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<110){ctx.strokeStyle='rgba(165,180,252,'+(0.35*(1-d/110)).toFixed(3)+')'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();}}
      for(var i=0;i<N.length;i++){var p=N[i]; ctx.fillStyle='rgba(94,234,212,.75)'; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,6.283); ctx.fill();}
      requestAnimationFrame(frame);
    })();
  }
  // count-up metrics
  function countUp(el){var t=el.textContent, m=t.match(/^([^0-9]*)([0-9][0-9,]*\.?[0-9]*)(.*)$/); if(!m||el._c) return; el._c=1;
    var end=parseFloat(m[2].replace(/,/g,'')), dec=(m[2].split('.')[1]||'').length, t0=null;
    function step(ts){ if(!t0)t0=ts; var k=Math.min(1,(ts-t0)/1100); k=1-Math.pow(1-k,3);
      var v=(end*k).toFixed(dec); if(m[2].indexOf(',')>-1) v=Number(v).toLocaleString('en-US',{minimumFractionDigits:dec});
      el.textContent=m[1]+v+m[3]; if(k<1) requestAnimationFrame(step);} requestAnimationFrame(step);}
  var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(e){ if(!e.isIntersecting) return;
      e.target.classList.add('in'); if(e.target.matches('.metric b, .kpi-row b, .featured .kpis b')) countUp(e.target); io.unobserve(e.target);});},{threshold:.2}):null;
  function watch(scope){ if(!io) return; scope.querySelectorAll('.card,.exp-card,.principle,.decision,.fig,.check-panel,.metric b,.kpi-row b,.featured .kpis b').forEach(function(x){io.observe(x);}); }
  if(io && !matchMedia('(prefers-reduced-motion: reduce)').matches) document.documentElement.classList.add('anim');
  watch(document); window.__watch=watch;
  window.__initSite=init;
  init(document);
})();
