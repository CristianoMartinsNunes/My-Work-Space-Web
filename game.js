// Controle da interface do Jogo da Velha
class InterfaceJogo {
    constructor() {
        this.jogo = new JogoDaVelha();
        this.jogadorAtual = 'X'; // Humano sempre começa
        this.jogoAtivo = true;
        this.pontuacao = {
            jogador: 0,
            empates: 0,
            ia: 0
        };
        
        this.inicializar();
        this.carregarPontuacao();
    }

    inicializar() {
        // Elementos do DOM
        this.board = document.getElementById('board');
        this.status = document.getElementById('status');
        this.restartBtn = document.getElementById('restart-btn');
        this.resetScoreBtn = document.getElementById('reset-score-btn');
        this.playerWins = document.getElementById('player-wins');
        this.draws = document.getElementById('draws');
        this.aiWins = document.getElementById('ai-wins');
        this.cells = document.querySelectorAll('.cell');

        // Event listeners
        this.board.addEventListener('click', (e) => this.handleCellClick(e));
        this.restartBtn.addEventListener('click', () => this.reiniciarJogo());
        this.resetScoreBtn.addEventListener('click', () => this.zerarPlacar());

        this.atualizarInterface();
    }

    handleCellClick(e) {
        if (!e.target.classList.contains('cell') || !this.jogoAtivo) {
            return;
        }

        const index = parseInt(e.target.dataset.index);
        
        // Verifica se a célula está vazia e é a vez do jogador
        if (this.jogo.tabuleiro[index] !== ' ' || this.jogadorAtual !== 'X') {
            return;
        }

        // Faz a jogada do humano
        this.fazerJogadaHumano(index);
    }

    fazerJogadaHumano(index) {
        // Faz a jogada
        if (this.jogo.fazerJogada(index, 'X')) {
            this.atualizarInterface();
            
            // Verifica se o jogo terminou
            if (this.jogo.jogoTerminado()) {
                this.finalizarJogo();
                return;
            }

            // Muda para a vez da IA
            this.jogadorAtual = 'O';
            this.atualizarStatus('IA está pensando...');
            this.desabilitarTabuleiro();

            // Faz a jogada da IA após um pequeno delay para simular "pensamento"
            setTimeout(() => {
                this.fazerJogadaIA();
            }, 800);
        }
    }

    fazerJogadaIA() {
        const movimento = this.jogo.jogadaIA();
        
        if (movimento !== null) {
            this.atualizarInterface();
            
            // Verifica se o jogo terminou
            if (this.jogo.jogoTerminado()) {
                this.finalizarJogo();
                return;
            }

            // Volta para a vez do jogador
            this.jogadorAtual = 'X';
            this.habilitarTabuleiro();
            this.atualizarStatus('Sua vez! Clique em uma célula para jogar.');
        }
    }

    atualizarInterface() {
        const tabuleiro = this.jogo.obterTabuleiro();
        
        // Atualiza as células
        this.cells.forEach((cell, index) => {
            const valor = tabuleiro[index];
            cell.textContent = valor === ' ' ? '' : valor;
            
            // Remove classes anteriores
            cell.classList.remove('x', 'o', 'winning');
            
            // Adiciona classe baseada no valor
            if (valor === 'X') {
                cell.classList.add('x');
            } else if (valor === 'O') {
                cell.classList.add('o');
            }
        });

        // Atualiza indicador de jogador ativo
        this.atualizarJogadorAtivo();
    }

    atualizarJogadorAtivo() {
        const humanPlayer = document.querySelector('.player.human');
        const aiPlayer = document.querySelector('.player.ai');
        
        humanPlayer.classList.toggle('active', this.jogadorAtual === 'X');
        aiPlayer.classList.toggle('active', this.jogadorAtual === 'O');
    }

    atualizarStatus(mensagem) {
        this.status.textContent = mensagem;
    }

    desabilitarTabuleiro() {
        this.cells.forEach(cell => {
            cell.classList.add('disabled');
        });
        document.body.classList.add('thinking');
    }

    habilitarTabuleiro() {
        this.cells.forEach(cell => {
            if (cell.textContent === '') {
                cell.classList.remove('disabled');
            }
        });
        document.body.classList.remove('thinking');
    }

    finalizarJogo() {
        this.jogoAtivo = false;
        const resultado = this.jogo.obterResultado();
        
        // Destaca células vencedoras se houver
        this.destacarCelulasVencedoras();
        
        // Atualiza status e pontuação
        if (resultado === 'X') {
            this.atualizarStatus('🎉 Você venceu! Parabéns!');
            this.pontuacao.jogador++;
        } else if (resultado === 'O') {
            this.atualizarStatus('🤖 IA venceu! Tente novamente.');
            this.pontuacao.ia++;
        } else if (resultado === 'Empate') {
            this.atualizarStatus('🤝 Empate! Jogo equilibrado.');
            this.pontuacao.empates++;
        }

        this.atualizarPlacar();
        this.salvarPontuacao();
        // Não desabilita o tabuleiro completamente para permitir o clique no botão "Novo Jogo"
        // this.desabilitarTabuleiro(); 
        document.body.classList.add("game-over");
    }

    destacarCelulasVencedoras() {
        const tabuleiro = this.jogo.obterTabuleiro();
        const combinacoes = [
            [0,1,2], [3,4,5], [6,7,8],  // linhas
            [0,3,6], [1,4,7], [2,5,8],  // colunas
            [0,4,8], [2,4,6]            // diagonais
        ];

        for (let [x, y, z] of combinacoes) {
            if (tabuleiro[x] === tabuleiro[y] && 
                tabuleiro[y] === tabuleiro[z] && 
                tabuleiro[x] !== ' ') {
                
                this.cells[x].classList.add('winning');
                this.cells[y].classList.add('winning');
                this.cells[z].classList.add('winning');
                break;
            }
        }
    }

    reiniciarJogo() {
        this.jogo.reiniciar();
        this.jogadorAtual = 'X';
        this.jogoAtivo = true;
        
        // Limpa classes especiais
        this.cells.forEach(cell => {
            cell.classList.remove('disabled', 'winning', 'x', 'o');
            cell.textContent = '';
        });
        
        document.body.classList.remove('thinking', 'game-over');
        
        this.atualizarInterface();
        this.atualizarStatus('Sua vez! Clique em uma célula para jogar.');
        this.habilitarTabuleiro();
    }

    zerarPlacar() {
        this.pontuacao = {
            jogador: 0,
            empates: 0,
            ia: 0
        };
        this.atualizarPlacar();
        this.salvarPontuacao();
    }

    atualizarPlacar() {
        this.playerWins.textContent = this.pontuacao.jogador;
        this.draws.textContent = this.pontuacao.empates;
        this.aiWins.textContent = this.pontuacao.ia;
    }

    salvarPontuacao() {
        localStorage.setItem('jogoDaVelhaPontuacao', JSON.stringify(this.pontuacao));
    }

    carregarPontuacao() {
        const pontuacaoSalva = localStorage.getItem('jogoDaVelhaPontuacao');
        if (pontuacaoSalva) {
            this.pontuacao = JSON.parse(pontuacaoSalva);
            this.atualizarPlacar();
        }
    }
}

// Inicializa o jogo quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    new InterfaceJogo();
});

