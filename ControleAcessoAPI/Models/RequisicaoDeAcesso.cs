namespace ControleAcessoAPI.Models
{
    public class RequisicaoDeAcesso
    {
        public int Id { get; set; }

        public int AlunoId { get; set; }
        public Aluno Aluno { get; set; } = null!;

        public DateTime DataEntrada { get; set; }
        public DateTime? DataSaida { get; set; }

        public int? RequisicaoPorId { get; set; }
        public Usuario? RequisicaoPor { get; set; }

        public string Status { get; set; } = "pendente"; // pendente, aprovada, recusada, cancelada
        public string? Motivo { get; set; }

        public DateTime DataSolicitacao { get; set; } = DateTime.UtcNow;
    }

}