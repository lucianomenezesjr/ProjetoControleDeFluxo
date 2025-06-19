namespace ControleAcessoAPI.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Funcao { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string SenhaHash { get; set; } = string.Empty;
        public bool Ativo { get; set; } = true;

        public ICollection<RequisicaoDeAcesso>? RequisicoesFeitas { get; set; }
        public ICollection<RegistroAcesso>? RegistrosAutorizados { get; set; }
    }

}