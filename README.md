# Decargo Express — site institucional

Reconstrução completa do site da Decargo Express como projeto estático, sem dependências externas, CMS ou build. Basta abrir `index.html` no navegador.

Publicado no GitHub Pages: https://idalinosou.github.io/decargo.express/

## Como visualizar

- Dê duplo clique em `abrir-site.bat` (Windows), ou
- Abra `index.html` diretamente no navegador, ou
- Rode um servidor local na pasta:

```bash
npx serve .
```

## Páginas

| Arquivo | Conteúdo |
| --- | --- |
| `index.html` | Home: proposta, soluções, diferenciais, cobertura, FAQ e CTA |
| `sobre.html` | História, números da operação, valores e canal de ética |
| `parcerias.html` | Soluções para e-commerce, Mercado Livre, carga seca e porta a porta |
| `agregado.html` | Cadastro de motoristas agregados (envia pelo WhatsApp) |
| `faq.html` | Perguntas frequentes com dados estruturados `FAQPage` |
| `contato.html` | Formulário de cotação (envia pelo WhatsApp) |
| `privacidade.html` | Política de privacidade, cookies e direitos LGPD |
| `404.html` | Página de erro |
| `sitemap.xml` | Mapa do site para mecanismos de busca |
| `robots.txt` | Diretrizes de indexação |

## Estrutura

```
decargo-express/
├── index.html
├── sobre.html
├── parcerias.html
├── agregado.html
├── faq.html
├── contato.html
├── privacidade.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── abrir-site.bat
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/
        ├── favicon.svg
        ├── logo-light.png
        ├── logo.webp
        ├── og-decargo.png
        ├── trafego-loop.mp4
        ├── trafego.mp4
        └── trafego-poster.jpg
```

## O que foi resolvido em relação ao site anterior

- **Um único WhatsApp:** `(21) 99687-6862`, usado em todos os CTAs, no rodapé e no botão flutuante.
- **Formulários que capturam:** cotação e cadastro de agregados montam a mensagem no navegador e abrem o WhatsApp preenchido, sem backend.
- **SEO:** `title` e `description` únicos, um `H1` por página, Open Graph, Twitter Card, canonical e dados estruturados (`MovingCompany` e `FAQPage`).
- **Mobile:** layout testado a partir de 320 px, sem conteúdo cortado; menu acessível com `aria-expanded`, fechamento por `Esc` e clique fora.
- **Cookies:** banner não sobrepõe conteúdo, com opções Aceitar e Recusar, escolha salva em `localStorage`.
- **Marca oficial:** logo fornecida pela empresa no cabeçalho e no rodapé de todas as páginas, com fundo transparente e versão clara para contraste no fundo escuro.
- **Fundo em movimento:** vídeo de rodovia com carretas no herói da home e na faixa de chamada final, com sobreposição escura para manter a leitura. Em `prefers-reduced-motion` ou economia de dados, exibe apenas o pôster.
- **Desempenho:** zero fontes, imagens ou scripts de terceiros; CSS e JS próprios; SVG inline; vídeo pausado fora da tela e com a aba oculta.
- **Acessibilidade:** link de pular navegação, foco visível, rótulos nos campos, mensagens de erro com `aria-live`, `prefers-reduced-motion`.

## Onde editar

- **Cores e tipografia:** variáveis no topo de `assets/css/style.css`.
- **Telefone e WhatsApp:** busca por `5521996876862` em todos os arquivos e no `assets/js/main.js`.
- **Textos:** diretamente em cada página.
- **Logo:** `assets/img/logo-light.png` é a versão transparente usada no cabeçalho e no rodapé de todas as páginas. Mantenha a proporção 2:1. O original `logo.webp` (transparente, com o texto em cinza) fica para fundos claros.
- **Imagem de compartilhamento:** substitua `assets/img/og-decargo.png` mantendo 1200 × 630 px.
- **Vídeo de fundo:** `assets/img/trafego-loop.mp4` é o recorte usado no site; `trafego.mp4` é o arquivo original. Se trocar o vídeo, atualize `data-src` no `index.html` e gere um novo pôster em `assets/img/trafego-poster.jpg`.

## Vídeo de fundo

- `trafego-loop.mp4`: 22 s, 1280 × 720, 1,8 MB, sem som — recorte de 32 s a 54 s do arquivo original.
- `trafego.mp4`: original com 59 s e 12,7 MB, mantido como fonte; não é carregado pelo site.
- Roda em loop, mudo, em qualquer largura de tela, sem `prefers-reduced-motion` e sem economia de dados.
- Com `prefers-reduced-motion` ou economia de dados, o visitante vê o pôster (`trafego-poster.jpg`, 128 KB).
- O vídeo pausa quando sai da tela ou quando a aba fica em segundo plano.

## Publicação

O site é estático: envie todo o conteúdo da pasta para a raiz do domínio (ou para uma subpasta). Netlify e Vercel reconhecem `404.html` automaticamente; no Apache, adicione `ErrorDocument 404 /404.html` na configuração do servidor.

Depois de publicar, atualize as URLs canônicas e de Open Graph se o domínio ou os caminhos forem diferentes de `https://decargoexpress.com.br/`.
