using System.ComponentModel.DataAnnotations;

namespace ControleAcessoAPI.Models
{
    public class RegistroAcesso
    {
        public int Id { get; set; }

        [Required]
        public int AlunoId { get; set; }
        public Aluno Aluno { get; set; } = null!;

        [Required]
        public DateTime DataEntrada { get; set; }

        public DateTime? DataSaida { get; set; }

        public int? AcessoAutorizadoPorId { get; set; }
        public Usuario? AcessoAutorizadoPor { get; set; }

        [Required]
        [StringLength(10)]
        [RegularExpression("entrada|saida", ErrorMessage = "Tipo inválido.")]
        public string Tipo { get; set; } = "entrada";

        [StringLength(200)]
        public string? Observacoes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Permitido, mas o banco pode sobrescrever com DEFAULT
    }
}