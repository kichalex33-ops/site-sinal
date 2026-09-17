// Ponte de OAuth do Instagram para o servico local SINAL-RUIDO-SOCIAL (fora deste repositorio,
// nao publicado). A Meta exige um redirect_uri HTTPS publico; este endpoint so repassa o `code`
// (e demais parametros) para o callback local, sem guardar nem processar nada aqui. O navegador
// que autoriza roda na mesma maquina que o servidor local, entao alcanca localhost normalmente.
export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const target = new URL("http://localhost:8787/oauth/callback");
  target.search = url.search;
  return Response.redirect(target.toString(), 302);
}
