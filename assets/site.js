(()=>{
  const body=document.body;
  const toggle=document.querySelector('.menu-toggle');
  const menu=document.querySelector('.mobile-menu');
  if(toggle&&menu){
    toggle.addEventListener('click',()=>{
      const open=!menu.classList.contains('open');
      menu.classList.toggle('open',open);
      body.classList.toggle('menu-open',open);
      toggle.setAttribute('aria-expanded',String(open));
    });
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      menu.classList.remove('open');body.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false');
    }));
  }
  const moreBtn=document.querySelector('.nav-more>button');
  const moreWrap=document.querySelector('.nav-more');
  if(moreBtn&&moreWrap){
    moreBtn.addEventListener('click',()=>{
      const open=!moreWrap.classList.contains('open');
      moreWrap.classList.toggle('open',open);
      moreBtn.setAttribute('aria-expanded',String(open));
    });
    document.addEventListener('click',e=>{
      if(!moreWrap.contains(e.target)){moreWrap.classList.remove('open');moreBtn.setAttribute('aria-expanded','false')}
    });
  }
  const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}
  }),{threshold:.08}):null;
  document.querySelectorAll('.reveal').forEach(el=>observer?observer.observe(el):el.classList.add('visible'));

  const filterBar=document.querySelector('[data-portfolio-filter]');
  if(filterBar){
    filterBar.addEventListener('click',e=>{
      const button=e.target.closest('button[data-filter]');if(!button)return;
      filterBar.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
      button.classList.add('active');
      const value=button.dataset.filter;
      document.querySelectorAll('[data-project-category]').forEach(card=>{
        const categories=(card.dataset.projectCategory||'').split(' ');
        card.classList.toggle('hidden',value!=='all'&&!categories.includes(value));
      });
    });
  }

  const gallery=document.querySelector('[data-gallery]');
  const lightbox=document.querySelector('.lightbox');
  if(gallery&&lightbox){
    const image=lightbox.querySelector('img');
    const caption=lightbox.querySelector('p');
    const close=()=>{lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');body.style.overflow=''};
    gallery.addEventListener('click',e=>{
      const button=e.target.closest('[data-lightbox]');if(!button)return;
      image.src=button.dataset.lightbox;image.alt=button.dataset.caption||'Prosjektbilde';caption.textContent=button.dataset.caption||'';
      lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');body.style.overflow='hidden';
    });
    lightbox.querySelector('.lightbox-close')?.addEventListener('click',close);
    lightbox.addEventListener('click',e=>{if(e.target===lightbox)close()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  }

  const tabs=document.querySelector('.material-tabs');
  if(tabs){
    tabs.addEventListener('click',e=>{
      const button=e.target.closest('button[data-material-tab]');if(!button)return;
      tabs.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
      button.classList.add('active');
      document.querySelectorAll('[data-material-panel]').forEach(panel=>panel.classList.toggle('active',panel.dataset.materialPanel===button.dataset.materialTab));
    });
    document.querySelectorAll('.sample').forEach(button=>button.addEventListener('click',()=>{
      const panel=button.closest('[data-material-panel]');
      panel?.querySelectorAll('.sample').forEach(b=>b.classList.remove('active'));
      button.classList.add('active');
      const label=panel?.querySelector('[data-material-label]');if(label)label.textContent=button.dataset.label||'';
      const hero=panel?.querySelector('.material-hero img');if(hero&&button.dataset.hero)hero.src=button.dataset.hero;
    }));
  }

  const form=document.getElementById('contactForm');
  if(form){
    const saved=localStorage.getItem('rs1ProjectSummary');
    if(saved){
      try{
        const data=JSON.parse(saved);
        if(form.elements.type&&data.type)form.elements.type.value=data.type;
        if(form.elements.message&&!form.elements.message.value){form.elements.message.value=`Prosjektutkast: ${data.typeLabel||data.type||''}, omtrent ${data.area||''} m². ${data.description||''}`}
      }catch{}
    }
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const data=new FormData(form);
      const subject=encodeURIComponent(`Prosjektforespørsel – ${data.get('type')||'RS1 Bygg'}`);
      const message=encodeURIComponent(`Navn: ${data.get('name')||''}\nTelefon: ${data.get('phone')||''}\nE-post: ${data.get('email')||''}\nProsjektsted: ${data.get('place')||''}\nProsjekttype: ${data.get('type')||''}\n\nBeskrivelse:\n${data.get('message')||''}`);
      window.location.href=`mailto:eirik@rs1bygg.no?subject=${subject}&body=${message}`;
    });
  }

  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
})();
