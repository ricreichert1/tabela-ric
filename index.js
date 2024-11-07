

let y = {nomeInput: 'jhyu', idadeInput: '546', alturaInput: '654', pesoInput: '4'}

function objToJsonTest(test) {
    console.log(test)
    let x = JSON.stringify(test)
    console.log(x)
    enviarDados(x)
}

async function enviarDados(x) {
    const url = 'http://localhost:3000/rick/add';
    console.log("Enviando dados para:", url);
    
    try {
        const resposta = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: x,
        });

        const resultado = await resposta.json();
        console.log(resultado);
    } catch (error) {
        console.error('Erro ao enviar dados:', error.message);
    }
}


$(document).ready(function(){
   $('#saveButton').on('click', function(){
       var obj = {}
       $('input').each(function(index, element){
           var val = $(this).val()
           var id = $(this).attr('id') 
           obj[id] = val
       })
       console.log(obj)
    //    enviarDados(obj)
    objToJsonTest(obj)
   })
})
