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
- Horario: terca a domingo, 19h as 01h
- Modelo de atendimento: delivery; retirada no local futuramente
- Area de atendimento: todo o municipio de Pocos de Caldas
- Zona prioritaria inicial: Jardim Kennedy, Centro, Zona Oeste e bairros proximos
- Ponto operacional: Rua Diamante, Jardim Kennedy II, CEP 37706-528
- Formas de pagamento: Pix, dinheiro, cartao de debito e cartao de credito
- Socios: 2
- Capital inicial disponivel: R$ 3.000

## Marca

Missao: oferecer hamburgueres artesanais de qualidade, preparados na hora, com ingredientes selecionados e preco justo.

Visao: ser referencia em hamburguer artesanal delivery em Pocos de Caldas.

Valores: qualidade, honestidade, atendimento rapido, higiene e sabor.

Descricao oficial para iFood:

Brasa Quente. Hamburgueres artesanais preparados na hora, com ingredientes selecionados, pao macio e carne suculenta. Nosso objetivo e entregar sabor, qualidade e uma experiencia diferenciada em cada pedido. Funcionamos de terca a domingo, das 19h as 01h, atendendo toda Pocos de Caldas.

Bio Instagram:

- Hamburguer Artesanal
- Smash Burgers e Especiais
- Pocos de Caldas - MG
- Delivery de Terca a Domingo
- 19h as 01h
- Faca seu pedido

## Operacao atual

- Equipamentos: adquiridos
- Motoboy: definido
- Bebidas: fornecedor definido
- Paes: negociacao em andamento
- Molhos: desenvolvimento futuro
- Objetivo: operacao enxuta, delivery e crescimento gradual

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
- `script.js`: catalogo, filtros, carrinho, frete e checkout pelo site.
- `assets/hero-artesanal.png`: imagem hero gerada para a primeira dobra.
- `assets/logo-brasa-quente.svg`: logo da marca.
- `assets/menu/`: fotos dos principais itens no estilo artesanal.

## Proximos passos naturais

- Publicar a API em um servidor Node para receber pedidos fora do ambiente local.
- Ajustar endereco, horarios e precos reais.
- Adicionar Pix, cupons e painel administrativo.
- Criar painel de pedidos para visualizar o arquivo `data/orders.json`.
