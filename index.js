function mostrarRegistros(registros) {
    console.log(registros)
    var tabelaHTML = ''
    registros.forEach(function (registro) {
        var alturaFormatada = parseFloat((registro.altura || '').toString().replace(',', '.')).toFixed(2)
        var dataRegistroFormatada = new Date(registro.dataregistro).toLocaleString()

        tabelaHTML += `
            <tr id="registro-${registro.cpf}">
                <td>${registro.nome}</td>
                <td>${registro.idade}</td>
                <td>${alturaFormatada}</td>
                <td>${registro.peso}</td>
                <td>${registro.cpf}</td>
                <td>${dataRegistroFormatada}</td>
                <td><button onclick="editarRegistro('${registro.cpf}')">Editar</button></td>
                <td><button onclick="deletarRegistro('${registro.cpf}')">Deletar</button></td>
            </tr>
        `
    })
    $('#tabelaRegistros').html(tabelaHTML)
}

async function editarRegistro(cpf) {
    var linha = $(`td:contains(${cpf})`).closest('tr')
    
    var dados = []
    
    linha.find('td').each(function(index, td) {
        dados.push($(td).text())
    })

    $('#nomeInput').val(dados[0])
    $('#idadeInput').val(dados[1])
    $('#alturaInput').val(dados[2].replace(".",","))
    $('#pesoInput').val(dados[3])
    $('#cpfInput').val(dados[4])

    await deletarRegistroBanco(cpf)
    
    linha.remove()
}

async function deletarRegistroBanco(cpf) {
    const url = `http://localhost:3000/rick/delete/${cpf}`
    
    try {
        const resposta = await fetch(url, {
            method: 'DELETE',
        });
        
        const resultado = await resposta.json()
        
        if (resposta.ok) {
            console.log('Mocorongo deletado do banco de dados.')
        } else {
            alert(resultado.message || 'Erro ao deletar mocorongo.')
        }
    } catch (error) {
        console.error('Erro ao tentar deletar mocorongo:', error)
        alert('Erro ao tentar deletar mocorongo.')
    }
}

async function deletarRegistro(cpf) {
    var url = `http://localhost:3000/rick/delete/${cpf}`

    try {
        var resposta = await fetch(url, {
            method: 'DELETE',
        });
        var resultado = await resposta.json()
        if (resposta.ok) {
            alert(resultado.message)
            $(`#registro-${cpf}`).remove()
        } else {
            alert(resultado.message || 'Erro ao deletar registro.')
        }
    } catch (error) {
        console.error('Erro ao tentar deletar o registro:', error)
        alert('Erro ao tentar deletar o registro.')
    }
}



async function atualizarTabela() {
    const url = 'http://localhost:3000/rick/list'

    try {
        const resposta = await fetch(url)
        const registros = await resposta.json()

        mostrarRegistros(registros)

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
//teste
async function buscarMocorongo(teclasApertadas) {
    const url = `http://localhost:3000/rick/search/${teclasApertadas}`

    try {
        
        const resposta = await fetch(url)
        const registros = await resposta.json()
        mostrarRegistros(registros)
       
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
