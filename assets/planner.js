(()=>{
  const app=document.querySelector('[data-planner]');if(!app)return;
  const state={step:1,type:'rehabilitering',property:'Enebolig',area:80,level:'Balansert',start:'Innen 3–6 måneder',priorities:new Set(['Planløsning','Materialvalg'])};
  const panes=[...app.querySelectorAll('[data-pane]')];
  const progress=[...app.querySelectorAll('[data-progress]')];
  const go=step=>{
    state.step=step;
    panes.forEach(p=>p.classList.toggle('active',+p.dataset.pane===step));
    progress.forEach(item=>{const n=+item.dataset.progress;item.classList.toggle('active',n===step);item.classList.toggle('done',n<step);const i=item.querySelector('i');if(i)i.textContent=n<step?'✓':n});
    app.scrollIntoView({behavior:'smooth',block:'start'});
  };
  app.querySelectorAll('[data-single]').forEach(group=>group.addEventListener('click',e=>{
    const button=e.target.closest('button[data-value]');if(!button)return;
    group.querySelectorAll('button').forEach(b=>b.classList.remove('selected'));
    button.classList.add('selected');state[group.dataset.single]=button.dataset.value;
  }));
  app.querySelectorAll('[data-priorities] button').forEach(button=>button.addEventListener('click',()=>{
    button.classList.toggle('selected');
    button.classList.contains('selected')?state.priorities.add(button.dataset.value):state.priorities.delete(button.dataset.value);
  }));
  app.querySelectorAll('[data-next]').forEach(button=>button.addEventListener('click',()=>go(+button.dataset.next)));
  app.querySelectorAll('[data-back]').forEach(button=>button.addEventListener('click',()=>go(+button.dataset.back)));
  const area=app.querySelector('#projectArea');
  area?.addEventListener('input',()=>{state.area=+area.value;app.querySelector('#areaOutput').textContent=`${state.area} m²`});
  function sketch(){
    const a=Math.max(10,state.area),ratio=state.type==='Tilbygg'?1.55:1.35;
    const width=Math.round(Math.sqrt(a*ratio)*1000/100)*100;
    const depth=Math.round(a/(width/1000)*1000/100)*100;
    const extra=state.type==='Tilbygg'?'<rect x="330" y="95" width="135" height="145" fill="#f0d9ca" stroke="#b86435" stroke-width="4"/><text x="398" y="172" text-anchor="middle" font-size="13" fill="#8e4828">TILBYGG</text>':state.type==='Bad / våtrom'?'<rect x="322" y="100" width="120" height="115" fill="#dce9ee" stroke="#274f67" stroke-width="4"/><circle cx="382" cy="158" r="23" fill="#fff" stroke="#274f67"/><text x="382" y="236" text-anchor="middle" font-size="11">VÅTROM</text>':'';
    return `<svg viewBox="0 0 540 340" role="img" aria-label="Veiledende konseptskisse"><defs><pattern id="pgrid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#e8e5df" stroke-width="1"/></pattern></defs><rect x="65" y="62" width="370" height="220" fill="url(#pgrid)" stroke="#171815" stroke-width="6"/><line x1="250" y1="62" x2="250" y2="282" stroke="#171815" stroke-width="3"/><line x1="65" y1="175" x2="435" y2="175" stroke="#171815" stroke-width="3"/>${extra}<line x1="65" y1="37" x2="435" y2="37" stroke="#b86435"/><line x1="65" y1="30" x2="65" y2="44" stroke="#b86435"/><line x1="435" y1="30" x2="435" y2="44" stroke="#b86435"/><text x="250" y="25" text-anchor="middle" font-size="12" fill="#8e4828">ca. ${width} mm</text><line x1="465" y1="62" x2="465" y2="282" stroke="#b86435"/><line x1="458" y1="62" x2="472" y2="62" stroke="#b86435"/><line x1="458" y1="282" x2="472" y2="282" stroke="#b86435"/><text x="490" y="172" text-anchor="middle" font-size="12" fill="#8e4828" transform="rotate(90 490 172)">ca. ${depth} mm</text></svg>`;
  }
  const phases={
    'Rehabilitering':['Tilstand og behov','Befaring','Omfang og materialer','Tilbud og plan','Gjennomføring','Kontroll'],
    'Tilbygg':['Behov og areal','Regulering og søknad','Skisse og konstruksjon','Tilbud og fremdrift','Bygging','Overlevering'],
    'Nybygg':['Tomt og behov','Skisse og prosjektering','Søknad','Råbygg','Innvendig arbeid','Overlevering'],
    'Bad / våtrom':['Befaring og teknikk','Plan og produktvalg','Riving','Våtromsoppbygging','Montering','Dokumentasjon'],
    'Fasade / vedlikehold':['Tilstandsvurdering','Prioritering','Materialvalg','Tilbud','Utførelse','Sluttkontroll'],
    'Terrasse / uteområde':['Oppmåling','Fundament og høyder','Materialvalg','Tilbud','Bygging','Ferdigstilling']
  };
  const timing={
    'Rehabilitering':state.area>120?'10–24 uker':'6–16 uker','Tilbygg':'10–24 uker','Nybygg':'8–14 måneder','Bad / våtrom':'4–10 uker','Fasade / vedlikehold':'3–10 uker','Terrasse / uteområde':'2–8 uker'
  };
  app.querySelector('[data-generate]')?.addEventListener('click',()=>{
    state.area=+area.value;
    state.start=app.querySelector('#projectStart').value;
    const description=app.querySelector('#projectDescription').value.trim();
    const title=`Første plan for ${state.type.toLowerCase()}`;
    app.querySelector('#resultTitle').textContent=title;
    app.querySelector('#resultIntro').textContent=`Et ${state.property.toLowerCase()}-prosjekt på omtrent ${state.area} m² med ${state.level.toLowerCase()} nivå. Dette er et tidlig avklaringsgrunnlag – ikke et pristilbud.`;
    const items=[['Prosjekt',state.type],['Omfang',`ca. ${state.area} m²`],['Tidshorisont',timing[state.type]],['Ønsket start',state.start]];
    app.querySelector('#resultStats').innerHTML=items.map(([a,b])=>`<div><small>${a}</small><b>${b}</b></div>`).join('');
    app.querySelector('#resultSketch').innerHTML=sketch();
    app.querySelector('#resultPhases').innerHTML=(phases[state.type]||phases['Rehabilitering']).map((p,i)=>`<div><i>${String(i+1).padStart(2,'0')}</i><span>${p}</span></div>`).join('');
    app.querySelector('#resultFocus').innerHTML=[...state.priorities].map(p=>`<span>${p}</span>`).join('')||'<span>Avklares på befaring</span>';
    let note='RS1 Bygg bør kontrollere konstruksjon, tilkomst, tekniske forhold og eventuelt søknadsbehov før pris og oppstart fastsettes.';
    if(description)note+=` Kundens beskrivelse: «${description.slice(0,190)}${description.length>190?'…':''}»`;
    app.querySelector('#resultNote').textContent=note;
    const score=Math.min(97,80+state.priorities.size*3+(description?6:0));app.querySelector('#resultScore').textContent=`${score}%`;
    localStorage.setItem('rs1ProjectSummary',JSON.stringify({type:state.type,typeLabel:state.type,property:state.property,area:state.area,level:state.level,start:state.start,priorities:[...state.priorities],description}));
    go(4);
  });
  app.querySelector('[data-download]')?.addEventListener('click',()=>{
    const text=`RS1 BYGG – PROSJEKTUTKAST\n\n${app.querySelector('#resultTitle').textContent}\n${app.querySelector('#resultIntro').textContent}\n\n${app.querySelector('#resultNote').textContent}`;
    const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='rs1-prosjektutkast.txt';a.click();URL.revokeObjectURL(url);
  });
  app.querySelector('[data-restart]')?.addEventListener('click',()=>go(1));
})();
