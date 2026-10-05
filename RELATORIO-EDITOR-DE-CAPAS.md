# Editor de capas integrado ao SINAL/RUÍDO

Adaptado do arquivo fornecido pelo autor: `C:\Users\Alex.kich\Downloads\1 Editor de Capa v2.html`.

Rotas: `/editor-de-capas/` e `/en/cover-editor/`. Acesso pelo rodapé do site, marca com retorno à página inicial e troca de idioma. Cores, tipografia e botões seguem a identidade SINAL/RUÍDO. No celular, Documento, Prévia e Propriedades ocupam painéis alternáveis.

Mantidos: medidas em centímetros, lombada por quantidade de folhas/papel, orelhas, sangria, imagens independentes por área, guias, zoom, textos arrastáveis, edição e exclusão. A capa inicial é um exemplo editável com título e autor.

Imagens e textos ficam no navegador. Bibliotecas de exportação são servidas pelo próprio site e carregadas quando necessário. JPG recebe metadados de 300 DPI; PDF preserva as dimensões físicas calculadas a partir dos pixels a 300 DPI. Guias e seleções são excluídas apenas da exportação, sem alterar a prévia. Ajuste de imagens implementado com fundos CSS compatíveis com a exportação. A espessura do papel continua sendo uma estimativa a confirmar com a gráfica.

Validação local: oito cenários Chrome/Edge, português/inglês, 320/393/1440 px. Edição/exclusão, imagens por área, ajuste, cálculo, encaixe da prévia e ausência de erros de JavaScript. Exportações reais JPG e PDF nas duas línguas: pixels, metadados 300 DPI, cores da imagem, retirada das guias e sangria, dimensões da página PDF e zoom preservado. Auditoria de 141 páginas: nenhum link local quebrado.

Dependências: html2canvas 1.4.1; jsPDF 4.2.1. O arquivo original foi preservado.

Publicado em https://45b7b7ae.sinalruido.pages.dev. Após publicação, editor aprovado nos oito cenários e leitor paginado aprovado nos seis cenários PT/EN.
Exportação de texto editado confirmada no JPG nas duas línguas, além das imagens e medidas.
