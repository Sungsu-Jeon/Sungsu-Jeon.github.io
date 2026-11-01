/* Shared navigation, publication filters, and replaceable file links. */
document.documentElement.classList.add('js');
const menuButton=document.querySelector('.nav-toggle');
const navigation=document.querySelector('.site-nav');
menuButton?.addEventListener('click',()=>{
  const opened=menuButton.getAttribute('aria-expanded')!=='true';
  menuButton.setAttribute('aria-expanded',String(opened));
  navigation.classList.toggle('is-open',opened);
  menuButton.textContent=opened?'Close menu':'Menu';
});
document.addEventListener('keydown',event=>{
  if(event.key!=='Escape') return;
  const activeDropdown=document.activeElement?.closest('.nav-list details');
  document.querySelectorAll('.nav-list details[open]').forEach(item=>item.open=false);
  if(activeDropdown) activeDropdown.querySelector('summary').focus();
  else if(navigation?.classList.contains('is-open')) { menuButton.click(); menuButton.focus(); }
});
document.addEventListener('click',event=>{
  document.querySelectorAll('.nav-list details[open]').forEach(item=>{if(!item.contains(event.target)) item.open=false;});
});
const filters=document.querySelector('[data-filters]');
if(filters){
  filters.hidden=false;
  const entries=[...document.querySelectorAll('[data-paper]')];
  filters.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{
    const selection=button.dataset.filter;
    filters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    entries.forEach(entry=>entry.hidden=selection!=='all'&&entry.dataset.paper!==selection);
    document.querySelector('[data-filter-count]').textContent=entries.filter(entry=>!entry.hidden).length+' journal entries';
  }));
}
/* Empty optional links stay hidden. No placeholder URL is exposed to visitors. */
const configuredLinks=window.SITE_LINKS||{};
document.querySelectorAll('[data-link]').forEach(anchor=>{
  const key=anchor.dataset.link;
  if(!Object.prototype.hasOwnProperty.call(configuredLinks,key)) return;
  const href=configuredLinks[key].trim();
  if(!href){anchor.hidden=true;anchor.removeAttribute('href');return;}
  if(!/^(https?:\/\/|mailto:|(?:\.\/)?files\/)/i.test(href)) return;
  anchor.href=href;anchor.hidden=false;
  if(key==='email'){
    const label=anchor.querySelector('[data-email-label]');
    if(label) label.textContent=href.replace(/^mailto:/i,'').split('?')[0];
  }
});
