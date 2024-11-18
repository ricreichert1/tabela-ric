async function atualizarTabela() {
    const url = 'http://localhost:3000/rick/list'

    try {
        const resposta = await fetch(url)
        const registros = await resposta.json()

        var tabelaHTML = ''
        registros.forEach(function (registro) {
            var alturaFormatada = parseFloat((registro.altura || '').toString().replace(',', '.')).toFixed(2)
            var dataRegistroFormatada = new Date(registro.dataregistro).toLocaleString()

            tabelaHTML += `
        <tr>
            <td>${registro.nome}</td>
            <td>${registro.idade}</td>
            <td>${alturaFormatada}</td>
            <td>${registro.peso}</td>
            <td>${registro.cpf}</td>
            <td>${dataRegistroFormatada}</td>
        </tr>
    `;
        });

        $('#tabelaRegistros').html(tabelaHTML);

    } catch (error) {
        console.error('Erro ao atualizar a tabela:', error);
    }
}

function validarCpf(res) {
    if (res === true) {
        alert('CPF REPETIDO')
    } else if (res === false) {
        console.log('CPF APROVADO')
        coletarDados()
    }

}

async function verificarCpf(cpf) {
    const url = `http://localhost:3000/rick/check-cpf/${cpf}`
    try {
        const resposta = await fetch(url)
        const resultado = await resposta.json()
        validarCpf(resultado.exists)
        return resultado.exists

    } catch (error) {
        // console.error('CPF repetido:', error)
        return false
    }
}

async function buscarMocorongo(teclasApertadas) {
    const url = `http://localhost:3000/rick/search/${teclasApertadas}`

    try {
        const resposta = await fetch(url)
        const registros = await resposta.json()
        var tabelaHTML = ''
        registros.forEach(function (registro) {
            var alturaFormatada = parseFloat((registro.altura || '').toString().replace(',', '.')).toFixed(2)
            var dataRegistroFormatada = new Date(registro.dataregistro).toLocaleString()

            tabelaHTML += `
                <tr>
                    <td>${registro.nome}</td>
                    <td>${registro.idade}</td>
                    <td>${alturaFormatada}</td>
                    <td>${registro.peso}</td>
                    <td>${registro.cpf}</td>
                    <td>${dataRegistroFormatada}</td>
                </tr>
            `
        })

        $('#tabelaRegistros').html(tabelaHTML)
    } catch (error) {
        console.error('Erro ao buscar registros:', error)
    }
}

async function enviarDados(dados) {
    const url = 'http://localhost:3000/rick/add'
    console.log("Enviando dados para:", url)

    try {
        const resposta = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: dados,
        })
        const resultado = await resposta.json()
        console.log(resultado)
        atualizarTabela()
    } catch (error) {
        console.error('Erro ao enviar dados:', error.message)
    }
}

function converterParaJson(dadosFormulario) {

    if (dadosFormulario.alturaInput) {
        dadosFormulario.alturaInput = dadosFormulario.alturaInput.replace(',', '.')
    }

    console.log(dadosFormulario)
    let dadosJson = JSON.stringify(dadosFormulario)
    console.log(dadosJson)
    enviarDados(dadosJson)
}

function verificarCPF(cpf) {
    console.log('cpfVerificado:', cpf)

}

function coletarDados() {
    var obj = {};
    $('input').each(function (index, element) {
        var val = $(this).val()
        var id = $(this).attr('id')
        obj[id] = val
    })

    converterParaJson(obj)

    $('#nomeInput').val('')
    $('#idadeInput').val('')
    $('#alturaInput').val('')
    $('#pesoInput').val('')
    $('#cpfInput').val('')
}

$(document).ready(function () {
    $('#alturaInput').mask('000,00', { reverse: true })

    $('#saveButton').on('click', async function () {
        var cpf = $('#cpfInput').val()
        verificarCpf(cpf)
    })

    $('#buscaInput').on('input', function () {
        var teclasApertadas = $(this).val()
        console.log("teste")
        if (teclasApertadas.length >= 2) {
            buscarMocorongo(teclasApertadas)
        } else if (teclasApertadas.length === 0) {
            atualizarTabela()
            console.log('zeroclicks')
        }
    })
    atualizarTabela()
    console.log('teste')
})
