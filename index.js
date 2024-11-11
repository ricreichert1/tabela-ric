async function atualizarTabela() {
    const url = 'http://localhost:3000/rick/list'

    try {
        const resposta = await fetch(url)
        const registros = await resposta.json()

        let tabelaHTML = ''
        registros.forEach(function(registro) {
            tabelaHTML += `
                <tr>
                    <td>${registro.nome}</td>
                    <td>${registro.idade}</td>
                    <td>${registro.altura}</td>
                    <td>${registro.peso}</td>
                </tr>
            `
        })

        document.getElementById('tabelaRegistros').innerHTML = tabelaHTML
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

function toJson(teste) {
    console.log(teste)
    let dota = JSON.stringify(teste)
    console.log(dota)
    enviarDados(dota)
}

$(document).ready(function() {
    $('#saveButton').on('click', function() {
        var obj = {}
        $('input').each(function(index, element) {
            var val = $(this).val()
            var id = $(this).attr('id')
            obj[id] = val
        })

        toJson(obj)


        $('#nomeInput').val('')
        $('#idadeInput').val('')
        $('#alturaInput').val('')
        $('#pesoInput').val('')
    })

    atualizarTabela()
})
