const todasQuestoes = [
    {
        tipo: 'multipla',
        pergunta: "Qual é o principal objetivo do Banco Central?",
        opcoes: [
            "Controlar a inflação",
            "Emprestar dinheiro",
            "Imprimir notas",
            "Abrir contas correntes"
        ],
        resposta: 0
    },
    {
        tipo: 'completar',
        frase: "A _____ é um aumento generalizado e contínuo dos preços.",
        opcoes: [
            "inflação",
            "deflação",
            "estagnação",
            "recessão"
        ],
        resposta: "inflação"
    },
    {
        tipo: 'siglas',
        pares: [
            {sigla: "PIB", significado: "Produto Interno Bruto"},
            {sigla: "IPCA", significado: "Índice de Preços ao Consumidor Amplo"},
            {sigla: "SELIC", significado: "Sistema Especial de Liquidação e Custódia"}
        ]
    }
];

let questaoAtual = 0;
let respostaSelecionada = null;
let paresCorretos = new Set();
let itemSelecionado = null;
let pontuacao = 0;
let tempoInicio;
let timerInterval;

window.onload = function() {
    iniciarTimer();
    atualizarProgresso();
    mostrarQuestaoAtual();
};

function iniciarTimer() {
    tempoInicio = Date.now();
    timerInterval = setInterval(atualizarTimer, 1000);
}

function atualizarTimer() {
    const tempoDecorrido = Math.floor((Date.now() - tempoInicio) / 1000);
    const minutos = Math.floor(tempoDecorrido / 60);
    const segundos = tempoDecorrido % 60;
    document.getElementById('tempo').textContent = 
        `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}

function atualizarPontuacao(pontos) {
    pontuacao += pontos;
    document.getElementById('pontuacao').textContent = pontuacao;
    document.getElementById('pontuacao').classList.add('animate__animated', 'animate__bounceIn');
    setTimeout(() => {
        document.getElementById('pontuacao').classList.remove('animate__animated', 'animate__bounceIn');
    }, 1000);
}

function atualizarProgresso() {
    const progresso = ((questaoAtual + 1) / todasQuestoes.length) * 100;
    document.getElementById('progresso-atual').style.width = `${progresso}%`;
    document.getElementById('contador-questao').textContent = 
        `Questão ${questaoAtual + 1} de ${todasQuestoes.length}`;
}

function mostrarQuestaoAtual() {
    const container = document.getElementById('quiz-container');
    const questao = todasQuestoes[questaoAtual];
    container.innerHTML = '';
    respostaSelecionada = null;
    paresCorretos.clear();

    switch(questao.tipo) {
        case 'multipla':
            mostrarMultiplaEscolha(questao);
            break;
        case 'completar':
            mostrarCompletarFrase(questao);
            break;
        case 'siglas':
            mostrarLigarSiglas(questao);
            break;
    }
}

function mostrarMultiplaEscolha(questao) {
    const container = document.getElementById('quiz-container');
    container.innerHTML = `
        <div class="questao">
            <h3>${questao.pergunta}</h3>
            ${questao.opcoes.map((opcao, i) => `
                <div class="opcao" onclick="selecionarOpcaoMultipla(${i})">${opcao}</div>
            `).join('')}
            <div class="feedback"></div>
            <button class="btn-verificar" onclick="verificarResposta()">Verificar Resposta</button>
        </div>
    `;
}

function mostrarCompletarFrase(questao) {
    const container = document.getElementById('quiz-container');
    const fraseParts = questao.frase.split('_____');
    
    container.innerHTML = `
        <div class="questao completar-frase">
            <div class="frase-container">
                ${fraseParts[0]}
                <input type="text" readonly>
                ${fraseParts[1]}
            </div>
            <div class="opcoes-completar">
                ${questao.opcoes.map(opcao => `
                    <div class="opcao-completar" onclick="selecionarOpcaoCompletar('${opcao}')">${opcao}</div>
                `).join('')}
            </div>
            <div class="feedback"></div>
            <button class="btn-verificar" onclick="verificarResposta()">Verificar Resposta</button>
        </div>
    `;
}

function mostrarLigarSiglas(questao) {
    const container = document.getElementById('quiz-container');
    container.innerHTML = `
        <div class="questao">
            <h3>Ligue as siglas aos seus significados:</h3>
            <div class="siglas-container">
                <div class="siglas-coluna">
                    ${questao.pares.map((par, index) => `
                        <div class="sigla-item" data-index="${index}">
                            ${par.sigla}
                        </div>
                    `).join('')}
                </div>
                <div class="significados-coluna">
                    ${questao.pares.map((par, index) => `
                        <div class="significado-item" data-index="${index}">
                            ${par.significado}
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="feedback"></div>
            <button class="btn-verificar" onclick="verificarResposta()">Verificar Resposta</button>
        </div>
    `;

    // Adiciona os eventos de clique
    const siglaItems = document.querySelectorAll('.sigla-item, .significado-item');
    siglaItems.forEach(item => {
        item.addEventListener('click', handleSiglaClick);
    });
}

function selecionarOpcaoMultipla(index) {
    respostaSelecionada = index;
    document.querySelectorAll('.opcao').forEach((op, i) => {
        op.classList.toggle('selecionada', i === index);
    });
}

function selecionarOpcaoCompletar(texto) {
    respostaSelecionada = texto;
    document.querySelectorAll('.opcao-completar').forEach(op => {
        op.classList.toggle('selecionada', op.textContent === texto);
    });
    document.querySelector('.completar-frase input').value = texto;
}

function handleSiglaClick(event) {
    const elemento = event.target;
    const isSigla = elemento.classList.contains('sigla-item');
    const index = elemento.getAttribute('data-index');

    // Se o elemento já estiver correto, não fazer nada
    if (elemento.classList.contains('correto')) {
        return;
    }

    // Remover classes de incorreto de tentativas anteriores
    document.querySelectorAll('.incorreto').forEach(el => {
        el.classList.remove('incorreto');
    });

    if (!itemSelecionado) {
        // Primeiro item selecionado
        itemSelecionado = { elemento, isSigla, index };
        elemento.classList.add('selecionado');
    } else {
        // Segundo item selecionado
        if (itemSelecionado.isSigla === isSigla) {
            // Se clicou em dois itens do mesmo tipo, apenas muda a seleção
            itemSelecionado.elemento.classList.remove('selecionado');
            itemSelecionado = { elemento, isSigla, index };
            elemento.classList.add('selecionado');
        } else {
            // Se clicou em tipos diferentes, verifica se o par está correto
            if (itemSelecionado.index === index) {
                // Par correto
                elemento.classList.add('correto');
                itemSelecionado.elemento.classList.add('correto');
                paresCorretos.add(index);
            } else {
                // Par incorreto
                elemento.classList.add('incorreto');
                itemSelecionado.elemento.classList.add('incorreto');
                setTimeout(() => {
                    elemento.classList.remove('incorreto');
                    itemSelecionado.elemento.classList.remove('incorreto');
                }, 1000);
            }
            // Limpa a seleção após verificar o par
            itemSelecionado.elemento.classList.remove('selecionado');
            itemSelecionado = null;
        }
    }

    // Atualiza o feedback visual
    const questao = todasQuestoes[questaoAtual];
    const feedback = document.querySelector('.feedback');
    if (paresCorretos.size === questao.pares.length) {
        feedback.textContent = 'Todos os pares foram conectados corretamente!';
        feedback.className = 'feedback correto';
        feedback.style.display = 'block';
    }
}

function verificarResposta() {
    const questao = todasQuestoes[questaoAtual];
    const feedback = document.querySelector('.feedback');
    feedback.style.display = 'block';

    let respostaCorreta = false;

    switch(questao.tipo) {
        case 'multipla':
            respostaCorreta = respostaSelecionada === questao.resposta;
            break;
        case 'completar':
            respostaCorreta = respostaSelecionada?.toLowerCase() === questao.resposta.toLowerCase();
            break;
        case 'siglas':
            respostaCorreta = paresCorretos.size === questao.pares.length;
            break;
    }

    if (respostaCorreta) {
        feedback.textContent = 'Correto! +10 pontos';
        feedback.className = 'feedback correto animate__animated animate__pulse';
        document.querySelector('.btn-verificar').disabled = true;
        atualizarPontuacao(10);
        
        setTimeout(avancarQuestao, 1500);
    } else {
        feedback.textContent = 'Incorreto! Tente novamente';
        feedback.className = 'feedback incorreto animate__animated animate__shakeX';
    }
}

function avancarQuestao() {
    if (questaoAtual < todasQuestoes.length - 1) {
        questaoAtual++;
        atualizarProgresso();
        mostrarQuestaoAtual();
    } else {
        finalizarQuiz();
    }
}

function finalizarQuiz() {
    clearInterval(timerInterval);
    const container = document.getElementById('quiz-container');
    container.innerHTML = `
        <div class="questao animate__animated animate__fadeIn">
            <h2>Parabéns! Você completou o quiz!</h2>
            <div class="resultado-final">
                <p>Pontuação final: ${pontuacao}</p>
                <p>Tempo total: ${document.getElementById('tempo').textContent}</p>
            </div>
            <button onclick="reiniciarQuiz()" class="btn-verificar">Recomeçar Quiz</button>
        </div>
    `;
}

function reiniciarQuiz() {
    questaoAtual = 0;
    respostaSelecionada = null;
    paresCorretos.clear();
    atualizarProgresso();
    mostrarQuestaoAtual();
} 