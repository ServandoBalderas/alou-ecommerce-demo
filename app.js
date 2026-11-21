'use strict';

/** ALOU GOODS — catálogo ficticio. No se realizan transacciones reales. */
const products = Object.freeze([
  { id:'lamp', name:'Lámpara Aura', category:'workspace', categoryName:'Escritorio', price:890, tone:'sage', tag:'Favorito', image:'assets/lamp.svg', description:'Una lámpara conceptual de líneas suaves y luz de ambiente. Ilustración y precio de demostración.' },
  { id:'mug', name:'Taza Línea', category:'lifestyle', categoryName:'Lifestyle', price:290, tone:'cream', tag:'Nuevo', image:'assets/mug.svg', description:'Taza de cerámica ilustrada en tonos cálidos. Para pausas con estilo; producto ficticio.' },
  { id:'keyboard', name:'Teclado Forma', category:'workspace', categoryName:'Escritorio', price:1190, tone:'lilac', tag:'Edición demo', image:'assets/keyboard.svg', description:'Teclado minimalista imaginario para escritorio, con detalles suaves y formato compacto.' },
  { id:'notebook', name:'Libreta Nido', category:'accessories', categoryName:'Accesorios', price:249, tone:'sand', tag:'', image:'assets/notebook.svg', description:'Una libreta de ejemplo para tomar notas, dibujar ideas y mantener todo a mano.' },
  { id:'tote', name:'Bolsa Nómada', category:'lifestyle', categoryName:'Lifestyle', price:420, tone:'cream', tag:'Favorito', image:'assets/tote.svg', description:'Tote bag ficticia de estilo sobrio, creada para mostrar variantes de productos cotidianos.' },
  { id:'bottle', name:'Botella Onda', category:'lifestyle', categoryName:'Lifestyle', price:370, tone:'blue', tag:'', image:'assets/bottle.svg', description:'Botella de muestra con silueta estilizada. No representa un producto a la venta.' },
  { id:'mousepad', name:'Tapete Pixel', category:'workspace', categoryName:'Escritorio', price:340, tone:'stone', tag:'Nuevo', image:'assets/mousepad.svg', description:'Base amplia de escritorio con textura ilustrada. Una pieza conceptual para el catálogo.' },
  { id:'tray', name:'Bandeja Arco', category:'accessories', categoryName:'Accesorios', price:310, tone:'sage', tag:'', image:'assets/tray.svg', description:'Bandeja organizadora ficticia para ordenar pequeños objetos de cada día.' },
  { id:'headphones', name:'Auriculares Eco', category:'workspace', categoryName:'Escritorio', price:990, tone:'lilac', tag:'Popular', image:'assets/headphones.svg', description:'Auriculares conceptuales de diseño sencillo, sin especificaciones comerciales reales.' },
  { id:'pen', name:'Bolígrafos Trazo', category:'accessories', categoryName:'Accesorios', price:180, tone:'sand', tag:'', image:'assets/pen.svg', description:'Set imaginario de bolígrafos para destacar cómo mostrar artículos de menor precio.' }
]);

const byId = id => document.getElementById(id);
const money = value => new Intl.NumberFormat('es-MX', {style:'currency', currency:'MXN', maximumFractionDigits:0}).format(value);
const state = { category:'all', search:'', sort:'featured', cart:readCart() };
let lastFocusedElement = null;
let toastTimer;
let selectedProductId = null;

function readCart(){
  try {
    const value=JSON.parse(localStorage.getItem('alou-goods-cart-v1')||'{}');
    if(!value || typeof value!=='object' || Array.isArray(value))return {};
    return Object.fromEntries(Object.entries(value).filter(([id,qty])=>products.some(p=>p.id===id)&&Number.isInteger(qty)&&qty>0&&qty<=99));
  } catch { return {}; }
}
function saveCart(){ try { localStorage.setItem('alou-goods-cart-v1',JSON.stringify(state.cart)); }catch{} }
function currentProduct(id){return products.find(p=>p.id===id)}
function cartEntries(){return Object.entries(state.cart).map(([id,quantity])=>({product:currentProduct(id),quantity})).filter(item=>item.product)}
function cartCount(){return cartEntries().reduce((total,item)=>total+item.quantity,0)}
function subtotal(){return cartEntries().reduce((total,item)=>total+item.product.price*item.quantity,0)}

function renderProducts(){
  let filtered=products.filter(product=>(state.category==='all'||product.category===state.category)&&(`${product.name} ${product.categoryName}`.toLocaleLowerCase('es').includes(state.search)));
  if(state.sort==='price-asc') filtered=filtered.slice().sort((a,b)=>a.price-b.price);
  if(state.sort==='price-desc') filtered=filtered.slice().sort((a,b)=>b.price-a.price);
  if(state.sort==='name') filtered=filtered.slice().sort((a,b)=>a.name.localeCompare(b.name,'es'));
  byId('product-grid').innerHTML=filtered.map(p=>`
    <article class="product">
      <div class="product-visual" data-tone="${p.tone}">
        ${p.tag?`<span class="product-tag">${p.tag}</span>`:''}
        <img src="${p.image}" alt="Ilustración de ${p.name}" loading="lazy" width="300" height="300" />
        <button type="button" class="product-quick" data-view="${p.id}" aria-label="Ver detalles de ${p.name}">↗</button>
      </div>
      <div class="product-details"><span class="product-category">${p.categoryName}</span>
      <h3 class="product-name"><button type="button" class="product-name-button" data-view="${p.id}">${p.name}</button></h3>
      <div class="product-bottom"><span class="product-price">${money(p.price)}</span><button type="button" class="add-button" data-add="${p.id}" aria-label="Agregar ${p.name} al carrito">Agregar +</button></div></div>
    </article>`).join('');
  byId('result-count').textContent=`Mostrando ${filtered.length} ${filtered.length===1?'producto':'productos'}`;
  byId('empty-results').hidden=filtered.length!==0;
  byId('reset-filters').hidden=state.category==='all'&&!state.search;
}
function updateCart(){
  const entries=cartEntries();
  const count=cartCount();
  byId('cart-count').textContent=String(count);
  byId('cart-heading-count').textContent=`(${count})`;
  byId('open-cart').setAttribute('aria-label',`Abrir carrito, ${count} ${count===1?'producto':'productos'}`);
  byId('cart-subtotal').textContent=money(subtotal());
  byId('checkout').disabled=count===0;
  byId('cart-items').innerHTML=count===0?'<div class="cart-empty"><span aria-hidden="true">◌</span><h3>Tu carrito está esperando</h3><p>Agrega algún objeto del catálogo para probar el proceso de compra.</p></div>':entries.map(({product:p,quantity:q})=>`
    <div class="cart-item"><div class="cart-thumb"><img src="${p.image}" alt="" loading="lazy" /></div><div class="cart-item-info"><strong>${p.name}</strong><small>${p.categoryName}</small><div class="cart-qty"><button type="button" data-qty="${p.id}" data-delta="-1" aria-label="Quitar una unidad de ${p.name}">−</button><span>${q}</span><button type="button" data-qty="${p.id}" data-delta="1" aria-label="Añadir una unidad de ${p.name}">+</button></div></div><div class="cart-item-price"><strong>${money(p.price*q)}</strong><button class="remove-button" type="button" data-remove="${p.id}" aria-label="Eliminar ${p.name} del carrito">Eliminar</button></div></div>`).join('');
}
function addToCart(id){
  const product=currentProduct(id);if(!product)return;
  state.cart[id]=Math.min(99,(state.cart[id]||0)+1);saveCart();updateCart();showToast(`${product.name} añadido al carrito`);
}
function alterQuantity(id,delta){const next=(state.cart[id]||0)+delta;if(next<=0)delete state.cart[id];else state.cart[id]=Math.min(99,next);saveCart();updateCart()}
function showToast(message){const toast=byId('toast');toast.textContent=message;toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),2300)}
function lockScroll(){document.body.classList.add('modal-active')}
function unlockScroll(){if(byId('cart-drawer').hidden&&byId('product-modal').hidden)document.body.classList.remove('modal-active')}
function openCart(){closeProduct(false);lastFocusedElement=document.activeElement;byId('cart-drawer').hidden=false;byId('cart-overlay').hidden=false;byId('cart-drawer').setAttribute('aria-hidden','false');lockScroll();byId('close-cart').focus()}
function closeCart(restore=true){if(byId('cart-drawer').hidden)return;byId('cart-drawer').hidden=true;byId('cart-overlay').hidden=true;byId('cart-drawer').setAttribute('aria-hidden','true');unlockScroll();if(restore)lastFocusedElement?.focus()}
function openProduct(id){const product=currentProduct(id);if(!product)return;closeCart(false);selectedProductId=id;lastFocusedElement=document.activeElement;byId('modal-title').textContent=product.name;byId('modal-price').textContent=money(product.price);byId('modal-description').textContent=product.description;byId('modal-image').src=product.image;byId('modal-image').alt=`Ilustración de ${product.name}`;byId('product-modal').hidden=false;byId('modal-backdrop').hidden=false;byId('product-modal').setAttribute('aria-hidden','false');lockScroll();byId('modal-close').focus()}
function closeProduct(restore=true){if(byId('product-modal').hidden)return;byId('product-modal').hidden=true;byId('modal-backdrop').hidden=true;byId('product-modal').setAttribute('aria-hidden','true');unlockScroll();if(restore)lastFocusedElement?.focus();selectedProductId=null}
function resetFilters(){state.category='all';state.search='';state.sort='featured';byId('search').value='';byId('sort').value='featured';document.querySelectorAll('[data-category]').forEach(button=>{const active=button.dataset.category==='all';button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active))});renderProducts()}
function checkout(){const count=cartCount();if(count===0)return;const total=subtotal();byId('order-summary').textContent=`${count} ${count===1?'artículo':'artículos'} · Total ficticio: ${money(total)}`;closeCart(false);state.cart={};saveCart();updateCart();byId('order-dialog').showModal();byId('order-close').focus()}
function trapFocus(event,dialog){if(event.key!=='Tab')return;const focusables=[...dialog.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled])')].filter(el=>el.getClientRects().length);if(!focusables.length)return;const first=focusables[0],last=focusables[focusables.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}

byId('product-grid').addEventListener('click',event=>{const add=event.target.closest('[data-add]');const view=event.target.closest('[data-view]');if(add)addToCart(add.dataset.add);if(view)openProduct(view.dataset.view)});
document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{state.category=button.dataset.category;document.querySelectorAll('[data-category]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});renderProducts()}));
byId('search').addEventListener('input',event=>{state.search=event.target.value.trim().toLocaleLowerCase('es');renderProducts()});
byId('sort').addEventListener('change',event=>{state.sort=event.target.value;renderProducts()});
byId('reset-filters').addEventListener('click',resetFilters);byId('reset-empty').addEventListener('click',resetFilters);
byId('open-cart').addEventListener('click',openCart);byId('close-cart').addEventListener('click',()=>closeCart());byId('cart-overlay').addEventListener('click',()=>closeCart());byId('continue-shopping').addEventListener('click',()=>closeCart());
byId('cart-items').addEventListener('click',event=>{const q=event.target.closest('[data-qty]'),remove=event.target.closest('[data-remove]');if(q)alterQuantity(q.dataset.qty,Number(q.dataset.delta));if(remove){delete state.cart[remove.dataset.remove];saveCart();updateCart()}});
byId('modal-close').addEventListener('click',()=>closeProduct());byId('modal-backdrop').addEventListener('click',()=>closeProduct());byId('modal-add').addEventListener('click',()=>{if(selectedProductId)addToCart(selectedProductId);closeProduct()});
byId('checkout').addEventListener('click',checkout);byId('order-close').addEventListener('click',()=>byId('order-dialog').close());
document.addEventListener('keydown',event=>{if(event.key==='Escape'){if(!byId('product-modal').hidden)closeProduct();else if(!byId('cart-drawer').hidden)closeCart()}if(!byId('product-modal').hidden)trapFocus(event,byId('product-modal'));else if(!byId('cart-drawer').hidden)trapFocus(event,byId('cart-drawer'))});
renderProducts();updateCart();
