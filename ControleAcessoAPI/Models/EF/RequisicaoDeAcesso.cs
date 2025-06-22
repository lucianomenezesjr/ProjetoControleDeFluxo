namespace ControleAcessoAPI.Models.EF // nova pasta ou namespace opcional
{
    public class RequisicaoDeAcesso
    {
        public int Id { get; set; }

        public int AlunoId { get; set; }

        public int RequisicaoPor { get; set; }

        public string Status { get; set; } = "pendente";

        public string Motivo { get; set; } = string.Empty;

        public DateTime DataSolicitacao { get; set; }

        public DateTime? HorarioEntradaOuSaida { get; set; }

        public Aluno? Aluno { get; set; }

        public Usuario? RequisicaoPorNavigation { get; set; }
    }
}
