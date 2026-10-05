export const PUBLIC_SIGNAL_STATUSES = ['confirmed', 'accepted_waiting_installation', 'in_negotiation'];

export function signalStatus(signal, lang = 'pt') {
  const key = signal.status === 'in_negotiation' ? 'negotiation'
    : signal.status === 'accepted_waiting_installation' ? 'installation'
    : signal.foto ? 'photo' : 'waiting-photo';
  const labels = {
    pt: {photo: 'Confirmado com foto', 'waiting-photo': 'Confirmado, aguardando foto', installation: 'Confirmado, aguardando instalação', negotiation: 'Em negociação'},
    en: {photo: 'Confirmed with photo', 'waiting-photo': 'Confirmed, awaiting photo', installation: 'Confirmed, awaiting installation', negotiation: 'In negotiation'},
  };
  return {key, label: labels[lang][key]};
}
