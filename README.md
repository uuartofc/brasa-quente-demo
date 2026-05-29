# Brasa Quente

Landing page/catalogo para a lanchonete artesanal Brasa Quente, da J&A Ltda.

## Demo

Este projeto e uma pagina estatica para apresentacao da marca, catalogo inicial e fluxo de carrinho demonstrativo.

Recursos da demo:

- Cardapio separado por Linha Smash, Assinatura, Combos, Porcoes e Bebidas.
- Escolha de ponto da carne nos burgers e combos com carne.
- Fluxo exclusivo para delivery.
- Estimativa de rota e frete a partir da Rua Diamante, Jardim Kennedy II, Pocos de Caldas/MG.
- API local para receber pedidos do site em `POST /api/orders`.
- Desconto automatico de 10% nos pedidos feitos diretamente pelo site.
- Canais externos indicados: iFood e 99Food.

## Dados da empresa

- Nome: Brasa Quente
- Segmento: Hamburgueria Artesanal Delivery
- Cidade: Pocos de Caldas - MG
- Horario: segunda a domingo, 19h as 01h (a confirmar)
- Modelo de atendimento: delivery; retirada no local futuramente
- Socios: 2

## Marca

Missao: oferecer hamburgueres artesanais de qualidade, preparados na hora, com ingredientes selecionados e preco justo.

Visao: ser referencia em hamburguer artesanal delivery em Pocos de Caldas.

Valores: qualidade, honestidade, atendimento rapido, higiene e sabor.

Para abrir localmente:

```bash
npm start
```

Depois acesse `http://localhost:4178`.

## Como abrir

Para testar somente a landing page, abra `index.html` no navegador. Para testar envio de pedidos pela API, rode `npm start`.

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
- Adicionar Pix, cupons e painel administrativo.
- Criar painel de pedidos para visualizar o arquivo `data/orders.json`.
