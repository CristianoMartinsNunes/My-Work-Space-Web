// Implementação do algoritmo MiniMax para Jogo da Velha em JavaScript

class JogoDaVelha {
    constructor() {
        // Representação inicial do tabuleiro
        // Índices: 0 1 2
        //          3 4 5
        //          6 7 8
        this.tabuleiro = Array(9).fill(" ");
        this.jogadorHumano = "X";
        this.jogadorIA = "O";
    }

    // Retorna as posições livres no tabuleiro
    movimentosValidos(tab) {
        return tab.map((valor, indice) => valor === " " ? indice : null)
                  .filter(valor => valor !== null);
    }

    // Verifica se há um vencedor ou empate
    verificarVencedor(tab) {
        const combinacoes = [
            [0,1,2], [3,4,5], [6,7,8],  // linhas
            [0,3,6], [1,4,7], [2,5,8],  // colunas
            [0,4,8], [2,4,6]            // diagonais
        ];

        for (let [x, y, z] of combinacoes) {
            if (tab[x] === tab[y] && tab[y] === tab[z] && tab[x] !== " ") {
                return tab[x];  // retorna 'X' ou 'O'
            }
        }

        if (!tab.includes(" ")) {
            return "Empate";
        }

        return null;  // jogo ainda em andamento
    }

    // Implementação do algoritmo Minimax
    // maximizando = true -> turno da IA (O)
    // maximizando = false -> turno do jogador humano (X)
    minimax(tab, profundidade, maximizando) {
        const vencedor = this.verificarVencedor(tab);

        // Valores de utilidade (heurística simples)
        if (vencedor === this.jogadorIA) {  // IA vence
            return 1;
        } else if (vencedor === this.jogadorHumano) {  // Humano vence
            return -1;
        } else if (vencedor === "Empate") {
            return 0;
        }

        if (maximizando) {
            let melhorValor = -Infinity;
            for (let movimento of this.movimentosValidos(tab)) {
                tab[movimento] = this.jogadorIA;
                const valor = this.minimax(tab, profundidade + 1, false);
                tab[movimento] = " ";
                melhorValor = Math.max(melhorValor, valor);
            }
            return melhorValor;
        } else {
            let melhorValor = Infinity;
            for (let movimento of this.movimentosValidos(tab)) {
                tab[movimento] = this.jogadorHumano;
                const valor = this.minimax(tab, profundidade + 1, true);
                tab[movimento] = " ";
                melhorValor = Math.min(melhorValor, valor);
            }
            return melhorValor;
        }
    }

    // Escolhe a melhor jogada para a IA (O) usando Minimax
    melhorJogada(tab) {
        let melhorValor = -Infinity;
        let movimentoEscolhido = null;

        for (let movimento of this.movimentosValidos(tab)) {
            tab[movimento] = this.jogadorIA;
            const valor = this.minimax(tab, 0, false);
            tab[movimento] = " ";

            if (valor > melhorValor) {
                melhorValor = valor;
                movimentoEscolhido = movimento;
            }
        }

        return movimentoEscolhido;
    }

    // Faz uma jogada no tabuleiro
    fazerJogada(posicao, jogador) {
        if (this.tabuleiro[posicao] === " ") {
            this.tabuleiro[posicao] = jogador;
            return true;
        }
        return false;
    }

    // Jogada da IA
    jogadaIA() {
        const movimento = this.melhorJogada(this.tabuleiro);
        if (movimento !== null) {
            this.fazerJogada(movimento, this.jogadorIA);
        }
        return movimento;
    }

    // Reinicia o jogo
    reiniciar() {
        this.tabuleiro = Array(9).fill(" ");
    }

    // Verifica se o jogo terminou
    jogoTerminado() {
        return this.verificarVencedor(this.tabuleiro) !== null;
    }

    // Obtém o estado atual do tabuleiro
    obterTabuleiro() {
        return [...this.tabuleiro];
    }

    // Obtém o resultado do jogo
    obterResultado() {
        return this.verificarVencedor(this.tabuleiro);
    }
}

// Exportar a classe para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JogoDaVelha;
}

