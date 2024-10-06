class User {
    constructor(id, nome, email, senha, role = 'user', ativo = true) {
      this.id = id;
      this.nome = nome;
      this.email = email;
      this.senha = senha; // Armazene a senha com hash, nunca em texto plano!
      this.role = role; // 'admin' ou 'user'
      this.ativo = ativo; 
    }
}
  
export default User;