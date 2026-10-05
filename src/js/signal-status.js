export const PUBLIC_SIGNAL_STATUSES = ['confirmed', 'accepted_waiting_photo', 'accepted_waiting_installation', 'in_negotiation'];

export function signalStatus(signal, lang = 'pt') {
  const key = signal.status === 'in_negotiation' ? 'negotiation'
    : signal.status === 'confirmed' && signal.foto ? 'photo' : 'accepted';
  const labels = {
    pt: {photo: '📸 Sinal confirmado', accepted: '📡 Sinal aceito', negotiation: '🟡 Em negociação'},
    en: {photo: '📸 Signal confirmed', accepted: '📡 Signal accepted', negotiation: '🟡 In negotiation'},
  };
  return {key, label: labels[lang][key]};
}
