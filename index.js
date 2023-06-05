async function buscarCep(cep){
    const cepUser = cep
    try{
        const response = await fetch(`https://viacep.com.br/ws/${cepUser}/json/`)
        const endereço = await response.json();

        if(endereço.erro){
            alert(`O CEP ${cepUser}, é Invalído`);
        }else{
            const resultado = {
                cep: endereço.cep,
                estado: endereço.uf,
                cidade: endereço.localidade,
                bairro: endereço.bairro
            }
            console.log(resultado);
            return resultado;
        }
    }catch (error) {
        console.log('Ocorreu um erro:', error);
      }
}


async function addUser(){
    let nameUser = document.getElementById('nameUser').value
    let emailUser = document.getElementById('emailUser').value
    let cepUser = document.getElementById('cepUser').value
    
    try {
        const enderecoUser = await buscarCep(cepUser);
        console.log(enderecoUser);
    
        const usuario = {
          nome: nameUser,
          email: emailUser,
          cep: enderecoUser.cep,
          estado: enderecoUser.estado,
          cidade: enderecoUser.cidade,
          bairro: enderecoUser.bairro
        };
    
        console.log(usuario);
    
        let usuarios = localStorage.getItem('usuarios');
        if (usuarios) {
          usuarios = JSON.parse(usuarios);
          usuarios.push(usuario);
        } else {
          usuarios = [usuario];
        }
    
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        showUsers();
      } catch (error) {
        console.log('Ocorreu um erro:', error);
      }
}

function showUsers() {
    const users = localStorage.getItem('usuarios');
    const arrayUsers = JSON.parse(users);
    let list = document.getElementById('listUsers')
    arrayUsers.forEach(user => {
      const itemLista = document.createElement('li')
      itemLista.textContent = `Nome: ${user.nome}, Email: ${user.email}, CEP: ${user.cep}, Estado: ${user.estado}, Cidade: ${user.cidade}, Bairro: ${user.bairro}`
      list.append(itemLista)
    });
}

showUsers()

function clearLocalStorage(){
    localStorage.clear()
}



