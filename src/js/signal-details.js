import {escapeHtml} from './render/badges.js';

export function signalPendingNote(signal, lang = 'pt') {
  const en = lang === 'en';
  if (signal.status === 'accepted_waiting_installation') return en ? 'Participation accepted; awaiting installation and a photo of the poster.' : 'Participação aceita; aguardando instalação e foto do cartaz.';
  if (signal.status === 'accepted_waiting_photo') return en ? 'Participation accepted; awaiting a photo of the installed poster.' : 'Participação aceita; aguardando foto do cartaz instalado.';
  return '';
}

export function signalCoordinateNote(signal, lang = 'pt') {
  const en = lang === 'en';
  if (signal.coord_precision === 'area') return en ? 'Approximate city location.' : 'Localização aproximada na cidade.';
  if (signal.coord_precision === 'street') return en ? 'Approximate street location.' : 'Localização aproximada na rua.';
  return '';
}

export function signalDetailsHtml(signal, lang = 'pt', photosFirst = false) {
  const en = lang === 'en';
  const name = en ? signal.nome_en : signal.nome;
  const description = en ? signal.descricao_en : signal.descricao;
  const labels = {website: en ? 'Website' : 'Site', instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube'};
  const pending = signalPendingNote(signal, lang);
  const coordinate = signalCoordinateNote(signal, lang);
  const contacts = (signal.contatos || []).map(contact => {
    const text = `${labels[contact.tipo] || contact.tipo}: ${en && contact.nome_en || contact.nome}`;
    return `<li>${contact.url && /^https:\/\//.test(contact.url) ? `<a href="${escapeHtml(contact.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>` : escapeHtml(text)}</li>`;
  }).join('');
  const figure = (src, caption, proof = false) => `<figure class="signal-photo${proof ? ' signal-photo--proof' : ''}"><a href="${escapeHtml(src)}" target="_blank" rel="noopener" aria-label="${escapeHtml((en ? 'Open photo: ' : 'Abrir foto: ') + caption)}"><img src="${escapeHtml(src)}" alt="${escapeHtml(caption)}" loading="lazy" decoding="async"></a><figcaption>${escapeHtml(caption)}</figcaption></figure>`;
  const venueCaption = en ? signal.foto_local_legenda_en : signal.foto_local_legenda;
  const photos = `${signal.foto_local ? figure(signal.foto_local, venueCaption || `${en ? 'Venue reference image' : 'Imagem de referência do espaço'} — ${name}`) : ''}${signal.foto ? figure(signal.foto, `${en ? 'Installed poster' : 'Cartaz instalado'} — ${name}`, true) : ''}`;
  return `${pending ? `<p class="signal-pending-note">${escapeHtml(pending)}</p>` : ''}
    ${photosFirst ? photos : ''}
    ${description ? `<p class="signal-description">${escapeHtml(description)}</p>` : ''}
    ${signal.endereco ? `<p class="signal-address"><strong>${en ? 'Address' : 'Endereço'}:</strong> ${escapeHtml(signal.endereco)}</p>` : ''}
    ${coordinate ? `<small>${escapeHtml(coordinate)}</small>` : ''}
    ${contacts ? `<ul class="signal-contacts">${contacts}</ul>` : ''}
    ${photosFirst ? '' : photos}`;
}
