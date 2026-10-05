export const editorEnglish = {
 'Editor de capas':'Cover editor','Voltar ao site':'Back to the site','CAPA ABERTA · 300 DPI':'FULL COVER · 300 DPI',
 'Exportar JPG':'Export JPG','Exportar PDF':'Export PDF','Documento':'Document','Prévia':'Preview','Propriedades':'Properties',
 'Largura da Página (cm)':'Page width (cm)','Altura da Página (cm)':'Page height (cm)','Sangria (cm)':'Bleed (cm)',
 'Margem extra em cada borda para o corte. Use 0 para não incluir.':'Extra margin on each edge for trimming. Set to 0 for no bleed.',
 'Incluir sangria no arquivo exportado':'Include bleed in the exported file','Número de Páginas':'Page count','Tamanho da Orelha (cm)':'Flap width (cm)',
 'Use 0 para brochura sem orelha.':'Set to 0 for a paperback without flaps.','Tipo de Papel (miolo)':'Interior paper',
 'Cálculo':'Measurements','Espessura / folha':'Thickness / sheet','Largura total':'Total width','Altura total':'Total height','Papel':'Paper','Pixels (300 DPI)':'Pixels (300 DPI)',
 'Imagens de Fundo':'Background images','Área de destino':'Target area','Arquivo (JPG / PNG)':'Image file (JPG / PNG)','Ajuste da área selecionada':'Fit for selected area',
 'Preencher (cover)':'Fill area (crop)','Conter (contain)':'Fit inside area','Esticar':'Stretch','Remover imagem da área':'Remove image from area','Remover todas as imagens':'Remove all images',
 'Aparência':'Appearance','Cor de fundo da capa':'Cover background','Mostrar guias (corte / vinco)':'Show trim and fold guides','Mostrar áreas e rótulos':'Show areas and labels',
 'Elementos':'Elements','Adicionar bloco de texto':'Add text block','Arraste os blocos pela capa.':'Drag text blocks on the cover.',
 'Duplo clique':'Double click','para editar o texto.':'to edit text.','remove o bloco selecionado.':'removes the selected block.',
 'Nenhum elemento selecionado.':'No element selected.','Clique em um bloco de texto na capa.':'Select a text block on the cover.',
 'Conteúdo':'Text','Fonte':'Font','Tamanho (pt)':'Size (pt)','Cor':'Colour','Alinhamento':'Alignment','Estilo':'Style',
 'Esquerda':'Left','Centro':'Centre','Direita':'Right','Justificado':'Justified','Negrito':'Bold','Itálico':'Italic','Larg. (cm)':'Width (cm)','Excluir bloco':'Delete block',
 'Reduzir':'Zoom out','Ampliar':'Zoom in','Ajustar à tela':'Fit to screen','Ajustar':'Fit','Sem elemento selecionado':'No element selected',
 'Capa inteira (base)':'Full cover (base)','Orelha esquerda':'Left flap','Contracapa':'Back cover','Lombada':'Spine','Capa (frente)':'Front cover','Orelha direita':'Right flap',
 'ORELHA':'FLAP','CONTRACAPA':'BACK COVER','LOMBADA':'SPINE','CAPA':'FRONT COVER',
 'Pólen 90g':'Pólen 90 gsm','Pólen 80g':'Pólen 80 gsm','Offset 75g':'Offset 75 gsm','Offset 90g':'Offset 90 gsm',
 'Sulfite 75g':'Bond 75 gsm','Couché Matte 115g':'Matte coated 115 gsm','Reciclato 90g':'Recycled 90 gsm','Pólen 120g':'Pólen 120 gsm',
 '✓ Com imagem: ':'✓ With image: ','Nenhuma imagem carregada ainda.':'No image loaded yet.','Digite aqui':'Type here',
 'Selecione um arquivo de imagem.':'Select an image file.','Imagem aplicada em: ':'Image added to: ',
 'Imagem removida da área selecionada.':'Image removed from selected area.','Todas as imagens foram removidas.':'All images removed.',
 'Falha ao gerar o arquivo. Tente novamente.':'Could not export the file. Please try again.','JPG exportado com sucesso!':'JPG exported successfully!','PDF exportado com sucesso!':'PDF exported successfully!',
 'Gerando arquivo…':'Preparing file…','A capa é muito grande para exportar neste navegador. Reduza as medidas.':'This cover is too large to export in this browser. Reduce its dimensions.',
 'Confirme a espessura do papel e a lombada com a gráfica antes de imprimir.':'Confirm the paper thickness and spine width with your printer before printing.',
 'As imagens e os textos são editados no seu navegador.':'Images and text are edited in your browser.',
 'Não é necessário enviar arquivos para o site.':'You do not need to upload files to the website.',
};
export function translateEditorText(text) {
 if (editorEnglish[text]) return editorEnglish[text];
 for (const prefix of ['✓ Com imagem: ','Imagem aplicada em: ']) if(text.startsWith(prefix)) return editorEnglish[prefix]+text.slice(prefix.length);
 return text;
}
