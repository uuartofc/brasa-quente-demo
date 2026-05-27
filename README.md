# Brasa Quente

Landing page/catalogo para a lanchonete artesanal Brasa Quente, da J&A Ltda.

## Demo

Este projeto e uma pagina estatica para apresentacao da marca, catalogo inicial e fluxo de carrinho demonstrativo.

Para abrir localmente:

```bash
python -m http.server 4178
```

Depois acesse `http://localhost:4178`.

## Como abrir

Abra `index.html` no navegador. O projeto e estatico e nao precisa de servidor para funcionar.

## Estrutura

- `index.html`: conteudo da landing page.
- `styles.css`: identidade visual e responsividade.
- `script.js`: catalogo, filtros, carrinho e checkout simulado por WhatsApp.
- `assets/hero-artesanal.png`: imagem hero gerada para a primeira dobra.
- `assets/logo-brasa-quente.svg`: logo da marca.
- `assets/menu/`: fotos dos principais itens no estilo artesanal.

## Proximos passos naturais

- Trocar telefone placeholder no WhatsApp.
- Ajustar endereco, horarios e precos reais.
- Conectar o carrinho a uma API de pedidos.
- Adicionar Pix, cupons e painel administrativo.
