(()=>{
  const loader=document.getElementById('studioLoader');
  if(!window.THREE){if(loader)loader.innerHTML='<div><b>3D-visningen kunne ikke lastes</b><span>Oppdater siden eller åpne den i Safari/Chrome.</span></div>';return}
  const THREE=window.THREE;
  const canvas=document.getElementById('buildingCanvas');
  const stage=document.querySelector('.studio-stage');
  if(!canvas||!stage)return;
  const scene=new THREE.Scene();scene.background=new THREE.Color(0xc7d6dd);scene.fog=new THREE.Fog(0xc7d6dd,18,42);
  const camera=new THREE.PerspectiveCamera(46,1,.05,100);camera.position.set(11,7.2,12);
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
  const controls=new THREE.OrbitControls(camera,renderer.domElement);controls.target.set(0,1.7,0);controls.enableDamping=true;controls.dampingFactor=.06;controls.minDistance=5;controls.maxDistance=32;controls.maxPolarAngle=Math.PI/2.03;
  scene.add(new THREE.HemisphereLight(0xffffff,0x68715f,1.7));
  const sun=new THREE.DirectionalLight(0xfff5df,3.4);sun.position.set(8,13,7);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-18;sun.shadow.camera.right=18;sun.shadow.camera.top=18;sun.shadow.camera.bottom=-18;scene.add(sun);
  const fill=new THREE.DirectionalLight(0xb9d9ef,1.3);fill.position.set(-8,6,-7);scene.add(fill);
  const groundMat=new THREE.MeshStandardMaterial({color:0x768367,roughness:1});const ground=new THREE.Mesh(new THREE.PlaneGeometry(80,80),groundMat);ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
  const grid=new THREE.GridHelper(40,40,0x697067,0x8d938a);grid.position.y=.015;grid.material.opacity=.22;grid.material.transparent=true;scene.add(grid);
  const house=new THREE.Group();scene.add(house);
  const state={width:8,depth:6,height:3.1,facade:0xdfd8ca,roof:0x262826,trim:0xf7f4ed,terrace:true,extension:false,garage:false,solar:false,view:'orbit'};
  const mats={facade:new THREE.MeshStandardMaterial({color:state.facade,roughness:.82}),roof:new THREE.MeshStandardMaterial({color:state.roof,roughness:.62}),trim:new THREE.MeshStandardMaterial({color:state.trim,roughness:.48}),glass:new THREE.MeshPhysicalMaterial({color:0x7da1b2,roughness:.1,metalness:.1,transparent:true,opacity:.76}),wood:new THREE.MeshStandardMaterial({color:0x8a6342,roughness:.78}),foundation:new THREE.MeshStandardMaterial({color:0x72736d,roughness:.9}),solar:new THREE.MeshStandardMaterial({color:0x152a38,metalness:.45,roughness:.28})};
  let named={};
  const mesh=(geometry,material)=>{const m=new THREE.Mesh(geometry,material);m.castShadow=true;m.receiveShadow=true;return m};
  function clear(){while(house.children.length){const o=house.children.pop();o.traverse?.(n=>{n.geometry?.dispose?.()})}named={}}
  function addBox(name,w,h,d,mat,x,y,z){const m=mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);house.add(m);if(name)named[name]=m;return m}
  function rebuild(){
    clear();const w=state.width,d=state.depth,h=state.height,wall=.14;
    addBox('foundation',w+.3,.35,d+.3,mats.foundation,0,.175,0);
    addBox('floor',w,.18,d,mats.wood,0,.42,0);
    addBox('back',w,h,wall,mats.facade,0,h/2+.45,-d/2);
    addBox('left',wall,h,d,mats.facade,-w/2,h/2+.45,0);
    addBox('right',wall,h,d,mats.facade,w/2,h/2+.45,0);
    const frontLeft=addBox('frontL',w*.29,h,wall,mats.facade,-w*.355,h/2+.45,d/2);
    const frontMid=addBox('frontM',w*.22,h,wall,mats.facade,0,h/2+.45,d/2);
    const frontRight=addBox('frontR',w*.29,h,wall,mats.facade,w*.355,h/2+.45,d/2);
    function windowUnit(x,width,height,y=h*.57+.45){const frame=addBox('',width+.18,height+.18,.13,mats.trim,x,y,d/2+.07);const glass=addBox('',width,height,.08,mats.glass,x,y,d/2+.15);const mull=addBox('',.05,height,.06,mats.trim,x,y,d/2+.21);return {frame,glass,mull}}
    windowUnit(-w*.31,w*.22,h*.48);windowUnit(w*.31,w*.22,h*.48);
    const door=addBox('door',w*.16,h*.72,.13,mats.wood,0,h*.36+.45,d/2+.07);addBox('',w*.025,h*.15,.05,mats.trim,w*.052,h*.37+.45,d/2+.16);
    const angle=Math.atan((w*.22)/(w*.5)),panelW=(w*.5)/Math.cos(angle),roofY=h+.45+w*.11;
    const p1=addBox('roof1',panelW,.14,d+.45,mats.roof,-w*.245,roofY,0);p1.rotation.z=angle;
    const p2=addBox('roof2',panelW,.14,d+.45,mats.roof,w*.245,roofY,0);p2.rotation.z=-angle;
    if(state.terrace){const t=addBox('terrace',w*.65,.16,1.65,mats.wood,w*.08,.55,d/2+1.0);for(let x=-w*.22;x<w*.38;x+=.55)addBox('',.04,.03,1.55,mats.trim,x,.65,d/2+1.0)}
    if(state.extension){const ew=w*.34,ed=d*.55;addBox('extensionBase',ew+.2,.3,ed+.2,mats.foundation,w/2+ew/2-.05,.15,-d*.06);addBox('extension',ew,h*.72,ed,mats.facade,w/2+ew/2-.05,h*.36+.3,-d*.06);const er=addBox('extensionRoof',ew+.35,.13,ed+.35,mats.roof,w/2+ew/2-.05,h*.72+.4,-d*.06);er.rotation.z=-.05;const ex=windowUnit(w/2+ew*.44,ew*.4,h*.28,h*.42+.3);[ex.frame,ex.glass,ex.mull].forEach(o=>{o.position.z=ed/2-d*.06+.12})}
    if(state.garage){const gw=w*.42,gd=d*.72,x=-w/2-gw/2-.25;addBox('garageBase',gw+.25,.3,gd+.2,mats.foundation,x,.15,-.05);addBox('garage',gw,h*.65,gd,mats.facade,x,h*.325+.3,-.05);addBox('garageDoor',gw*.78,h*.48,.12,mats.trim,x,h*.25+.3,gd/2+.03);const gr=addBox('garageRoof',gw+.3,.16,gd+.35,mats.roof,x,h*.65+.35,-.05);gr.rotation.z=.035}
    if(state.solar){for(let z=-d*.25;z<=d*.25;z+=1.15)for(let x=-w*.32;x<=w*.12;x+=1.4){const s=addBox('',1.2,.05,.9,mats.solar,x,roofY+.3,z);s.rotation.z=angle;s.rotation.y=0}}
    updateLabels();
  }
  function updateLabels(){
    document.getElementById('widthBadge').textContent=`${state.width.toFixed(1).replace('.',',')} m`;
    document.getElementById('depthBadge').textContent=`${state.depth.toFixed(1).replace('.',',')} m`;
    document.getElementById('widthValue').textContent=`${state.width.toFixed(1).replace('.',',')} m`;
    document.getElementById('depthValue').textContent=`${state.depth.toFixed(1).replace('.',',')} m`;
    document.getElementById('areaValue').textContent=`${Math.round(state.width*state.depth)} m² grunnflate`;
    document.getElementById('terraceValue').textContent=state.terrace?'Ja':'Nei';document.getElementById('extensionValue').textContent=state.extension?'Ja':'Nei';document.getElementById('garageValue').textContent=state.garage?'Ja':'Nei';document.getElementById('solarValue').textContent=state.solar?'Ja':'Nei';
  }
  rebuild();
  function selectButtons(selector,callback){document.querySelectorAll(selector).forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll(selector).forEach(b=>b.classList.remove('active'));button.classList.add('active');callback(button)}))}
  selectButtons('[data-facade]',b=>{state.facade=parseInt(b.dataset.color,16);mats.facade.color.setHex(state.facade)});
  selectButtons('[data-roof]',b=>{state.roof=parseInt(b.dataset.color,16);mats.roof.color.setHex(state.roof)});
  selectButtons('[data-trim]',b=>{state.trim=parseInt(b.dataset.color,16);mats.trim.color.setHex(state.trim)});
  const widthInput=document.getElementById('buildingWidth'),depthInput=document.getElementById('buildingDepth');
  widthInput.addEventListener('change',()=>{state.width=Math.max(5,Math.min(14,+widthInput.value||8));widthInput.value=state.width;rebuild()});
  depthInput.addEventListener('change',()=>{state.depth=Math.max(4,Math.min(12,+depthInput.value||6));depthInput.value=state.depth;rebuild()});
  [['terraceToggle','terrace'],['extensionToggle','extension'],['garageToggle','garage'],['solarToggle','solar']].forEach(([id,key])=>document.getElementById(id).addEventListener('change',e=>{state[key]=e.target.checked;rebuild()}));
  let walk={enabled:false,yaw:Math.PI,pitch:-.05,drag:false,x:0,y:0};
  const walkPad=document.getElementById('walkPad'),hint=document.getElementById('viewerHint');
  function look(){camera.rotation.order='YXZ';camera.rotation.y=walk.yaw;camera.rotation.x=walk.pitch}
  function step(forward,side){const dir=new THREE.Vector3(Math.sin(walk.yaw),0,-Math.cos(walk.yaw));const right=new THREE.Vector3(Math.cos(walk.yaw),0,Math.sin(walk.yaw));camera.position.addScaledVector(dir,forward);camera.position.addScaledVector(right,side);const xMax=state.width/2-.35,zMax=state.depth/2-.35;camera.position.x=THREE.MathUtils.clamp(camera.position.x,-xMax,xMax);camera.position.z=THREE.MathUtils.clamp(camera.position.z,-zMax,zMax);camera.position.y=1.7}
  function setView(view){
    state.view=view;document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));walk.enabled=view==='walk';walkPad.classList.toggle('show',walk.enabled);
    if(view==='walk'){controls.enabled=false;camera.position.set(0,1.7,state.depth/2-.65);walk.yaw=Math.PI;walk.pitch=0;look();hint.textContent='Dra for å se rundt · bruk pilene eller WASD for å gå'}else{controls.enabled=true;if(view==='front'){camera.position.set(0,4.1,15);controls.target.set(0,2,0)}else if(view==='top'){camera.position.set(.01,20,.01);controls.target.set(0,0,0)}else{camera.position.set(11,7.2,12);controls.target.set(0,1.7,0)}controls.update();hint.textContent='Dra for å rotere · knip eller scroll for å zoome'}
  }
  document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
  canvas.addEventListener('pointerdown',e=>{if(!walk.enabled)return;walk.drag=false;walk.x=e.clientX;walk.y=e.clientY;canvas.setPointerCapture(e.pointerId)});
  canvas.addEventListener('pointermove',e=>{if(!walk.enabled||!canvas.hasPointerCapture(e.pointerId))return;const dx=e.clientX-walk.x,dy=e.clientY-walk.y;if(Math.abs(dx)+Math.abs(dy)>2)walk.drag=true;walk.yaw-=dx*.006;walk.pitch-=dy*.004;walk.pitch=THREE.MathUtils.clamp(walk.pitch,-1.1,1.1);walk.x=e.clientX;walk.y=e.clientY;look()});
  canvas.addEventListener('pointerup',e=>{if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId)});
  window.addEventListener('keydown',e=>{if(!walk.enabled)return;const k=e.key.toLowerCase();if(k==='w'||e.key==='ArrowUp')step(.24,0);if(k==='s'||e.key==='ArrowDown')step(-.24,0);if(k==='a'||e.key==='ArrowLeft')step(0,-.24);if(k==='d'||e.key==='ArrowRight')step(0,.24)});
  walkPad.querySelectorAll('button[data-walk]').forEach(b=>b.addEventListener('click',()=>{const d=b.dataset.walk;if(d==='forward')step(.3,0);if(d==='back')step(-.3,0);if(d==='left')step(0,-.3);if(d==='right')step(0,.3)}));
  document.getElementById('resetView').addEventListener('click',()=>setView('orbit'));
  document.getElementById('fullscreenBtn').addEventListener('click',()=>stage.requestFullscreen?.());
  document.getElementById('shotBtn').addEventListener('click',()=>{renderer.render(scene,camera);const a=document.createElement('a');a.href=renderer.domElement.toDataURL('image/png');a.download='rs1-bygg-konsept.png';a.click()});
  document.getElementById('saveStudio').addEventListener('click',()=>{localStorage.setItem('rs1Studio',JSON.stringify({...state}));const s=document.getElementById('saveStatus');s.textContent='Valgene er lagret på denne enheten.';setTimeout(()=>s.textContent='',2500)});
  document.getElementById('loadStudio').addEventListener('click',()=>{try{const data=JSON.parse(localStorage.getItem('rs1Studio')||'null');if(!data)return;Object.assign(state,data);mats.facade.color.setHex(state.facade);mats.roof.color.setHex(state.roof);mats.trim.color.setHex(state.trim);widthInput.value=state.width;depthInput.value=state.depth;document.getElementById('terraceToggle').checked=state.terrace;document.getElementById('extensionToggle').checked=state.extension;document.getElementById('garageToggle').checked=state.garage;document.getElementById('solarToggle').checked=state.solar;rebuild();setView('orbit')}catch{}});
  function resize(){const w=Math.max(stage.clientWidth,320),h=Math.max(canvas.clientHeight,400);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
  new ResizeObserver(resize).observe(stage);resize();if(loader)loader.style.display='none';
  renderer.setAnimationLoop(()=>{if(!walk.enabled)controls.update();renderer.render(scene,camera)});
})();
