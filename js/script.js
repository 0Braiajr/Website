let ul = document.querySelector('nav .ul');

function openMenu(){
    ul.classList.add('open');
}

function closeMenu(){
    ul.classList.remove('open');
}

const ulrUF = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
const cidade = document.getElementById("cidade");
const uf = document.getElementById("uf");

uf.addEventListener('change', async function(){
    const urlCidades = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/'+uf.value+'/municipios';
    const request = await fetch(urlCidades);
    const response = await request.json();
    
    let options = ''
    response.forEach(function(cidades){
        options += '<option>'+cidades.nome+'</option>';
    });
    cidade.innerHTML = options;
});


window.addEventListener('load', async ()=>{
    const request = await fetch(ulrUF);
    const response = await request.json();

    const options = document.createElement("optgroup");
    options.setAttribute('label','Estados');
    response.forEach(function(uf){
        options.innerHTML += '<option>'+uf.sigla+'</option>';
    });

    uf.append(options);

});


// Função de cálculo do sistema solar com payback
function calcularPotenciaSistemaSolarComPayback(irrad_solar_diaria, area_instalacao, eficiencia_painel, fator_perda, custo_por_watt, custo_energia_atual, consumo_mensal) {
    const energia_gerada_por_m2 = irrad_solar_diaria * eficiencia_painel * fator_perda;
    const energia_total_gerada_diaria = energia_gerada_por_m2 * area_instalacao;
    const energia_total_gerada_mensal = energia_total_gerada_diaria * 30;

    const potencia_total = energia_total_gerada_mensal / (irrad_solar_diaria * 30);
    const custo_sistema = potencia_total * 1000 * custo_por_watt;
    const economia_mensal = Math.min(energia_total_gerada_mensal, consumo_mensal) * custo_energia_atual;

    let payback_meses, payback_anos;
    if (economia_mensal > 0) {
        payback_meses = custo_sistema / economia_mensal;
        payback_anos = payback_meses / 12;
    } else {
        payback_meses = Infinity;
        payback_anos = Infinity;
    }

    return {
        potencia_total: potencia_total.toFixed(2),
        custo_sistema: custo_sistema.toFixed(2),
        economia_mensal: economia_mensal.toFixed(2),
        payback_meses: payback_meses.toFixed(0),
        payback_anos: payback_anos.toFixed(2)
    };
}

// Variáveis globais
const irrad_solar_diaria = 5.5;
const area_instalacao = 50;
const eficiencia_painel = 0.18;
const fator_perda = 0.8;
const custo_por_watt = 3.0;
const custo_energia_atual = 0.6;

// Lógica para capturar o clique do botão e calcular os resultados
document.getElementById('calculate').addEventListener('click', () => {
    const consumoMensalInput = document.getElementById('consumo_mensal').value;
    const consumo_mensal = parseFloat(consumoMensalInput);

    // Capturando os valores dos selects
    const projeto = document.getElementById('projeto').value;
    const estado = document.getElementById('uf').value;
    const cidade = document.getElementById('cidade').value;

    // Verificando se o valor inserido é válido
    if (!isNaN(consumo_mensal) && consumo_mensal > 0) {
        const resultados = calcularPotenciaSistemaSolarComPayback(
            irrad_solar_diaria,
            area_instalacao,
            eficiencia_painel,
            fator_perda,
            custo_por_watt,
            custo_energia_atual,
            consumo_mensal
        );

        // Atualizando as informações de projeto, local e custo mensal no HTML
        document.getElementById('projeto_resultado').textContent = `Projeto: ${projeto}`;
        document.getElementById('local_resultado').textContent = `Local: ${cidade}, ${estado}`;
        document.getElementById('custo_mensal_resultado').textContent = `Custo Mensal: R$ ${consumo_mensal.toFixed(2)}`;

        // Mostrando os resultados do cálculo no HTML
        document.getElementById('investimento').textContent = `Investimento aproximado: R$ ${resultados.custo_sistema}`;
        document.getElementById('payback').textContent = `Payback aproximado: ${resultados.payback_meses} meses (${resultados.payback_anos} anos)`;

        // Tornando os resultados visíveis
        document.getElementById('infos').classList.remove('hidden');
        document.getElementById('infos').classList.add('visible');
    } else {
        alert("Por favor, insira um valor válido para o consumo mensal.");
    }
});
