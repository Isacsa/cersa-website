# Revisão das páginas de produtos

Pré-visualização: http://127.0.0.1:8765/produtos/. Alterações locais; publicação no Netlify pendente da revisão combinada.

## Resultado

- Catálogo organizado por presença profissional, resposta e organização, e relação com os clientes. Google Search Ads tem uma secção própria como fase seguinte.
- Quatro exemplos visuais no catálogo e uma ilustração específica em cada uma das oito páginas de serviço.
- Website ilustrado com fotografia de climatização, serviços claros e pedido de orçamento; exemplo de caixilharias na organização de pedidos e nos anúncios.
- Chamada não atendida, conversa por mensagem, aviso ao dono, avaliações reais e acompanhamento bimestral explicados com texto legível em HTML.
- Resposta inicial aos pedidos do website e acompanhamento depois do serviço apresentados em momentos distintos. Campanhas pontuais separadas do contacto regular.
- Páginas individuais com descrição direta, exemplo visível, três explicações concisas, produtos relacionados e convite para conversar.
- Ilustrações identificadas como exemplos, sem métricas inventadas nem promessas de resultados.

## Design e movimento

Aplicadas a [scroll-craft de Nate Herk](https://github.com/nateherkai/scroll-craft/blob/main/plugins/nateherk-design/skills/scroll-craft/SKILL.md) e a [frontend-design da Anthropic](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md), respeitando o stack estático e a simplicidade pedida.

A estrutura escolhida é um catálogo organizado pelo papel de cada serviço, seguido de páginas com exemplos próprios. O visitante passa da compreensão do sistema à explicação concreta de cada peça. O momento central é a passagem de uma conversa para um pedido organizado que o dono assume.

Paleta e tipografia existentes: azul-marinho `#101D2B`, laranja `#D47C3F`, fundo `#F7F6F3`, texto `#131415`, cinzentos e Archivo. As figuras usam HTML, SVG e fotografias WebP existentes. Sem novas bibliotecas, vídeos ou serviços externos.

`products.css` é carregado apenas pelas nove páginas de produtos. `styles.css` permanece exatamente igual à versão anterior desta melhoria. O novo JavaScript acrescenta 857 bytes, cerca de 174 bytes comprimidos, ao ficheiro partilhado.

IntersectionObserver inicia uma pequena indicação de passagem de informação, com transformações de 250–300 ms. O exemplo está sempre visível. Sem posições sticky adicionais, bloqueio de scroll, conteúdo escondido à espera da animação ou alturas artificiais de apresentação. Com movimento reduzido, sem JavaScript ou sem IntersectionObserver, o conteúdo mantém-se estático e completo.

## Verificação

- 72 verificações finais: nove páginas em 320, 360, 390, 768, 1024, 1440 e 1920 px, e orientação horizontal 844 × 390.
- Sem scroll horizontal, elementos das figuras cortados, imagens em falta ou erros JavaScript.
- Axe WCAG A/AA: zero violações detetadas nos 72 casos finais. Dois problemas iniciais de contraste foram corrigidos; a verificação final substitui esses resultados.
- Inspeção visual de capturas desktop e telemóvel, incluindo catálogo completo e os oito exemplos.
- Todas as nove páginas verificadas sem JavaScript, com movimento reduzido e sem IntersectionObserver.
- Navegação por teclado, ligação para saltar o header, menu, Escape, quatro âncoras do catálogo, adaptação do header às secções escuras, redimensionamento, mudança de preferência de movimento e CTA para o formulário.
- O teste inicial de âncoras foi ajustado para esperar pelo fim do scroll suave; as quatro ligações voltaram a passar com a posição de destino correta.
- Homepage: cenas para a frente e para trás, alterações de tamanho e preferência de movimento, FAQ, menu e CTA continuam funcionais.
- Formulário: envio local intercetado, payload Netlify, erro HTTP, recuperação, prevenção de duplicados e página de obrigado. Os dados de teste não foram enviados para sistemas externos.
- IDs únicos, referências locais válidas, um H1 por página, JSON-LD válido e ItemList com os oito serviços na ordem do catálogo.
- Script externo e identificador original de tracking presentes uma vez em cada página. URLs, navegação, formulário, sitemap e configuração Netlify preservados nesta melhoria.
- `node --check site.js` e `git diff --check` sem erros.

As verificações locais confirmam o comportamento e a preservação das integrações. A receção de uma submissão real na conta Netlify/HighLevel depende da publicação posterior no alojamento existente.

### Lighthouse local para telemóvel

| Indicador | Catálogo anterior | Catálogo final | Website final |
|---|---:|---:|---:|
| Desempenho | 99 | 97 | 98 |
| Acessibilidade | 100 | 100 | 100 |
| Boas práticas | 100 | 100 | 100 |
| SEO técnico | 100 | 100 | 100 |
| LCP | 1,95 s | 2,40 s | 2,25 s |
| CLS | 0 | 0 | 0 |
| TBT | 0 ms | 0 ms | 0 ms |

Medições em laboratório no servidor local, com o mesmo perfil móvel. O catálogo ilustrado acrescenta cerca de 0,45 s ao LCP face à página anterior de texto. São resultados locais, sem dados de utilização real ou garantia de posições no Google. As medições finais usam a folha de estilos exclusiva dos produtos.

## Ficheiros desta melhoria

- `produtos/index.html`
- `produtos/website/index.html`
- `produtos/seo-local/index.html`
- `produtos/recuperacao-de-chamadas/index.html`
- `produtos/caixa-de-entrada/index.html`
- `produtos/acompanhamento-sms/index.html`
- `produtos/reviews-google/index.html`
- `produtos/campanhas/index.html`
- `produtos/google-search-ads/index.html`
- `products.css` — novo, apenas para produtos.
- `site.js` — indicação de movimento nas ilustrações.
- `index.html`, `obrigado.html`, `privacidade.html` — apenas versão de cache dos recursos partilhados nesta melhoria.
- `tools/revisao-produtos.md` — este relatório.

As restantes alterações já presentes no repositório pertencem à revisão anterior da homepage e foram preservadas. As fotografias e fontes existentes foram reutilizadas.

## Evidência local

- `/tmp/cersa-products/qa-full.json` — 72 casos finais.
- `/tmp/cersa-products/behaviour.json` — modos estáticos e navegação.
- `/tmp/cersa-functional-report.json` — homepage, formulário e páginas existentes.
- `/tmp/cersa-products/catalog-full-1440.png` e `catalog-full-390.png` — catálogo completo.
- `/tmp/cersa-products/*-visual-390.png` — exemplos de cada serviço em telemóvel.
- `/tmp/cersa-products/lighthouse-*.html` e respetivos JSON — medições locais antes/depois.
