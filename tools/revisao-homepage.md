# Revisão da homepage Cersa

Implementação do plano aprovado. Entrega em pré-visualização local: http://127.0.0.1:8765/. A publicação no Netlify fica para depois da revisão do utilizador.

## Resultado

- Hero claro, com website, atendimento e acompanhamento apresentados como um único sistema.
- Seis etapas do primeiro pedido ao contacto bimestral depois do serviço. Website e chamada são entradas alternativas; os exemplos usam o mesmo pedido de climatização.
- Demonstração sticky apenas em janelas com pelo menos 1024 × 700 px. Texto completo em HTML; o JavaScript desloca apenas as figuras decorativas.
- Telemóvel, reduced motion, JavaScript desativado e ausência de IntersectionObserver mostram todas as etapas no fluxo normal.
- Google Search Ads apresentado como fase posterior, com página própria e ligações no catálogo, menu e sitemap.
- Setores com peso semelhante, incluindo caixilharias, fotografias quadradas WebP e legendas fora das imagens. Os JPEG originais foram preservados.
- Páginas de produtos alinhadas com a oferta; percentagens sem fonte retiradas.
- Menu acionado por clique/toque e teclado, com fecho por Escape ou clique exterior.
- Formulário, IDs de campos, honeypot, consentimento, tracking e página de obrigado preservados.

## Desenho e referências

Aplicadas a [scroll-craft de Nate Herk](https://github.com/nateherkai/scroll-craft/blob/main/plugins/nateherk-design/skills/scroll-craft/SKILL.md) e a [frontend-design da Anthropic](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md). A implementação usa CSS e IntersectionObserver no stack estático existente. As referências e o brief estão em `/tmp/cersa-design-skills` e `/tmp/cersa-scrollcraft`; não são dependências do website.

A experiência escolhida liga um pedido à organização, passagem para o dono, avaliação e acompanhamento. A curva é reconhecimento, compreensão, controlo, preparação e conversa. A assinatura é o percurso visual que se desenvolve dentro da mesma demonstração.

## Verificação

- Chrome em modo headless: 320, 360, 390, 768, 1024, 1440 e 1920 px, e orientação horizontal 844 × 390.
- Scroll para a frente, para trás e por saltos; seis cenas sem conteúdo a ultrapassar a figura; último exemplo completamente visível abaixo do header, incluindo 1024 × 700.
- Mudanças de viewport e de preferência de movimento, fallback sem JavaScript e sem IntersectionObserver.
- Menu por toque, clique e teclado; Escape, foco, ligações, FAQ e CTA de contacto.
- Submissões isoladas: payload URL-encoded, campos Netlify, erro HTTP, recuperação, prevenção de duplicados e redirecionamento para obrigado. Os pedidos de teste foram intercetados localmente.
- Axe WCAG A/AA: homepage, todas as páginas de produtos, privacidade e obrigado. As falhas de contraste encontradas foram corrigidas e as páginas afetadas voltaram a passar.
- Um H1 por página, IDs únicos, JSON-LD válido, sitemap XML válido, referências locais existentes e tracking original presente uma vez por página. FAQ JSON-LD corresponde às perguntas e respostas visíveis.
- `node --check site.js` e `git diff --check` sem erros.

### Lighthouse local para telemóvel

| Indicador | Antes | Depois |
|---|---:|---:|
| Desempenho | 99 | 99 |
| Acessibilidade | 92 | 100 |
| Boas práticas | 100 | 100 |
| SEO técnico | 100 | 100 |
| LCP | 1.95 s | 2.11 s |
| CLS | 0 | 0 |
| TBT | 6.5 ms | 1.5 ms |

Medições em laboratório no servidor local, com a mesma ferramenta e perfil. Não são dados de utilizadores reais nem certificam posições no Google. A regra final de dimensão dos títulos dos produtos foi verificada visualmente e com Axe após esta medição da homepage.

### Netlify e tracking

A configuração desativa Pretty URLs, retira a regra que tentava alterar apenas a barra final e mantém um 301 explícito de `/produtos.html` para `/produtos/`. A página intermédia `produtos.html` foi removida para deixar de sobrepor o catálogo. Foram verificados a configuração e o conteúdo servido localmente.

A confirmação final do routing e de uma submissão real em Netlify/HighLevel exige a publicação posterior no alojamento existente. O script externo e o identificador de tracking foram preservados; os testes não validam a receção de um novo contacto dentro da conta HighLevel. A Área de Cliente permanece inativa.

## Capturas e relatórios

- Desktop: `/tmp/cersa-final-hero-1440.png` e `/tmp/cersa-final-story-*-1440.png`.
- Telemóvel: `/tmp/cersa-final-hero-390.png` e `/tmp/cersa-final-story-*-390.png`.
- Setores, anúncios, processo e contacto: `/tmp/cersa-final-*-390.png` e `/tmp/cersa-final-*-1440.png`.
- Lighthouse: `/tmp/cersa-lighthouse-before.html` e `/tmp/cersa-lighthouse-after.html`, com JSON ao lado.
- Verificação funcional: `/tmp/cersa-functional-report.json`. O contraste de `obrigado.html` foi corrigido depois desse relatório e voltou a passar nas verificações finais.
- Verificação final: `/tmp/cersa-final-qa.json`. As cenas desktop voltaram a passar após o ajuste do último capítulo em `/tmp/cersa-captures.cjs`.
- Fotografias: ver `tools/asset-sources.md`.

## Ficheiros alterados ou acrescentados

- `index.html`
- `netlify.toml`
- `obrigado.html`
- `privacidade.html`
- `produtos.html` (removido)
- `produtos/acompanhamento-sms/index.html`
- `produtos/caixa-de-entrada/index.html`
- `produtos/campanhas/index.html`
- `produtos/index.html`
- `produtos/recuperacao-de-chamadas/index.html`
- `produtos/reviews-google/index.html`
- `produtos/seo-local/index.html`
- `produtos/website/index.html`
- `site.js`
- `sitemap.xml`
- `styles.css`
- `assets/produtos-menu/google-search-ads.svg`
- `assets/setores/avac-400.webp`
- `assets/setores/avac-800.webp`
- `assets/setores/caixilharias-400.webp`
- `assets/setores/caixilharias-800.webp`
- `assets/setores/canalizacao-400.webp`
- `assets/setores/canalizacao-800.webp`
- `assets/setores/eletricidade-400.webp`
- `assets/setores/eletricidade-800.webp`
- `assets/setores/obras-400.webp`
- `assets/setores/obras-800.webp`
- `assets/setores/reparacoes-400.webp`
- `assets/setores/reparacoes-800.webp`
- `produtos/google-search-ads/index.html`
- `tools/asset-sources.md`
- `tools/revisao-homepage.md`
