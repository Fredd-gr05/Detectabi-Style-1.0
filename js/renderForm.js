/**
 * Detectabi Style 1.0 – script.js
 * Caminho sugerido: ./js/script.js
 * Corrigido e padronizado em UTF‑8 sem BOM
 */

// === VARIÁVEIS GLOBAIS ===
let sistemasAtivos = [];
let dificuldadesAtivas = [];
let objetivosAtivos = [];
let segmentoAtual = ''; // Para armazenar o segmento selecionado atual

// === DIFICULDADES POR SEGMENTO ===
const dificuldadesPorSegmento = {
    industria: [
        { id: 'dific_ind_visibilidade', label: '👁️ Falta de visibilidade em tempo real da produção.' },
        { id: 'dific_ind_estoque', label: '📦 Dados de estoque e produção desalinhados/inconsistentes.' },
        { id: 'dific_ind_gargalos', label: '🚧 Dificuldade em identificar gargalos e otimizar processos.' },
        { id: 'dific_ind_tempo_relatorios', label: '🕒 Demora na geração de relatórios de OEE, produtividade ou qualidade.' },
        { id: 'dific_ind_integracao', label: '🔗 Desafios na integração de sistemas de chão de fábrica (MES/SCADA) com ERP.' },
        { id: 'dific_ind_custo_perdas', label: '💰 Custo elevado na gestão de perdas e desperdícios.' },
        { id: 'dific_ind_kpis', label: '📊 Dificuldade em definir e monitorar KPIs de produção e qualidade.' },
        { id: 'dific_outros', label: '✍️ Outras dificuldades (especifique abaixo)' }
    ],
    varejo: [
        { id: 'dific_var_vendas', label: '📈 Falta de visibilidade sobre o desempenho de vendas por canal/loja.' },
        { id: 'dific_var_estoque', label: '🧮 Divergência entre estoque físico e sistema (ruptura/excesso).' },
        { id: 'dific_var_demanda', label: '🎯 Dificuldade em prever demanda e otimizar promoções.' },
        { id: 'dific_var_tempo_analise', label: '⌛ Muito tempo gasto na análise de vendas, margem e ticket médio.' },
        { id: 'dific_var_integracao', label: '🔗 Desafios na integração de e-commerce, PDV e CRM.' },
        { id: 'dific_var_custo_estoque', label: '💸 Alto custo com estoque parado ou perdas por validade.' },
        { id: 'dific_var_kpis', label: '📊 Dificuldade em definir e monitorar KPIs de vendas e comportamento do cliente.' },
        { id: 'dific_outros', label: '✍️ Outras dificuldades (especifique abaixo)' }
    ],
    distribuicao: [
        { id: 'dific_dist_visibilidade', label: '🚚ta de visibilidade em tempo real sobre entregas e frota.' },
        { id: 'dific_dist_dados', label: '💾 Dados de pedidos, estoque e faturamento desalinhados.' },
        { id: 'dific_dist_rotas', label: '🗺️ Dificuldade em otimizar rotas e reduzir custos de frete.' },
        { id: 'dific_dist_tempo_relatorios', label: '🕒 Demora na geração de relatórios de performance logística.' },
        { id: 'dific_dist_integracao', label: '🔗 Desafios na integração de TMS com ERP.' },
        { id: 'dific_dist_custo_fretes', label: '💰 Alto custo com fretes, combustível ou manutenção da frota.' },
        { id: 'dific_dist_kpis', label: '📊 Dificuldade em definir e monitorar KPIs de entrega e eficiência logística.' },
        { id: 'dific_outros', label: '✍️ Outras dificuldades (especifique abaixo)' }
    ],
    servicos: [
        { id: 'dific_serv_rentabilidade', label: '💼 Falta de visibilidade sobre a rentabilidade de projetos ou serviços.' },
        { id: 'dific_serv_dados', label: '💾 Dados de horas, faturamento e custos por projeto inconsistentes.' },
        { id: 'dific_serv_equipes', label: '👥 Dificuldade em gerenciar a alocação de equipes e prazos.' },
        { id: 'dific_serv_tempo_relatorios', label: '🕒 Muito tempo gasto na geração de relatórios de performance.' },
        { id: 'dific_serv_integracao', label: '🔗 Desafios na integração de CRM, gestão de projetos e financeiro.' },
        { id: 'dific_serv_custo_ociosidade', label: '💸 Alto custo com ociosidade ou retrabalho.' },
        { id: 'dific_serv_kpis', label: '📊 Dificuldade em definir e monitorar KPIs de satisfação e produtividade.' },
        { id: 'dific_outros', label: '✍️ Outras dificuldades (especifique abaixo)' }
    ],
    default: [
        { id: 'dific_falta_dados', label: '📉 Falta de dados para tomar decisões.' },
        { id: 'dific_dados_inconsistentes', label: '⚠️ Dados inconsistentes ou desatualizados.' },
        { id: 'dific_analise_dificil', label: '🧩 Dificuldade em analisar e interpretar dados.' },
        { id: 'dific_tempo_relatorios', label: '📆 Muito tempo gasto na criação de relatórios.' },
        { id: 'dific_integracao', label: '🔗 Dificuldade em integrar dados de diferentes sistemas.' },
        { id: 'dific_custo_alto', label: '💰 Custo elevado com ferramentas de análise.' },
        { id: 'dific_nao_sei', label: '📊 Não sei quais dados são importantes.' },
        { id: 'dific_outros', label: '✍️ Outras dificuldades (especifique abaixo)' }
    ]
};

// === FUNÇÃO DE PROGRESSO GERAL ===
function atualizarProgresso() {
    const inputs = document.querySelectorAll('input, select, textarea');
    const total = inputs.length;
    const preenchidos = Array.from(inputs).filter(el => {
        if (el.type === 'checkbox' || el.type === 'radio') {
            return el.checked;
        }
        return el.value && el.value.trim() !== '';
    }).length;

    const porcentagem = Math.round((preenchidos / total) * 100) || 0;
    document.getElementById('progressBar').style.width = porcentagem + '%';
    document.getElementById('progressText').textContent = `Progresso: ${porcentagem}% completado`;
}

// === FUNÇÃO: ADAPTA CAMPOS ESPECÍFICOS POR SEGMENTO ===
function adaptarPorSegmento() {
    segmentoAtual = document.getElementById('segmento').value;

    const dicaDiv = document.getElementById('dicaSegmento');
    const camposDiv = document.getElementById('camposEspecificos');
    dicaDiv.innerHTML = '';
    camposDiv.innerHTML = '';
    camposDiv.classList.add('hidden');

    if (!segmentoAtual) {
        atualizarProgresso();
        return;
    }

    const modelos = {
        industria: {
            dica: '🏭 Indústria: Foco em produção, estoque e qualidade.',
            html: `
                <label for="tipoProducao">Tipo de Produção:</label>
                <select id="tipoProducao" onchange="atualizarProgresso()">
                    <option value="">Selecione...</option>
                    <option value="continua">Produção contínua</option>
                    <option value="lotes">Produção por lotes</option>
                    <option value="sob-encomenda">Sob encomenda</option>
                    <option value="mista">Mista</option>
                </select>`
        },
        varejo: {
            dica: '🛍️ Varejo: Foco em vendas, estoque e atendimento.',
            html: `
                <label for="tipoVarejo">Tipo de Varejo:</label>
                <select id="tipoVarejo" onchange="atualizarProgresso()">
                    <option value="">Selecione...</option>
                    <option value="fisico">Loja física</option>
                    <option value="online">E-commerce</option>
                    <option value="ambos">Físico + Online (Omnichannel)</option>
                </select>`
        },
        distribuicao: {
            dica: '🚚 Distribuição: Foco em logística, rotas e entregas.',
            html: `
                <label for="tipoDistribuicao">Tipo de Distribuição:</label>
                <select id="tipoDistribuicao" onchange="atualizarProgresso()">
                    <option value="">Selecione...</option>
                    <option value="regional">Regional</option>
                    <option value="nacional">Nacional</option>
                    <option value="internacional">Internacional</option>
                </select>`
        },
        servicos: {
            dica: '💼 Serviços: Foco em projetos, equipes e atendimento.',
            html: `
                <label for="tipoServico">Tipo de Serviço:</label>
                <select id="tipoServico" onchange="atualizarProgresso()">
                    <option value="">Selecione...</option>
                    <option value="consultoria">Consultoria</option>
                    <option value="manutencao">Manutenção</option>
                    <option value="tecnologia">Tecnologia/TI</option>
                    <option value="outros">Outros</option>
                </select>`
        }
    };

    const modelo = modelos[segmentoAtual];
    if (modelo) {
        dicaDiv.innerHTML = `<div class="dica">${modelo.dica}</div>`;
        camposDiv.innerHTML = modelo.html;
        camposDiv.classList.remove('hidden');
    }

    renderizarDificuldadesPorSegmento(segmentoAtual);
    atualizarProgresso();
}

// === FUNÇÃO: RENDERIZAR DIFICULDADES POR SEGMENTO ===
function renderizarDificuldadesPorSegmento(segmento) {
    const dificuldadesGrid = document.getElementById('dificuldadesCheckboxGrid');
    if (!dificuldadesGrid) return;

    dificuldadesGrid.innerHTML = '';
    const dificuldades = dificuldadesPorSegmento[segmento] || dificuldadesPorSegmento['default'];

    dificuldades.forEach(item => {
        const label = document.createElement('label');
        label.className = 'checkbox-item';
        label.innerHTML = `
            <input type="checkbox" id="${item.id}" onchange="atualizarProgresso()">
            <span class="checkbox-label">${item.label}</span>
        `;
        dificuldadesGrid.appendChild(label);
    });
}

// === FUNÇÃO DE VALIDAÇÃO PARA PORTE DE EMPRESA ===
function validarPorte() {
    const funcionarios = document.getElementById('funcionarios')?.value;
    const div = document.getElementById('validacaoPorte');
    if (!div) return;

    if (funcionarios === '1-5') {
        div.innerHTML = '<div class="alerta">⚠️ Empresa muito pequena – confirme se faz sentido a solução.</div>';
    } else if (funcionarios === '200+') {
        div.innerHTML = '<div class="erro">🚫 Fora do público-alvo da Detectabi. Considere parceiros.</div>';
    } else if (funcionarios) {
        div.innerHTML = '<div class="dica">✅ Porte ideal para a Detectabi!</div>';
    } else {
        div.innerHTML = '';
    }

    atualizarProgresso();
}

// === INICIALIZAÇÃO PADRÃO ===
document.addEventListener('DOMContentLoaded', () => {
    atualizarProgresso();
    renderizarDificuldadesPorSegmento('');
});
