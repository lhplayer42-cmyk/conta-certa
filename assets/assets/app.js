(function(){
const n=v=>{v=String(v==null?'':v).trim();if(!v)return NaN;if(v.includes(','))v=v.replace(/\./g,'').replace(',','.');return Number(v)};
const num=(x,d=2)=>x.toLocaleString('pt-BR',{maximumFractionDigits:d});
const brl=x=>x.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const plural=(q,s,p)=>q+' '+(q===1?s:p);
const bad='Preencha todos os campos com números válidos.';
const calc={
pct1(f){const x=n(f.x),y=n(f.y);if(isNaN(x)||isNaN(y))return{err:bad};return{main:num(x*y/100,4),sub:`${num(x)}% de ${num(y)} é ${num(x*y/100,4)}.`}},
pct2(f){const x=n(f.x),y=n(f.y);if(isNaN(x)||isNaN(y))return{err:bad};if(y===0)return{err:'O segundo valor não pode ser zero.'};return{main:num(x/y*100,4)+'%',sub:`${num(x)} representa ${num(x/y*100,4)}% de ${num(y)}.`}},
pct3(f){const x=n(f.x),y=n(f.y);if(isNaN(x)||isNaN(y))return{err:bad};if(x===0)return{err:'O valor inicial não pode ser zero.'};const v=(y-x)/Math.abs(x)*100;return{main:(v>0?'+':'')+num(v,4)+'%',sub:`De ${num(x)} para ${num(y)}: ${v>=0?'aumento':'redução'} de ${num(Math.abs(v),4)}%.`}},
juros(f){const C=n(f.c)||0,A=n(f.a)||0,t=n(f.t),p=n(f.p);if(isNaN(t)||isNaN(p)||t<0||p<=0||C<0||A<0)return{err:'Informe taxa e prazo válidos (prazo maior que zero). Valores não podem ser negativos.'};
if(C===0&&A===0)return{err:'Informe um valor inicial ou um aporte mensal.'};
const i=f.tt==='anual'?Math.pow(1+t/100,1/12)-1:t/100,m=Math.round(f.pt==='anos'?p*12:p),g=Math.pow(1+i,m);
const fv=C*g+(i===0?A*m:A*(g-1)/i),inv=C+A*m;
return{main:brl(fv),sub:`Total investido: ${brl(inv)} · Juros ganhos: ${brl(fv-inv)} · Prazo: ${plural(m,'mês','meses')} · Taxa mensal equivalente: ${num(i*100,4)}%.`}},
imc(f){const w=n(f.w),h=n(f.h);if(isNaN(w)||isNaN(h)||w<=0||h<=0)return{err:bad};if(h<50||h>260)return{err:'Informe a altura em centímetros (ex.: 170).'};
const v=w/Math.pow(h/100,2),c=v<18.5?'Abaixo do peso':v<25?'Peso normal':v<30?'Sobrepeso':v<35?'Obesidade grau I':v<40?'Obesidade grau II':'Obesidade grau III';
const lo=18.5*Math.pow(h/100,2),hi=24.9*Math.pow(h/100,2);
return{main:num(v,1)+' · '+c,sub:`Faixa de peso normal para sua altura: ${num(lo,1)} kg a ${num(hi,1)} kg. O IMC é uma referência geral e não substitui avaliação profissional.`}},
datas(f){const p=s=>/^\d{4}-\d{2}-\d{2}$/.test(s||'')?new Date(s+'T00:00:00'):null;let a=p(f.a),b=p(f.b);if(!b){const t=new Date();b=new Date(t.getFullYear(),t.getMonth(),t.getDate())}if(!a)return{err:'Informe a data inicial (ex.: data de nascimento).'};if(a>b){const t=a;a=b;b=t}
let y=b.getFullYear()-a.getFullYear(),m=b.getMonth()-a.getMonth(),d=b.getDate()-a.getDate();if(d<0){m--;d+=new Date(b.getFullYear(),b.getMonth(),0).getDate()}if(m<0){y--;m+=12}
const days=Math.round((b-a)/864e5);
return{main:`${plural(y,'ano','anos')}, ${plural(m,'mês','meses')} e ${plural(d,'dia','dias')}`,sub:`Total: ${num(days,0)} dias (${num(Math.floor(days/7),0)} semanas e ${days%7} dias) · ${num(y*12+m,0)} meses completos.`}},
texto(f){const t=f.t||'',w=(t.match(/\S+/g)||[]).length;return{stats:[['Caracteres',t.length],['Sem espaços',t.replace(/\s/g,'').length],['Palavras',w],['Linhas',t?t.split(/\r\n|\r|\n/).length:0],['Leitura (min)',w?Math.max(1,Math.round(w/200)):0]]}}
};
if(typeof module!=='undefined')module.exports={calc,n};
if(typeof document==='undefined')return;
document.querySelectorAll('form[data-calc]').forEach(form=>{const out=form.querySelector('.out'),k=form.dataset.calc;
const run=e=>{if(e&&e.type==='submit')e.preventDefault();const r=calc[k](Object.fromEntries(new FormData(form)));
out.innerHTML=r.err?`<p class="err">${r.err}</p>`:r.stats?`<div class="stats">${r.stats.map(s=>`<div><b>${num(s[1],0)}</b>${s[0]}</div>`).join('')}</div>`:`<div class="lcd">${r.main}</div><p>${r.sub}</p>`};
form.addEventListener('submit',run);if(k==='texto')form.addEventListener('input',run);if(k==='texto')run();});
const ck=document.getElementById('ck');try{if(ck&&!localStorage.getItem('ck'))ck.style.display='flex'}catch(e){}
const ok=document.getElementById('ckok');if(ok)ok.onclick=()=>{ck.style.display='none';try{localStorage.setItem('ck','1')}catch(e){}};
})();
