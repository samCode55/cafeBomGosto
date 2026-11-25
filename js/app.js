// ===== app.js - Cafeteria Bom Gosto =====


// ---------- 1. COOKIES ----------

// Função que mostra o aviso de cookies
function avisoCookies() {
    // Se já existe o cookie "aceitou", a pessoa já respondeu: não mostra nada
    if (document.cookie.includes("aceitou")) {
        return;
    }

    // Cria uma caixa (div) para o aviso
    let aviso = document.createElement("div");
    // Adiciona a classe .caixa-aviso à div
    aviso.classList.add("caixa-aviso");
    // Escreve o texto do aviso
    aviso.textContent = "🍪 Este site usa cookies. ";

    // Cria o botão "Aceitar"
    let botao = document.createElement("button");
    // Escreve o texto do botão
    botao.textContent = "Aceitar";
    // Adiciona a classe .botao-popup ao botão
    botao.classList.add("botao-popup");
    // Coloca o botão dentro do aviso
    aviso.appendChild(botao);
    // Coloca o aviso na página
    document.body.appendChild(aviso);

    // Quando clicar no botão...
    botao.addEventListener("click", function () {
        // ...cria o cookie "aceitou" que dura 30 dias (em segundos)
        document.cookie = "aceitou=sim; max-age=2592000; path=/";
        // ...e tira o aviso da tela
        aviso.remove();
    });
}


// ---------- 2. PÁGINA INICIAL: saudação ----------

// Função que mostra "Bom dia / Boa tarde / Boa noite" com o nome da pessoa
function saudacao() {
    // Procura o título da página inicial
    let titulo = document.querySelector(".titulo");
    // Se não achou, não estamos na página inicial: para aqui
    if (titulo === null) {
        return;
    }

    // Pega a hora de agora (0 a 23)
    let hora = new Date().getHours();
    // Variável que vai guardar a saudação
    let mensagem;

    // Antes do meio-dia é "Bom dia"
    if (hora < 12) {
        mensagem = "Bom dia";
    // Antes das 18h é "Boa tarde"
    } else if (hora < 18) {
        mensagem = "Boa tarde";
    // Depois disso é "Boa noite"
    } else {
        mensagem = "Boa noite";
    }

    // Procura o nome salvo no navegador
    let nome = localStorage.getItem("nome");
    // Se ainda não tem nome salvo...
    if (nome === null) {
        // ...pergunta o nome numa janelinha
        nome = prompt("Bem-vindo(a)! Qual é o seu nome?");
        // ...se a pessoa não digitar nada, chama de "visitante"
        if (nome === null || nome === "") {
            nome = "visitante";
        }
        // ...e salva no navegador para a próxima visita
        localStorage.setItem("nome", nome);
    }

    // Cria um parágrafo
    let texto = document.createElement("p");
    // Escreve a saudação, ex: "Boa noite, Ana! ☕"
    texto.textContent = mensagem + ", " + nome + "! ☕";
    // Coloca o parágrafo dentro do título
    titulo.appendChild(texto);
}

// Número do WhatsApp da cafeteria: 55 (Brasil) + DDD + número, só dígitos
const WHATSAPP = "5519988781221";

// ---------- 3. CARDÁPIO: pedido ----------

// Lista do pedido: pega do navegador (JSON) ou começa vazia
let pedido = JSON.parse(localStorage.getItem("pedido")) || [];

// Função que mostra o pedido e o total na tela
function mostrarPedido() {
    // Procura a caixa do pedido
    let caixa = document.querySelector("#pedido");
    // Começa o total em zero
    let total = 0;
    // Começa o texto da tela com o título
    let html = "<h3>🧾 Seu pedido</h3>";
    // Começa o texto da mensagem que vai pro whatsapp
    let mensagem = "Olá! Gostaria de fazer o pedido:\n\n";

    // Passa por cada item do pedido
    for (let i = 0; i < pedido.length; i++) {
        // Adiciona uma linha na tela
        html = html + "<p>" + pedido[i].nome + " - R$ " + pedido[i].preco.toFixed(2) + "</p>";
        // Adiciona uma linha na mensagem (com vírgula no preço, no padrão brasileiro)
        mensagem = mensagem + "- " + pedido[i].nome + " (R$ " + pedido[i].preco.toFixed(2).replace(".", ",") + ")\n";
        // Soma o preço no total
        total = total + pedido[i].preco;
    }

    // Fecha a mensagem com o total
    mensagem = mensagem + "\nTotal: R$ " + total.toFixed(2).replace(".", ",");

    // Adiciona o total na tela
    html = html + `<p><b>Total: R$${total.toFixed(2)}</b></p>`;

    // Só mostra o botão se tiver pelo menos um item no pedido
    if (pedido.length > 0) {
        // Monta o link do whatsapp com a mensagem já escrita
        let link = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(mensagem);
        // Adiciona o botão que abre o whatsapp numa aba nova
        html = html + `<p><a id="botao-pedir" href="${link}" target="_blank">Finalizar pedido</a></p>`;
    }

    // Coloca tudo dentro da caixa
    caixa.innerHTML = html;
}

// Função que coloca o botão "Adicionar" em cada item do cardápio
function cardapio() {
    // Procura todos os itens do cardápio
    let itens = document.querySelectorAll(".item-cardapio");
    // Se não achou nenhum, não estamos no cardápio: para aqui
    if (itens.length === 0) {
        return;
    }

    // Cria a caixa onde o pedido vai aparecer
    let caixa = document.createElement("div");
    // Dá um id para a caixa
    caixa.id = "pedido";
    // Coloca a caixa no final da grade do cardápio
    document.querySelector(".grade-cardapio").after(caixa);

    // Passa por cada item do cardápio
    for (let i = 0; i < itens.length; i++) {
        // Pega o nome do item
        let nome = itens[i].querySelector("h3").textContent;
        // Pega o preço ("R$ 6,90"), tira o "R$", troca a vírgula por ponto e vira número
        let preco = parseFloat(itens[i].querySelector(".preco").textContent.replace("R$", "").replace(",", "."));

        // Cria o botão
        let botao = document.createElement("button");
        // Escreve o texto do botão e coloca a classe .adicionar-item
        botao.textContent = "+ Adicionar";
            botao.classList.add("adicionar-item");
        // Coloca o botão dentro do item
        itens[i].appendChild(botao);

        // Quando clicar no botão...
        botao.addEventListener("click", function () {
            // ...coloca o item (objeto com nome e preço) na lista
            pedido.push({ nome: nome, preco: preco });
            // ...salva a lista no navegador, convertida em texto JSON
            localStorage.setItem("pedido", JSON.stringify(pedido));
            // ...e atualiza o pedido na tela
            mostrarPedido();
        });
    }

    // Mostra o pedido assim que a página abre
    mostrarPedido();
}


// ---------- INÍCIO ----------

// Espera a página carregar e então roda as funções
document.addEventListener("DOMContentLoaded", function () {
    // Mostra o aviso de cookies
    avisoCookies();
    // Mostra a saudação (só na página inicial)
    saudacao();
    // Prepara o pedido (só no cardápio)
    cardapio();
});