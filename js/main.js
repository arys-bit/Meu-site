const $=(selector,scope=document)=>scope.querySelector(selector);
const $$=(selector,scope=document)=>[...scope.querySelectorAll(selector)];

const menuToggle=$('.menu-toggle');
const menu=$('#menu');
menuToggle?.addEventListener('click',()=>{
  const open=menu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded',String(open));
});
$$('#menu a').forEach(link=>link.addEventListener('click',()=>{
  menu.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded','false');
}));

const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}
  });
},{threshold:.12});
$$('.reveal').forEach(el=>revealObserver.observe(el));

const sections=$$('main section[id]');
const navLinks=$$('#menu a');
const navObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${entry.target.id}`))}
  });
},{rootMargin:'-30% 0px -60%',threshold:0});
sections.forEach(section=>navObserver.observe(section));

const labData={
  app:{kicker:'EXPERIMENTO 01',title:'FocusFlow',text:'Meu primeiro app completo: foco, hábitos e evolução reunidos em uma experiência leve.',image:'assets/projects/focusflow.png',alt:'Prévia do projeto FocusFlow',tags:['Planejamento','Hábitos','Insights'],theme:'theme-app'},
  landing:{kicker:'EXPERIMENTO 02',title:'Beauty Loja',text:'Uma landing page construída para encantar, apresentar valor e conduzir cada visitante até a ação.',image:'assets/projects/beauty-loja.png',alt:'Prévia da landing page Beauty Loja',tags:['Conversão','Identidade','Mobile'],theme:'theme-landing'},
  interfaces:{kicker:'EXPERIMENTO 03',title:'Alicia Braids',text:'Uma interface que traduz autoestima, técnica e personalidade em uma navegação envolvente.',image:'assets/projects/alicia-braids.png',alt:'Prévia do site Alicia Braids',tags:['Experiência','Animações','Responsivo'],theme:'theme-interfaces'},
  platform:{kicker:'EXPERIMENTO 04',title:'TrançaPro',text:'Uma plataforma completa para organizar clientes, agenda, serviços e decisões do negócio.',image:'assets/projects/trancapro.png',alt:'Prévia do sistema TrançaPro',tags:['Gestão','Automação','Escala'],theme:'theme-platform'},
  next:{kicker:'EXPERIMENTO 05',title:'Nova Check',text:'O próximo capítulo: experiências mais inteligentes, rápidas e preparadas para crescer.',image:'assets/projects/nova-check.png',alt:'Prévia do sistema Nova Check',tags:['Self-checkout','Performance','Futuro'],theme:'theme-next'}
};
const labButtons=$$('.lab-tabs button');
const labVisual=$('.lab-visual');
let labTimer;
function selectLab(button){
  const data=labData[button.dataset.lab];
  if(!data)return;
  labButtons.forEach(b=>b.setAttribute('aria-selected',String(b===button)));
  $('.lab-loader')?.classList.add('show');
  clearTimeout(labTimer);
  labTimer=setTimeout(()=>{
    $('#labKicker').textContent=data.kicker;$('#labTitle').textContent=data.title;$('#labText').textContent=data.text;
    const image=$('#labImage');image.src=data.image;image.alt=data.alt;
    $('#labTags').innerHTML=data.tags.map(tag=>`<span>${tag}</span>`).join('');
    labVisual.className=`lab-visual ${data.theme}`;
    $('.lab-loader')?.classList.remove('show');
  },280);
}
labButtons.forEach((button,index)=>{
  button.addEventListener('click',()=>selectLab(button));
  button.addEventListener('keydown',event=>{
    let next=index;
    if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(index+1)%labButtons.length;
    else if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(index-1+labButtons.length)%labButtons.length;
    else if(event.key==='Enter'||event.key===' '){event.preventDefault();selectLab(button);return}else return;
    event.preventDefault();labButtons[next].focus();selectLab(labButtons[next]);
  });
});

const projects={
  trancapro:{kicker:'SISTEMA DE GESTÃO',title:'TrançaPro',text:'Gestão de clientes, agenda e serviços pensada para a rotina de profissionais de tranças.',image:'assets/projects/trancapro.png',tags:['Dashboard','Clientes','Agenda']},
  aliciabraids:{kicker:'SITE COMERCIAL',title:'Alicia Braids',text:'Um site elegante que valoriza a identidade da profissional, seus serviços e a experiência de cada cliente.',image:'assets/projects/alicia-braids.png',tags:['Site','Responsivo','WhatsApp']},
  beautyloja:{kicker:'LANDING PAGE',title:'Beauty Loja',text:'Uma vitrine digital com hierarquia clara, apresentação envolvente e foco em conversão.',image:'assets/projects/beauty-loja.png',tags:['Landing Page','Design','Conversão']},
  novacheck:{kicker:'SISTEMA SELF-CHECKOUT',title:'Nova Check',text:'Uma experiência de compra direta, intuitiva e desenhada para reduzir atrito no atendimento.',image:'assets/projects/nova-check.png',tags:['Sistema','UX','Performance']}
};
const modal=$('#projectModal');
$$('.project-card button').forEach(button=>button.addEventListener('click',()=>{
  const data=projects[button.closest('.project-card').dataset.project];
  $('#modalImage').src=data.image;$('#modalImage').alt=`Prévia de ${data.title}`;$('#modalKicker').textContent=data.kicker;$('#modalTitle').textContent=data.title;$('#modalText').textContent=data.text;$('#modalTags').innerHTML=data.tags.map(tag=>`<span>${tag}</span>`).join('');modal.showModal();
}));
$('.modal-close')?.addEventListener('click',()=>modal.close());
modal?.addEventListener('click',event=>{if(event.target===modal)modal.close()});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&modal?.open)modal.close()});
