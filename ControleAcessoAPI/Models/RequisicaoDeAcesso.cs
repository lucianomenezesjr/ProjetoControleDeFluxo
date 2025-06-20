using System.ComponentModel.DataAnnotations;

namespace ControleAcessoAPI.Models
{
    public class RequisicaoDeAcesso
    {
        public int Id { get; set; }

        [Required]
        public int AlunoId { get; set; }
        public Aluno Aluno { get; set; } = null!;

        [Required]
        public DateTime DataEntrada { get; set; }

        public DateTime? DataSaida { get; set; }

        public int? RequisicaoPorId { get; set; }
        public Usuario? RequisicaoPor { get; set; }

        [Required]
        [StringLength(20)]
        [RegularExpression("pendente|aprovada|recusada|cancelada", ErrorMessage = "Status inválido.")]
        public string Status { get; set; } = "pendente";

        [StringLength(200)]
        public string? Motivo { get; set; }

        public DateTime DataSolicitacao { get; set; } = DateTime.UtcNow; // Permitido, mas o banco pode sobrescrever com DEFAULT
    }
}