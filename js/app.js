const $=s=>document.querySelector(s),E=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const LS={g(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},s(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},x(k){try{localStorage.removeItem(k)}catch(e){}}};
/* Placeholder wolf mark: the supplied ANIXE444 image was not available, so this is an original stand-in. Replace with the real logo file. */
const logo=(n,c='var(--a)')=>`<svg width="${n}" height="${n}" viewBox="0 0 100 100" role="img" aria-label="ANX4 wolf mark"><path d="M20 8L36 30H64L80 8L88 46L74 74L50 92L26 74L12 46Z" fill="${c}"/><path d="M32 48L44 52L34 56ZM68 48L56 52L66 56ZM46 78H54L50 84Z" fill="#000"/></svg>`;
let user='user',t0=Date.now(),S=LS.g('anx_s',{h:350,i:85,t:'dark',w:0,v:60,rm:false});
const WP=['radial-gradient(ellipse at 75% 20%,var(--ag),transparent 55%),#050506','linear-gradient(135deg,#050506 40%,var(--ag))','radial-gradient(ellipse at 20% 85%,var(--ag),transparent 50%),radial-gradient(ellipse at 80% 10%,#ffffff12,transparent 40%),#0a0a0d'];
function apply(){const r=document.documentElement.style;r.setProperty('--a',`hsl(${S.h} ${S.i}% 42%)`);r.setProperty('--ag',`hsl(${S.h} ${S.i}% 42% / .35)`);document.body.dataset.t=S.t;$('#desk').style.background=WP[S.w];$('#login').style.background=WP[S.w];document.body.classList.toggle('rm',S.rm);LS.s('anx_s',S)}
/* ---------- virtual file system (shared) ---------- */
const d=c=>({t:'d',c}),f=x=>({t:'f',x});
const defFS=()=>d({home:d({user:d({Desktop:d({}),Documents:d({'readme.txt':f('Welcome to ANX4 OS.\nThese are virtual files stored only in this browser.\n')}),Downloads:d({}),Pictures:d({}),Music:d({}),Videos:d({}),Trash:d({})})})});
let FS=LS.g('anx_fs',null);if(!FS||!FS.c)FS=defFS();
const H='/home/user',sv=()=>{LS.s('anx_fs',FS);dispatchEvent(new Event('fs'))};
const P=(p,cwd)=>{p=p.replace(/^~/,H);const a=(p[0]=='/'?p:cwd+'/'+p).split('/'),o=[];for(const x of a){if(!x||x=='.')continue;x=='..'?o.pop():o.push(x)}return o};
const G=pa=>{let n=FS;for(const x of pa){if(n.t!='d'||!n.c[x])return null;n=n.c[x]}return n};
const U=pa=>'/'+pa.join('/');
function mk(pa,node){const par=G(pa.slice(0,-1));if(!par||par.t!='d')return 'no such directory';if(par.c[pa.at(-1)])return 'already exists';par.c[pa.at(-1)]=node;sv()}
function trash(pa){const par=G(pa.slice(0,-1)),n=par&&par.c[pa.at(-1)];if(!n)return;delete par.c[pa.at(-1)];let k=pa.at(-1);const T=G(['home','user','Trash']);if(T.c[k])k+='.'+Date.now()%1000;n.o=U(pa);T.c[k]=n;sv();notify('Moved to Trash: '+pa.at(-1))}
/* ---------- notifications ---------- */
const NL=[];function notify(m){NL.unshift(new Date().toLocaleTimeString()+' · '+m);const t=E('div','toast');t.textContent=m;$('#toasts').append(t);setTimeout(()=>t.remove(),2800)}
/* ---------- window manager ---------- */
const W={};let z=10,wid=0;
function tb(){const t=$('#run');t.innerHTML='';for(const id in W){const w=W[id],b=E('button','tbb'+(w.act?' act':''));b.textContent=w.ic+' '+w.title;b.onclick=()=>{if(w.min){w.min=false;w.el.style.display='';foc(id)}else if(w.act)mini(id);else foc(id)};t.append(b)}}
function foc(id){for(const k in W)W[k].act=false;W[id].act=true;W[id].el.style.zIndex=++z;tb()}
function mini(id){W[id].min=true;W[id].act=false;W[id].el.style.display='none';tb()}
function openApp(app,arg){const A=APPS[app],id=++wid,el=E('div','win'),w=W[id]={el,title:A[0],ic:A[1],cl:[],min:false,act:false};
 el.style.cssText=`left:${40+id%6*28}px;top:${24+id%6*28}px;width:${Math.min(660,innerWidth-20)}px;height:${Math.max(220,Math.min(440,innerHeight-100))}px`;
 if(innerWidth<700)el.classList.add('max');
 el.innerHTML='<div class="wh"><span class="wt"></span><button data-b="m" aria-label="Minimize">–</button><button data-b="x" aria-label="Maximize or restore">□</button><button data-b="c" aria-label="Close">✕</button></div><div class="wb"></div>';
 el.querySelector('.wt').textContent=A[1]+' '+A[0];
 const h=el.firstChild,cx={close(){w.cl.forEach(x=>x());el.classList.add('out');setTimeout(()=>el.remove(),150);delete W[id];tb()},cl:w.cl,title(t){el.querySelector('.wt').textContent=t}};
 const tog=()=>el.classList.toggle('max');
 el.addEventListener('pointerdown',()=>foc(id),true);
 h.onclick=e=>{const b=e.target.closest('button');if(!b)return;b.dataset.b=='m'?mini(id):b.dataset.b=='x'?tog():cx.close()};
 h.ondblclick=e=>{if(!e.target.closest('button'))tog()};
 h.onpointerdown=e=>{if(e.target.closest('button')||el.classList.contains('max'))return;const ox=e.clientX-el.offsetLeft,oy=e.clientY-el.offsetTop;h.setPointerCapture(e.pointerId);h.onpointermove=m=>{el.style.left=Math.max(0,Math.min(innerWidth-80,m.clientX-ox))+'px';el.style.top=Math.max(0,Math.min(innerHeight-100,m.clientY-oy))+'px'};h.onpointerup=()=>{h.onpointermove=null}};
 $('#wins').append(el);A[2](el.querySelector('.wb'),cx,arg);foc(id);notify(A[0]+' opened');$('#launch').classList.add('hide')}
/* ---------- terminal ---------- */
const ART=String.raw`  /\    /\
 /  \__/  \
 | ▼    ▼ |
  \  /\  /
   \_\/_/`;
const CMDS='help clear whoami pwd ls cd mkdir touch cat echo date uname neofetch fastfetch history sudo apt ping ip reboot exit'.split(' ');
function term(b,c){b.classList.add('term');const out=E('div'),row=E('div'),inp=E('input');inp.autocapitalize='off';inp.autocomplete='off';inp.spellcheck=false;inp.setAttribute('aria-label','Terminal input');
 let cwd=H,hist=[],hi=0;const pw=()=>cwd==H?'~':cwd.replace(H,'~');
 const pr=()=>`<span class="pr">┌──(anx4㉿localhost)-[${esc(pw())}]</span>`;
 const p=(h,k)=>{const e=E('pre',k,h);out.append(e)};
 const prow=()=>{row.innerHTML=pr()+'<br><span class="pr">└─$</span> ';row.append(inp)};
 b.append(out,row);p(`<span class="pr">${esc(ART)}</span>\nWelcome to ANX4 OS.\nExperimental environment initialized.\nType 'help' to explore available commands.\n<span class="m">Simulated shell: commands run in this page, not on a real Linux kernel.</span>`);prow();
 const info=()=>`<span class="pr">${esc(ART)}</span>\n<span class="pr">${esc(user)}@anx4</span>\nOS: ANX4 OS (simulated)\nHost: Browser Simulation\nKernel: Not available (simulated)\nShell: anx4-sh (simulated)\nResolution: ${innerWidth}x${innerHeight}\nUptime: ${Math.round((Date.now()-t0)/60000)} min (this session)`;
 const run=l=>{const a=l.trim().split(/\s+/),c0=a[0],A=l.trim().slice(c0.length).trim();
  switch(c0){case'':return;case'help':p(CMDS.join('  '));break;case'clear':out.innerHTML='';break;case'whoami':p(esc(user));break;case'pwd':p(esc(cwd));break;
  case'ls':{const n=G(P(A||'.',cwd));if(!n)p('ls: cannot access: no such file or directory');else if(n.t=='f')p(esc(A));else p(Object.keys(n.c).sort().map(k=>n.c[k].t=='d'?`<span class="d">${esc(k)}/</span>`:esc(k)).join('  ')||'<span class="m">(empty)</span>');break}
  case'cd':{const pa=P(A||'~',cwd),n=G(pa);if(!n)p('cd: no such file or directory: '+esc(A));else if(n.t!='d')p('cd: not a directory: '+esc(A));else{cwd=U(pa)||'/';if(cwd=='/')cwd='/'}break}
  case'mkdir':{const e=A?mk(P(A,cwd),d({})):'mkdir: missing operand';if(e)p('mkdir: '+esc(e));else notify('Folder created: '+A);break}
  case'touch':{const pa=P(A,cwd);if(!A)p('touch: missing operand');else if(G(pa))break;else{const e=mk(pa,f(''));e?p('touch: '+esc(e)):notify('File created: '+A)}break}
  case'cat':{const n=G(P(A,cwd));p(!A?'cat: missing operand':!n?'cat: no such file: '+esc(A):n.t=='d'?'cat: is a directory':esc(n.x)||'<span class="m">(empty file)</span>');break}
  case'echo':{const m=A.split(/\s>\s/);if(m.length>1){const pa=P(m[1].trim(),cwd);let n=G(pa);if(!n){const e=mk(pa,f(''));if(e){p('echo: '+esc(e));break}n=G(pa)}if(n.t=='f'){n.x=m[0]+'\n';sv()}}else p(esc(A));break}
  case'date':p(new Date().toString());break;
  case'uname':p('SIMULATED: ANX4-sim anx4 (no real kernel) browser-dependent');break;
  case'neofetch':p(info());break;case'fastfetch':p('<span class="pr">━━ ANX4 FASTFETCH ━━</span>\n'+info());break;
  case'history':p(hist.map((x,i)=>(i+1)+'  '+esc(x)).join('\n')||'(empty)');break;
  case'sudo':p('[sudo] password for '+esc(user)+': <span class="m">(simulated, no input is read)</span>\nsudo: simulated privilege prompt. No real privileges are granted.');break;
  case'apt':p(a[1]=='list'||!a[1]?'Demo packages (simulated): htop vim cowsay nmap-demo':a[1]=='install'?'Simulated install of '+esc(a[2]||'?')+'. Nothing was downloaded or installed.':'apt: simulated package manager. Try: apt list | apt install &lt;pkg&gt;');break;
  case'ping':p('PING '+esc(a[1]||'localhost')+' (SIMULATED, no packets sent)\n'+[1,2,3].map(i=>`64 bytes: icmp_seq=${i} time=${(8+Math.random()*20).toFixed(1)} ms`).join('\n'));break;
  case'ip':p('SIMULATED output\n1: lo: 127.0.0.1/8\n2: wlan0: 192.168.0.42/24 (fake)');break;
  case'reboot':if(confirm('Reboot the ANX4 simulation?'))location.reload();break;
  case'exit':c.close();break;
  default:p('anx4: command not found: '+esc(c0))}};
 inp.onkeydown=e=>{if(e.key=='Enter'){const l=inp.value;p(pr()+'\n<span class="pr">└─$</span> '+esc(l));if(l.trim())hist.push(l);hi=hist.length;inp.value='';run(l);prow();inp.focus();b.scrollTop=b.scrollHeight}
  else if(e.key=='ArrowUp'){e.preventDefault();if(hi>0)inp.value=hist[--hi]}else if(e.key=='ArrowDown'){e.preventDefault();inp.value=hi<hist.length-1?hist[++hi]:(hi=hist.length,'')}
  else if(e.key=='Tab'){e.preventDefault();const m=CMDS.filter(x=>x.startsWith(inp.value));if(m.length==1)inp.value=m[0]+' ';else if(m.length>1)p(m.join('  '))}};
 b.onclick=()=>inp.focus();setTimeout(()=>inp.focus(),50)}
/* ---------- files + editor ---------- */
function files(b,c,start){let cwd=start||H,sel=null,gr=false;const wrap=E('div','fm'),sd=E('div','sd'),mn=E('div','mn');wrap.append(sd,mn);b.append(wrap);
 [['Home',''],['Desktop','/Desktop'],['Documents','/Documents'],['Downloads','/Downloads'],['Pictures','/Pictures'],['Music','/Music'],['Videos','/Videos'],['Trash','/Trash']].forEach(([n,p])=>{const x=E('button',0,n);x.onclick=()=>{cwd=H+p;sel=null;draw()};sd.append(x)});
 const inTr=()=>cwd==H+'/Trash';
 function draw(){const n=G(P(cwd,'/'));if(!n||n.t!='d'){cwd=H;return draw()}wrap.classList.toggle('gr',gr);mn.innerHTML='';
  const tl=E('div','tl');const bt=(l,fn)=>{const x=E('button',0,l);x.onclick=fn;tl.append(x)};
  bt('↑',()=>{cwd=U(P('..',cwd))||'/';sel=null;draw()});bt(gr?'List':'Grid',()=>{gr=!gr;draw()});
  if(!inTr()){bt('New folder',()=>{const k=prompt('Folder name');if(k&&!/[\/]/.test(k)){const e=mk(P(k,cwd),d({}));e?notify('Error: '+e):notify('Folder created')}});
   bt('Rename',()=>{if(!sel)return notify('Select an item first');const k=prompt('New name',sel);if(k&&!/\//.test(k)&&!n.c[k]){n.c[k]=n.c[sel];delete n.c[sel];sel=k;sv()}});bt('Delete',()=>{if(sel){trash(P(sel,cwd));sel=null}else notify('Select an item first')})}
  else{bt('Restore',()=>{if(!sel)return notify('Select an item first');const it=n.c[sel],pa=P(it.o||H+'/'+sel,'/'),par=G(pa.slice(0,-1));if(par&&par.t=='d'&&!par.c[pa.at(-1)]){delete n.c[sel];delete it.o;par.c[pa.at(-1)]=it;sv();notify('Restored')}else notify('Cannot restore: original location unavailable')});bt('Empty Trash',()=>{if(confirm('Permanently delete all items in Trash?')){n.c={};sv()}})}
  mn.append(tl);const bc=E('div','m');bc.textContent=cwd+' (virtual files, not on your device)';mn.append(bc);
  const ls=E('div','ls');Object.keys(n.c).sort().forEach(k=>{const it=E('div','it'+(k==sel?' s':''));it.textContent=(n.c[k].t=='d'?'📁 ':'📄 ')+k;it.tabIndex=0;
   it.onclick=()=>{sel=k;draw()};it.ondblclick=()=>{if(n.c[k].t=='d'){cwd=U(P(k,cwd));sel=null;draw()}else if(!inTr())openApp('editor',U(P(k,cwd)))};ls.append(it)});
  if(!Object.keys(n.c).length)ls.innerHTML='<div class="m">Empty folder</div>';mn.append(ls)}
 addEventListener('fs',draw);c.cl.push(()=>removeEventListener('fs',draw));draw()}
function editor(b,c,path){const n=G(P(path,'/'));const ta=E('textarea');ta.style.cssText='width:100%;height:calc(100% - 44px);border-radius:0;border:0;font:13px ui-monospace,monospace';ta.value=n?n.x:'';const bar=E('div','tl');bar.style.padding='6px';const s=E('button',0,'Save');bar.append(s,E('span','m','&nbsp;'+esc(path)+' (virtual)'));
 s.onclick=()=>{const m=G(P(path,'/'));if(m&&m.t=='f'){m.x=ta.value;sv();notify('Saved '+path.split('/').pop())}else notify('File no longer exists')};b.append(bar,ta)}
/* ---------- settings / about / monitor / calc ---------- */
function settings(b,c){const w=E('div','set');const row=(l,i)=>{const e=E('label',0,l);e.append(i);w.append(e);return i};
 w.append(E('h3',0,'Appearance'));const th=E('button',0,S.t=='dark'?'Dark (switch to lighter)':'Lighter (switch to dark)');th.onclick=()=>{S.t=S.t=='dark'?'light':'dark';apply();th.textContent=S.t=='dark'?'Dark (switch to lighter)':'Lighter (switch to dark)';notify('Theme changed')};w.append(th);
 const rm=E('input');rm.type='checkbox';rm.checked=S.rm;rm.onchange=()=>{S.rm=rm.checked;apply()};row('Reduce motion (Display)',rm);
 w.append(E('h3',0,'Accent color'));const h=E('input');h.type='range';h.min=0;h.max=360;h.value=S.h;h.oninput=()=>{S.h=+h.value;apply()};row('Hue',h);const i=E('input');i.type='range';i.min=20;i.max=100;i.value=S.i;i.oninput=()=>{S.i=+i.value;apply()};row('Intensity',i);
 w.append(E('h3',0,'Wallpaper'));const wp=E('div','tl');['Crimson glow','Diagonal','Shadow'].forEach((n,k)=>{const x=E('button',0,n);x.onclick=()=>{S.w=k;apply();notify('Wallpaper: '+n)};wp.append(x)});w.append(wp);
 w.append(E('h3',0,'Sound'));const v=E('input');v.type='range';v.value=S.v;v.oninput=()=>{S.v=+v.value;apply()};row('Volume (setting only, no audio)',v);
 w.append(E('h3',0,'System information'),E('div',0,'OS Name: ANX4 OS<br>Environment: Browser Simulation<br>Kernel: Not available — simulated environment<br>Architecture: Browser-dependent<br>Session: Demo User Session'));
 const r=E('button',0,'Reset demo');r.onclick=resetDemo;w.append(E('h3',0,'Reset'),r);b.append(w)}
function resetDemo(){if(confirm('Reset desktop, files, settings and bookmarks to defaults?')){['anx_fs','anx_s','anx_bm'].forEach(LS.x);location.reload()}}
function about(b){b.append(E('div','pg',logo(110)+'<h2 style="margin:0">ANX4 OS</h2><div>by ANIXE444 · version 0.1 (experimental)</div><p>A Linux-inspired desktop simulated in your browser. Placeholder wolf mark shown until the official logo file is added.</p><p class="m">Experimental software. Browser-based simulation. No real operating system or Linux kernel is installed or run.</p>'))}
function monitor(b,c){const w=E('div','set');b.append(w);const rows=['CPU','Memory','Storage'].map(n=>{const e=E('div',0,n+' <span></span><div class="mt"><i></i></div>');w.append(e);return e});w.append(E('div','m','All figures are simulated, generated randomly.'));const pr=E('div');w.append(pr);
 const tick=()=>{rows.forEach((e,k)=>{const v=k==2?64:Math.round(15+Math.random()*60);e.querySelector('span').textContent=v+'% (simulated)';e.querySelector('i').style.width=v+'%'});pr.innerHTML=['anx4-shell','window-manager','notifyd'].map(n=>`${n} · PID ${1000+n.length*7} · ${(Math.random()*5).toFixed(1)}% CPU (sim)`).join('<br>')};tick();const t=setInterval(tick,1500);c.cl.push(()=>clearInterval(t))}
function calc(b){const dsp=E('input');dsp.style.cssText='width:calc(100% - 20px);margin:10px;font-size:1.4rem;text-align:right';dsp.readOnly=true;const g=E('div','cg');b.append(dsp,g);
 '7 8 9 / 4 5 6 * 1 2 3 - 0 . = +'.split(' ').concat(['C','(',')','⌫']).forEach(k=>{const x=E('button',0,k);x.onclick=()=>{if(k=='C')dsp.value='';else if(k=='⌫')dsp.value=dsp.value.slice(0,-1);else if(k=='='){const s=dsp.value;if(/^[0-9+\-*\/.() ]+$/.test(s)){try{const r=Function('"use strict";return ('+s+')')();dsp.value=Number.isFinite(r)?String(+r.toFixed(10)):'Error'}catch(e){dsp.value='Error'}}}else dsp.value+=k};g.append(x)})}
/* ---------- browser ---------- */
function browser(b,c){let BM=LS.g('anx_bm',[['Debian','https://www.debian.org'],['Arch Wiki','https://wiki.archlinux.org'],['Kernel.org','https://www.kernel.org']]);
 const ENG={DuckDuckGo:'https://duckduckgo.com/?q=',Google:'https://www.google.com/search?q=',Bing:'https://www.bing.com/search?q=',Wikipedia:'https://en.wikipedia.org/w/index.php?search='};
 let st=[{p:'home'}],i=0,eng='DuckDuckGo';const bar=E('div','tl');bar.style.padding='6px';const bn=(l,fn,a)=>{const x=E('button',0,l);x.setAttribute('aria-label',a);x.onclick=fn;bar.append(x);return x};
 bn('←',()=>{if(i>0){i--;show()}},'Back');bn('→',()=>{if(i<st.length-1){i++;show()}},'Forward');bn('⟳',()=>show(),'Reload');bn('⌂',()=>go({p:'home'}),'Home');
 const ad=E('input');ad.style.cssText='flex:1;min-width:120px';ad.placeholder='Search or enter address';ad.setAttribute('aria-label','Address');bar.append(ad);
 const se=E('select');se.setAttribute('aria-label','Search engine');Object.keys(ENG).forEach(k=>se.append(new Option(k)));se.onchange=()=>eng=se.value;bar.append(se);
 const star=bn('★',()=>{const s=st[i];if(s.p=='ext'&&!BM.some(x=>x[1]==s.u)){BM.push([s.u.replace(/^https?:\/\//,''),s.u]);LS.s('anx_bm',BM);notify('Bookmark added')}else notify('Open a site page to bookmark it')},'Bookmark');
 const ld=E('div','bar');ld.style.cssText='width:100%;margin:0;visibility:hidden';ld.innerHTML='<i></i>';const pg=E('div','pg');b.append(bar,ld,pg);
 const go=s=>{st=st.slice(0,i+1);st.push(s);i++;show()};
 const newTab=u=>{const a=document.createElement('a');a.href=u;a.target='_blank';a.rel='noopener noreferrer';document.body.append(a);a.click();a.remove()};
 function show(){const s=st[i];ld.style.visibility='visible';ld.firstChild.style.animation='none';void ld.offsetWidth;ld.firstChild.style.animation='';setTimeout(()=>ld.style.visibility='hidden',1200);
  ad.value=s.p=='ext'?s.u:s.p=='res'?s.q:'';pg.innerHTML='';
  if(s.p=='home'){pg.innerHTML=logo(70)+'<h2 style="margin:0">ANX4 Browser</h2>';const q=E('input');q.placeholder='Search the web';q.style.width='min(420px,90%)';q.onkeydown=e=>{if(e.key=='Enter')nav(q.value)};pg.append(q,E('div','m','Bookmarks'));const bl=E('div','tl');BM.forEach(([n,u])=>{const x=E('button',0,esc(n));x.onclick=()=>go({p:'ext',u});bl.append(x)});pg.append(bl)}
  else if(s.p=='res'){pg.innerHTML=`<h3>Search: ${esc(s.q)}</h3><p>Results are provided by ${eng}. For security reasons this page cannot fetch or embed search results, and no API key is configured, so no results are listed here.</p>`;const x=E('button','pri','Open results in New Tab');x.onclick=()=>newTab(ENG[eng]+encodeURIComponent(s.q));pg.append(x)}
  else if(s.p=='ext'){pg.innerHTML=`<h3>${esc(s.u)}</h3><p>Many sites block embedding, so this page opens outside ANX4.</p>`;const x=E('button','pri','Open in New Tab');x.onclick=()=>newTab(s.u);pg.append(x)}
  else pg.innerHTML=`<h3>Cannot open page</h3><p>${esc(s.m)}</p>`}
 function nav(v){v=v.trim();if(!v)return;if(/^(javascript|data|file):/i.test(v))return go({p:'err',m:'This address type is blocked.'});
  if(/^https?:\/\/\S+$/i.test(v))go({p:'ext',u:v});else if(/^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(v))go({p:'ext',u:'https://'+v});else go({p:'res',q:v})}
 ad.onkeydown=e=>{if(e.key=='Enter')nav(ad.value)};show()}
const APPS={terminal:['Terminal','>_',term],browser:['Web Browser','🌐',browser],files:['File Manager','📁',files],settings:['Settings','⚙',settings],monitor:['System Monitor','📊',monitor],about:['About ANX4','ℹ',about],calc:['Calculator','🧮',calc],editor:['Text Editor','📝',editor]};
/* ---------- shell: intro, login, desktop ---------- */
const show=id=>['#intro','#login','#ov','#desk'].forEach(s=>$(s).classList.toggle('hide',s!=id));
$('#lg').innerHTML=logo(120);$('#av').innerHTML=logo(60);$('#wolf').innerHTML=logo(Math.min(440,innerWidth*.8),'#fff');$('#sb').innerHTML=logo(22);
function clock(){const n=new Date();$('#clk').textContent=n.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});$('#ck').innerHTML=n.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})+'<small>'+n.toLocaleDateString([],{weekday:'long',month:'long',day:'numeric'})+'</small>'}setInterval(clock,10000);clock();
let ti=[];const endIntro=()=>{ti.forEach(clearTimeout);$('#boot').textContent='';$('#tt').classList.add('on');$('#skip').classList.add('hide')};
function intro(){const L=['[ OK ] Initializing ANX4 core (simulated)','[ OK ] Mounting virtual filesystem','[ OK ] Loading desktop services','[ OK ] Session manager ready'];L.forEach((l,k)=>ti.push(setTimeout(()=>{$('#boot').textContent+=l+'\n'},900+k*450)));ti.push(setTimeout(endIntro,3200))}
$('#skip').onclick=endIntro;$('#go').onclick=()=>{LS.s('anx_seen',1);show('#login');$('#un').focus()};
$('#pw').onclick=()=>{show('#intro');$('#tt').classList.add('on')};
$('#lf').onsubmit=e=>{e.preventDefault();user=$('#un').value.trim().slice(0,20)||'user';$('#ps').value='';show('#ov');setTimeout(()=>{show('#desk');notify('Welcome, '+user)},1250)};
function logout(){Object.keys(W).forEach(k=>{W[k].cl.forEach(x=>x());W[k].el.remove();delete W[k]});tb();$('#launch').classList.add('hide');$('#un').value='';show('#login')}
const ICONS=[['terminal','>_','Terminal'],['browser','🌐','Web Browser'],['files','📁','File Manager'],['settings','⚙','Settings'],['monitor','📊','System Monitor'],['about','ℹ','About ANX4'],['trash','🗑','Trash']];
const ev=matchMedia('(pointer:coarse)').matches?'click':'dblclick';
ICONS.forEach(([a,i,n])=>{const x=E('button','di',`<b>${i}</b>${n}`);x.addEventListener(ev,()=>a=='trash'?openApp('files',H+'/Trash'):openApp(a));$('#ic').append(x)});
function launcher(){const q=$('#lq').value.toLowerCase(),g=$('#lg2');g.innerHTML='';Object.keys(APPS).filter(k=>k!='editor'&&APPS[k][0].toLowerCase().includes(q)).forEach(k=>{const x=E('button',0,APPS[k][1]+'<br>'+APPS[k][0]);x.style.fontSize='.75rem';x.onclick=()=>openApp(k);g.append(x)})}
$('#sb').onclick=()=>{$('#nl').classList.add('hide');$('#launch').classList.toggle('hide');$('#lq').value='';launcher()};$('#lq').oninput=launcher;$('#lo').onclick=logout;$('#rs').onclick=resetDemo;
$('#bell').onclick=()=>{$('#launch').classList.add('hide');const n=$('#nl');n.classList.toggle('hide');n.innerHTML='<b>Notifications</b><br>'+(NL.length?NL.map(esc).join('<br>'):'<span class="m">No notifications</span>')};
$('#desk').addEventListener('contextmenu',e=>{if(e.target.closest('.win,#tbar'))return;e.preventDefault();const m=$('#cm');m.innerHTML='';[['New folder on Desktop',()=>{const k='Folder'+Date.now()%1000;mk(['home','user','Desktop',k],d({}));notify('Folder created on Desktop')}],['Open Terminal',()=>openApp('terminal')],['Next wallpaper',()=>{S.w=(S.w+1)%3;apply()}],['Reset demo',resetDemo]].forEach(([l,fn])=>{const x=E('button',0,l);x.onclick=()=>{m.classList.add('hide');fn()};m.append(x)});m.style.left=Math.min(e.clientX,innerWidth-180)+'px';m.style.top=Math.min(e.clientY,innerHeight-190)+'px';m.classList.remove('hide')});
addEventListener('click',e=>{if(!e.target.closest('#cm'))$('#cm').classList.add('hide');if(!e.target.closest('#launch,#sb'))$('#launch').classList.add('hide');if(!e.target.closest('#nl,#bell'))$('#nl').classList.add('hide')});
apply();if(LS.g('anx_seen',0)){show('#login');}else intro();
