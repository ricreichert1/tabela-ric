async function atualizarTabela() {
    const url = 'http://localhost:3000/rick/list'

    try {
        const resposta = await fetch(url)
        const registros = await resposta.json()

        var tabelaHTML = ''
        registros.forEach(function(registro) {
           var alturaFormatada = parseFloat((registro.altura || '').toString().replace(',', '.')).toFixed(2)
            tabelaHTML += `
                <tr>
                    <td>${registro.nome}</td>
                    <td>${registro.idade}</td>
                    <td>${alturaFormatada}</td>
                    <td>${registro.peso}</td>
                    <td>${registro.cpf}</td>
                    <td>${registro.dataRegistro}</td>
                </tr>
            `
        })

        $('#tabelaRegistros').html(tabelaHTML)

    } catch (error) {
        console.error('Erro ao atualizar a tabela:', error)
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

$(document).ready(function() {
    $('#alturaInput').mask('000,00', {reverse: true})

    $('#saveButton').on('click', function() {
        var obj = {}
        $('input').each(function(index, element) {
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
        $('#dataRegistroInput').val('')
    })

    atualizarTabela()
})
